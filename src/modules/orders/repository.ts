import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';
export class OrderRepository {
  static async createOrderWithEvents(data: {
    branchId: string;
    diningSessionId: string;
    status: string;
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    serviceCharge: number;
    totalAmount: number;
    items: {
      menuItemId: string;
      quantity: number;
      notes?: string | null;
      modifiers?: Prisma.InputJsonValue;
      discount?: number;
      price: number;
      snapshotName: string;
      snapshotPrice: number;
      snapshotImage?: string | null;
      snapshotCategory?: string | null;
      snapshotGst?: number;
      snapshotPrepTime?: number | null;
    }[];
    userId?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          branchId: data.branchId,
          diningSessionId: data.diningSessionId,
          status: data.status,
          subTotal: data.subTotal,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          serviceCharge: data.serviceCharge,
          totalAmount: data.totalAmount,
        }
      });

      // 2. Create the Order Items (Snapshots)
      await tx.orderItem.createMany({
        data: data.items.map(item => ({
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes,
          modifiers: item.modifiers,
          discount: item.discount ?? 0,
          price: item.price,
          status: 'PENDING',
          // Snapshots
          snapshotName: item.snapshotName,
          snapshotPrice: item.snapshotPrice,
          snapshotImage: item.snapshotImage,
          snapshotCategory: item.snapshotCategory,
          snapshotGst: item.snapshotGst ?? 0,
          snapshotPrepTime: item.snapshotPrepTime,
        }))
      });

      // 3. Log the CREATED Event
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: data.status,
          userId: data.userId,
          notes: 'Order placed initially',
        }
      });

      return order;
    });
  }

  static async updateOrderStatus(orderId: string, status: string, userId?: string, notes?: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status }
      });

      await tx.orderEvent.create({
        data: {
          orderId,
          status,
          userId,
          notes,
        }
      });

      return order;
    });
  }

  static async getOrderTimeline(orderId: string) {
    return await prisma.orderEvent.findMany({
      where: { orderId },
      orderBy: { timestamp: 'asc' },
    });
  }
}
