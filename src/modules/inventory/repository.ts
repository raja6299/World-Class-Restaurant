import { prisma } from '@/src/lib/prisma';
import { Ingredient, WasteLog } from '@prisma/client';

export class InventoryRepository {
  static async findAll(branchId?: string): Promise<Ingredient[]> {
    const where = branchId ? { branchId } : {};
    return await prisma.ingredient.findMany({ where, orderBy: { name: 'asc' } });
  }

  static async findLowStock(branchId?: string): Promise<Ingredient[]> {
    const where = branchId ? { branchId } : {};
    return await prisma.ingredient.findMany({
      where: {
        ...where,
        currentQuantity: { lte: prisma.ingredient.fields.minimumThreshold },
      },
      orderBy: { currentQuantity: 'asc' },
    });
  }

  static async logWaste(data: { ingredientId: string; quantity: number; reason: string; cost: number }): Promise<WasteLog> {
    const ingredient = await prisma.ingredient.findUnique({ where: { id: data.ingredientId } });
    if (!ingredient) throw new Error('Ingredient not found');
    
    if (ingredient.currentQuantity < data.quantity) {
      throw new Error('Waste quantity exceeds current stock');
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Create waste log
      const log = await tx.wasteLog.create({
        data: {
          ingredientId: data.ingredientId,
          quantity: data.quantity,
          reason: data.reason,
          cost: data.cost,
        },
      });

      // 2. Reduce stock
      await tx.ingredient.update({
        where: { id: data.ingredientId },
        data: { currentQuantity: { decrement: data.quantity } },
      });

      return log;
    });
  }
}
