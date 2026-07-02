import { prisma } from '@/src/lib/prisma';
import { DiningSession } from '@prisma/client';

export class SessionRepository {
  static async create(data: { branchId: string; tableId: string; guestCount: number; sessionToken: string }): Promise<DiningSession> {
    return await prisma.diningSession.create({
      data: {
        ...data,
        status: 'ACTIVE',
      },
    });
  }

  static async findByToken(sessionToken: string): Promise<DiningSession | null> {
    return await prisma.diningSession.findUnique({
      where: { sessionToken },
      include: { table: true, branch: true },
    });
  }

  static async updateStatus(id: string, status: string): Promise<DiningSession> {
    return await prisma.diningSession.update({
      where: { id },
      data: { status },
    });
  }
}
