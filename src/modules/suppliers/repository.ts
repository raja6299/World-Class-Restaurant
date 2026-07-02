import { prisma } from '@/src/lib/prisma';
import { Supplier } from '@prisma/client';

export class SupplierRepository {
  static async findAll(branchId?: string): Promise<Supplier[]> {
    const where = branchId ? { branchId } : {};
    return await prisma.supplier.findMany({ where, orderBy: { name: 'asc' } });
  }

  static async findPurchaseOrders(branchId?: string) {
    const where = branchId ? { branchId } : {};
    return await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
