import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class CartRepository {
  static async findActiveBySession(diningSessionId: string) {
    return await prisma.cart.findFirst({
      where: { diningSessionId, status: 'ACTIVE' },
      include: { items: { include: { menuItem: true } } },
    });
  }

  static async create(diningSessionId: string) {
    return await prisma.cart.create({
      data: { diningSessionId, status: 'ACTIVE' },
      include: { items: { include: { menuItem: true } } }
    });
  }

  static async addItem(cartId: string, data: { menuItemId: string, quantity: number, notes?: string, modifiers?: Prisma.InputJsonValue, unitPrice: number, totalPrice: number }) {
    return await prisma.cartItem.create({
      data: { cartId, ...data }
    });
  }

  static async updateTotals(cartId: string, data: { subTotal: number; taxTotal: number; discountTotal: number; grandTotal: number }) {
    return await prisma.cart.update({
      where: { id: cartId },
      data,
    });
  }
}
