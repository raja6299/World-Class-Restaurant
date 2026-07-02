import { prisma } from '@/src/lib/prisma';

export class NotificationService {
  /**
   * Dispatches a notification to specific roles in a branch
   */
  static async dispatch(branchId: string, type: string, message: string, roles: string[] = []) {
    const notification = await prisma.notification.create({
      data: {
        branchId,
        type,
        message,
        roles
      }
    });

    // In a real application, Supabase Realtime automatically broadcasts INSERT events
    // on the 'Notification' table. Clients subscribed to the channel will receive this.
    return notification;
  }

  /**
   * Fetch unread notifications for a user based on their role
   */
  static async getUnread(branchId: string, role: string) {
    const allUnread = await prisma.notification.findMany({
      where: {
        branchId,
        isRead: false
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Filter JSON array manually in service layer to avoid complex Postgres JSON queries in Prisma
    return allUnread.filter(n => {
      if (!n.roles) return true; // Global
      try {
        const rolesArr = n.roles as string[];
        return Array.isArray(rolesArr) && rolesArr.includes(role);
      } catch {
        return false;
      }
    });
  }

  static async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }
}
