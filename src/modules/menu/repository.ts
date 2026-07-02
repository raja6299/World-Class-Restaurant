import { prisma } from '@/src/lib/prisma';
import { CategoryFormData, ModifierGroupFormData, MenuItemFormData } from './validation';
import { AuditLogger } from '@/src/lib/audit';

export class MenuRepository {
  // --- CATEGORIES ---
  static async getCategories(branchId: string) {
    return prisma.category.findMany({
      where: { branchId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async createCategory(branchId: string, data: CategoryFormData) {
    return prisma.category.create({
      data: {
        branchId,
        name: data.name,
        sortOrder: data.sortOrder,
      }
    });
  }

  static async updateCategory(id: string, data: CategoryFormData) {
    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        sortOrder: data.sortOrder,
      }
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // --- MODIFIER GROUPS ---
  static async getModifierGroups(menuItemId: string) {
    return prisma.modifierGroup.findMany({
      where: { menuItemId },
      include: { modifiers: true },
    });
  }

  static async createModifierGroup(menuItemId: string, data: ModifierGroupFormData) {
    return prisma.modifierGroup.create({
      data: {
        menuItemId,
        name: data.name,
        isRequired: data.isRequired,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
        modifiers: {
          create: data.modifiers.map(m => ({
            name: m.name,
            extraPrice: m.extraPrice,
            isAvailable: m.isAvailable
          }))
        }
      }
    });
  }

  static async updateModifierGroup(id: string, data: ModifierGroupFormData) {
    // For simplicity, delete old modifiers and recreate (or do a complex sync)
    await prisma.modifierItem.deleteMany({ where: { modifierGroupId: id } });
    
    return prisma.modifierGroup.update({
      where: { id },
      data: {
        name: data.name,
        isRequired: data.isRequired,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
        modifiers: {
          create: data.modifiers.map(m => ({
            name: m.name,
            extraPrice: m.extraPrice,
            isAvailable: m.isAvailable
          }))
        }
      }
    });
  }

  static async deleteModifierGroup(id: string) {
    return prisma.modifierGroup.delete({
      where: { id }
    });
  }

  // --- MENU ITEMS ---
  static async getMenuItems(branchId: string) {
    return prisma.menuItem.findMany({
      where: { branchId, deletedAt: null },
      include: {
        category: true,
        modifierGroups: {
          include: { modifiers: true }
        }
      },
      orderBy: { name: 'asc' },
    });
  }

  static async createMenuItem(branchId: string, data: MenuItemFormData) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.menuItem.create({
        data: {
          branchId,
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          isAvailable: data.isAvailable,
          preparationTime: data.preparationTime,
          isVeg: data.isVeg,
          isPureVeg: data.isPureVeg,
          isJain: data.isJain,
          isSwaminarayan: data.isSwaminarayan,
          isHalal: data.isHalal,
          isEgg: data.isEgg,
          isNonVeg: data.isNonVeg,
          spiceLevel: data.spiceLevel,
        }
      });

      const auditPayload = await AuditLogger.log({
        module: 'MENU',
        action: 'CREATE',
        newValue: item,
        branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return item;
    });
  }

  static async updateMenuItem(id: string, data: MenuItemFormData) {
    return prisma.$transaction(async (tx) => {
      const oldItem = await tx.menuItem.findUnique({ where: { id } });
      const updated = await tx.menuItem.update({
        where: { id },
        data: {
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          isAvailable: data.isAvailable,
          preparationTime: data.preparationTime,
          isVeg: data.isVeg,
          isPureVeg: data.isPureVeg,
          isJain: data.isJain,
          isSwaminarayan: data.isSwaminarayan,
          isHalal: data.isHalal,
          isEgg: data.isEgg,
          isNonVeg: data.isNonVeg,
          spiceLevel: data.spiceLevel,
        }
      });

      const auditPayload = await AuditLogger.log({
        module: 'MENU',
        action: 'UPDATE',
        oldValue: oldItem,
        newValue: updated,
        branchId: updated.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return updated;
    });
  }

  static async deleteMenuItem(id: string) {
    return prisma.$transaction(async (tx) => {
      const oldItem = await tx.menuItem.findUnique({ where: { id } });
      const deleted = await tx.menuItem.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      const auditPayload = await AuditLogger.log({
        module: 'MENU',
        action: 'DELETE',
        oldValue: oldItem,
        newValue: deleted,
        branchId: deleted.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return deleted;
    });
  }
}
