import { OrderRepository } from './repository';
import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

export class OrderService {
  static async convertCartToOrder(cartId: string, userId?: string) {
    // 1. Fetch Cart with Items and MenuItem details
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: { include: { menuItem: { include: { category: true } } } },
        diningSession: true,
      }
    });

    if (!cart) throw new Error('Cart not found');
    if (cart.status !== 'ACTIVE') throw new Error('Cart is not active');

    // 2. Map items for snapshot creation
    const orderItemsPayload = cart.items.map(cartItem => {
      const menu = cartItem.menuItem;
      return {
        menuItemId: menu?.id,
        quantity: cartItem.quantity,
        notes: cartItem.notes,
        modifiers: (cartItem.modifiers as Prisma.InputJsonValue) || [],
        discount: 0, // Implement item-level discount if needed
        price: cartItem.unitPrice, // the final price

        // The Snapshot
        snapshotName: menu?.name || 'Unknown Item',
        snapshotPrice: menu?.price || cartItem.unitPrice,
        snapshotImage: menu?.imageUrl,
        snapshotCategory: menu?.category?.name,
        snapshotGst: 0, // Depending on branch setting vs item setting
        snapshotPrepTime: menu?.preparationTime,
      };
    });

    // 3. Create the Order Transaction
    const order = await OrderRepository.createOrderWithEvents({
      branchId: cart.diningSession.branchId,
      diningSessionId: cart.diningSessionId,
      status: 'CREATED',
      subTotal: cart.subTotal,
      taxAmount: cart.taxTotal,
      discountAmount: cart.discountTotal,
      serviceCharge: 0, // assuming included or handle explicitly
      totalAmount: cart.grandTotal,
      items: orderItemsPayload,
      userId,
    });

    // 4. Mark Cart as CONVERTED
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: 'CONVERTED' }
    });

    return order;
  }

  static async progressOrder(orderId: string, nextStatus: string, userId?: string, notes?: string) {
    // Valid transitions could be checked here
    return await OrderRepository.updateOrderStatus(orderId, nextStatus, userId, notes);
  }
}
