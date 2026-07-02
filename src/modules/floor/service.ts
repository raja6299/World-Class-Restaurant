import { prisma } from '@/src/lib/prisma';

export class FloorService {
  /**
   * Gets all tables for a branch with their live statuses and active sessions.
   */
  static async getFloorMap(branchId: string) {
    return await prisma.table.findMany({
      where: { branchId },
      include: {
        sessions: {
          where: { status: 'ACTIVE' },
          take: 1,
          include: {
            orders: {
              where: { status: { notIn: ['COMPLETED', 'ARCHIVED', 'CANCELLED'] } }
            }
          }
        }
      },
      orderBy: [
        { floor: 'asc' },
        { tableNumber: 'asc' }
      ]
    });
  }

  /**
   * Update a table's status manually
   */
  static async updateTableStatus(tableId: string, status: string, userId: string) {
    const table = await prisma.table.update({
      where: { id: tableId },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        branchId: table.branchId,
        userId,
        module: 'FLOOR',
        action: 'UPDATE_TABLE_STATUS',
        newValue: { status }
      }
    });

    return table;
  }
}
