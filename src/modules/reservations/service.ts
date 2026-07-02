import { prisma } from '@/src/lib/prisma';
import { ReservationFormData, ReservationSchema } from './validation';
import { AuditLogger } from '@/src/lib/audit';

export class ReservationService {
  static async getReservations(branchId: string) {
    return prisma.reservation.findMany({
      where: { branchId, deletedAt: null },
      include: {
        table: true,
        assignedWaiter: {
          select: { id: true, name: true }
        }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });
  }

  static async createReservation(branchId: string, data: ReservationFormData) {
    const validated = ReservationSchema.parse(data);
    
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: {
          branchId,
          guestName: validated.guestName,
          guestPhone: validated.guestPhone,
          guestEmail: validated.guestEmail,
          guestCount: validated.guestCount,
          date: new Date(validated.date),
          time: validated.time,
          status: validated.status,
          source: validated.source,
          tableId: validated.tableId || null,
          assignedWaiterId: validated.assignedWaiterId || null,
          expectedDuration: validated.expectedDuration,
          deposit: validated.deposit,
          arrivalStatus: validated.arrivalStatus || null,
          reminderStatus: validated.reminderStatus || null,
          specialRequests: validated.specialRequests,
          occasion: validated.occasion,
        }
      });

      const auditPayload = await AuditLogger.log({
        module: 'RESERVATIONS',
        action: 'CREATE',
        newValue: reservation,
        branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return reservation;
    });
  }

  static async updateReservation(id: string, data: ReservationFormData) {
    const validated = ReservationSchema.parse(data);
    
    return prisma.$transaction(async (tx) => {
      const oldReservation = await tx.reservation.findUnique({ where: { id } });
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          guestName: validated.guestName,
          guestPhone: validated.guestPhone,
          guestEmail: validated.guestEmail,
          guestCount: validated.guestCount,
          date: new Date(validated.date),
          time: validated.time,
          status: validated.status,
          source: validated.source,
          tableId: validated.tableId || null,
          assignedWaiterId: validated.assignedWaiterId || null,
          expectedDuration: validated.expectedDuration,
          deposit: validated.deposit,
          arrivalStatus: validated.arrivalStatus || null,
          reminderStatus: validated.reminderStatus || null,
          specialRequests: validated.specialRequests,
          occasion: validated.occasion,
        }
      });

      const auditPayload = await AuditLogger.log({
        module: 'RESERVATIONS',
        action: 'UPDATE',
        oldValue: oldReservation,
        newValue: updated,
        branchId: updated.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return updated;
    });
  }

  static async deleteReservation(id: string) {
    return prisma.$transaction(async (tx) => {
      const oldReservation = await tx.reservation.findUnique({ where: { id } });
      const deleted = await tx.reservation.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'CANCELLED' }
      });

      const auditPayload = await AuditLogger.log({
        module: 'RESERVATIONS',
        action: 'DELETE',
        oldValue: oldReservation,
        newValue: deleted,
        branchId: deleted.branchId,
      });
      await tx.auditLog.create({ data: auditPayload });

      return deleted;
    });
  }
}
