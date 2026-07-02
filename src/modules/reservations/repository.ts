import { prisma } from '@/src/lib/prisma';
import { Reservation } from '@prisma/client';

export class ReservationRepository {
  static async create(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>) {
    return await prisma.reservation.create({
      data,
    });
  }

  static async updateStatus(id: string, status: string) {
    return await prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }

  static async findUpcoming(branchId: string, date: Date) {
    // Only return today's forward reservations
    return await prisma.reservation.findMany({
      where: {
        branchId,
        date: { gte: date },
        status: { notIn: ['CANCELLED', 'NO_SHOW', 'COMPLETED'] },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  }
}
