import { prisma } from '@/src/lib/prisma';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export class AnalyticsService {
  static async getExecutiveKPIs(branchId?: string) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const yesterdayStart = startOfDay(subDays(today, 1));
    const yesterdayEnd = endOfDay(subDays(today, 1));

    const branchFilter = branchId ? { branchId } : {};

    // 1. Today's Revenue
    const todayOrders = await prisma.order.findMany({
      where: {
        ...branchFilter,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 2. Yesterday's Revenue
    const yesterdayOrders = await prisma.order.findMany({
      where: {
        ...branchFilter,
        createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
      },
    });
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate percentage change
    let revenueChange = 0;
    if (yesterdayRevenue > 0) {
      revenueChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    }

    // 3. Active Tables
    const totalTables = await prisma.table.count({ where: branchFilter });
    const activeTables = await prisma.table.count({
      where: {
        ...branchFilter,
        status: { not: 'AVAILABLE' },
      },
    });

    // 4. Pending Orders (Kitchen Queue)
    const pendingOrders = await prisma.order.count({
      where: {
        ...branchFilter,
        status: { in: ['NEW', 'PREPARING'] },
      },
    });

    // 5. Low Inventory Alerts
    // We can't directly compare fields in count without raw query, so we do findMany and filter
    // Actually the previous implementation used `{ currentQuantity: { lte: prisma.ingredient.fields.minimumThreshold } }` which works in Prisma 5
    const ingredients = await prisma.ingredient.findMany({
      where: branchFilter
    });
    const lowInventoryCount = ingredients.filter(i => i.currentQuantity <= i.minimumThreshold).length;

    // 6. Top Waiters Today (Performance)
    const staffPerformance = await prisma.staffAnalytics.findMany({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        user: { restaurant: { branches: { some: branchId ? { id: branchId } : {} } } }
      },
      include: {
        user: true
      },
      orderBy: { ordersCompleted: 'desc' },
      take: 5
    });

    return {
      todayRevenue,
      yesterdayRevenue,
      revenueChange,
      activeTables,
      totalTables,
      pendingOrders,
      lowInventoryCount,
      staffPerformance
    };
  }

  static async exportEnterpriseReport(branchId: string, startDate: Date, endDate: Date): Promise<string> {
    const orders = await prisma.order.findMany({
      where: {
        branchId,
        createdAt: { gte: startDate, lte: endDate }
      },
      include: {
        items: { include: { menuItem: true } }
      }
    });

    let csv = 'OrderID,Date,TotalAmount,Status\n';
    orders.forEach(order => {
      csv += `${order.id},${order.createdAt.toISOString()},${order.totalAmount},${order.status}\n`;
    });

    return csv;
  }
}
