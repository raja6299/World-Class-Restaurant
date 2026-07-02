import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { AppError } from '@/src/lib/errors';
import { NotificationService } from '../notifications/service';

const OrderStatusSchema = z.enum([
  'NEW',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'SERVED',
  'COMPLETED',
  'ARCHIVED',
  'CANCELLED'
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

const STATE_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['PICKED_UP', 'SERVED'],
  PICKED_UP: ['SERVED'],
  SERVED: ['COMPLETED'],
  COMPLETED: ['ARCHIVED'],
  ARCHIVED: [],
  CANCELLED: []
};

export class KitchenService {
  /**
   * Updates an order's status enforcing the strict state machine.
   * Only managers can override the state machine.
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId: string,
    isManager: boolean = false
  ) {
    const validatedStatus = OrderStatusSchema.parse(newStatus);

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { branch: true } });
      if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');

      const currentStatus = order.status as OrderStatus;

      // Validate Transition
      if (!isManager) {
        const allowedNextStates = STATE_TRANSITIONS[currentStatus];
        if (!allowedNextStates?.includes(validatedStatus)) {
          throw new AppError(
            `Invalid state transition from ${currentStatus} to ${validatedStatus}`,
            400,
            'VALIDATION_ERROR'
          );
        }
      }

      // Update Order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: validatedStatus },
      });

      // Record Event
      await tx.orderEvent.create({
        data: {
          orderId,
          status: validatedStatus,
          userId,
        },
      });

      // Dispatch Notification
      let notificationType = null;
      if (validatedStatus === 'ACCEPTED') notificationType = 'ORDER_ACCEPTED';
      if (validatedStatus === 'READY') notificationType = 'ORDER_READY';

      if (notificationType) {
        await NotificationService.dispatch(
          order.branchId,
          notificationType,
          `Order #${order.id.slice(0, 8)} is now ${validatedStatus}`,
          ['WAITER', 'MANAGER']
        );
      }

      // Deduct Inventory on Completion
      if (validatedStatus === 'COMPLETED') {
        // TODO: Implement InventoryService.deductForOrder(orderId, userId);
      }

      return updatedOrder;
    });
  }

  /**
   * Retrieves the live kitchen queue ordered by time and priority.
   */
  static async getLiveQueue(branchId: string) {
    const activeOrders = await prisma.order.findMany({
      where: {
        branchId,
        status: { in: ['NEW', 'ACCEPTED', 'PREPARING'] },
      },
      include: {
        items: true,
        diningSession: {
          include: { table: true }
        }
      },
      orderBy: { createdAt: 'asc' },
    });

    return activeOrders;
  }
}
