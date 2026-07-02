import { prisma } from '@/src/lib/prisma';
import { SupplierFormData, IngredientFormData, PurchaseOrderFormData, SupplierSchema, IngredientSchema, PurchaseOrderSchema } from './validation';
import { NotFoundError } from '@/src/lib/errors';
import { AuditLogger } from '@/src/lib/audit';

export class InventoryService {
  static async getDashboardData(branchId?: string) {
    const branchFilter = branchId ? { branchId } : {};
    
    // Fallback if we can't filter by minimumThreshold effectively
    const allItems = await prisma.ingredient.findMany({ where: branchFilter });
    const lowStockCount = allItems.filter(i => i.currentQuantity <= i.minimumThreshold).length;
    
    // Calculate est value (mocked as 0 for now since we don't have cost price in schema, or maybe we do?)
    const totalValue = 0;

    return { 
      metrics: {
        totalItems: allItems.length,
        lowStockCount,
        totalValue
      },
      allItems
    };
  }

  // --- SUPPLIERS ---
  static async getSuppliers(branchId: string) {
    return prisma.supplier.findMany({
      where: { branchId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  static async createSupplier(branchId: string, data: SupplierFormData) {
    const validated = SupplierSchema.parse(data);
    return prisma.$transaction(async (tx) => {
      const supplier = await tx.supplier.create({
        data: { branchId, ...validated }
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_SUPPLIERS',
        action: 'CREATE',
        newValue: supplier,
        branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return supplier;
    });
  }

  static async updateSupplier(id: string, data: SupplierFormData) {
    const validated = SupplierSchema.parse(data);
    return prisma.$transaction(async (tx) => {
      const old = await tx.supplier.findUnique({ where: { id } });
      const updated = await tx.supplier.update({
        where: { id },
        data: validated
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_SUPPLIERS',
        action: 'UPDATE',
        oldValue: old,
        newValue: updated,
        branchId: updated.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return updated;
    });
  }

  static async deleteSupplier(id: string) {
    return prisma.$transaction(async (tx) => {
      const old = await tx.supplier.findUnique({ where: { id } });
      const deleted = await tx.supplier.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_SUPPLIERS',
        action: 'DELETE',
        oldValue: old,
        newValue: deleted,
        branchId: deleted.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return deleted;
    });
  }

  // --- INGREDIENTS ---
  static async getIngredients(branchId: string) {
    return prisma.ingredient.findMany({
      where: { branchId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  static async createIngredient(branchId: string, data: IngredientFormData) {
    const validated = IngredientSchema.parse(data);
    return prisma.$transaction(async (tx) => {
      const ingredient = await tx.ingredient.create({
        data: { branchId, ...validated }
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_INGREDIENTS',
        action: 'CREATE',
        newValue: ingredient,
        branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return ingredient;
    });
  }

  static async updateIngredient(id: string, data: IngredientFormData) {
    const validated = IngredientSchema.parse(data);
    return prisma.$transaction(async (tx) => {
      const old = await tx.ingredient.findUnique({ where: { id } });
      const updated = await tx.ingredient.update({
        where: { id },
        data: validated
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_INGREDIENTS',
        action: 'UPDATE',
        oldValue: old,
        newValue: updated,
        branchId: updated.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return updated;
    });
  }

  static async deleteIngredient(id: string) {
    return prisma.$transaction(async (tx) => {
      const old = await tx.ingredient.findUnique({ where: { id } });
      const deleted = await tx.ingredient.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_INGREDIENTS',
        action: 'DELETE',
        oldValue: old,
        newValue: deleted,
        branchId: deleted.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return deleted;
    });
  }

  // --- PURCHASE ORDERS ---
  static async getPurchaseOrders(branchId: string) {
    return prisma.purchaseOrder.findMany({
      where: { branchId, deletedAt: null },
      include: {
        supplier: true,
        items: {
          include: { ingredient: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createPurchaseOrder(branchId: string, data: PurchaseOrderFormData) {
    const validated = PurchaseOrderSchema.parse(data);
    
    // Calculate total
    const totalAmount = validated.items.reduce((sum, item) => sum + (item.orderedQuantity * item.unitPrice), 0);

    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          branchId,
          supplierId: validated.supplierId,
          status: validated.status,
          totalAmount,
          expectedOn: validated.expectedOn ? new Date(validated.expectedOn) : null,
          items: {
            create: validated.items.map(item => ({
              ingredientId: item.ingredientId,
              orderedQuantity: item.orderedQuantity,
              unitPrice: item.unitPrice,
              totalPrice: item.orderedQuantity * item.unitPrice,
            }))
          }
        }
      });
      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_PO',
        action: 'CREATE',
        newValue: po,
        branchId,
      });
      await tx.auditLog.create({ data: auditPayload });
      return po;
    });
  }

  static async updatePurchaseOrderStatus(id: string, status: string) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({ where: { id }, include: { items: true } });
      if (!po) throw new NotFoundError('PO not found');

      const result = await tx.purchaseOrder.update({
        where: { id },
        data: { status, ...(status === 'RECEIVED' ? { receivedOn: new Date() } : {}) }
      });

      // If RECEIVED, update ingredient stock levels
      if (status === 'RECEIVED' && po.status !== 'RECEIVED') {
        for (const item of po.items) {
          await tx.ingredient.update({
            where: { id: item.ingredientId },
            data: {
              currentQuantity: { increment: item.orderedQuantity }
            }
          });
        }
      }

      const auditPayload = await AuditLogger.log({
        module: 'INVENTORY_PO',
        action: 'UPDATE_STATUS',
        oldValue: { status: po.status },
        newValue: { status },
        branchId: result.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return result;
    });
  }
}
