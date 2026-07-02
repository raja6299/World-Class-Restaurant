import { prisma } from '@/src/lib/prisma';
import { BranchFormData } from './validation';
import { AuditLogger } from '@/src/lib/audit';

export class BranchRepository {
  static async getBranchesByRestaurant(restaurantId: string) {
    return prisma.branch.findMany({
      where: { restaurantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createBranch(restaurantId: string, data: BranchFormData) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.branch.updateMany({
          where: { restaurantId },
          data: { isDefault: false },
        });
      }

      const branch = await tx.branch.create({
        data: {
          restaurantId,
          name: data.name,
          location: data.location,
          phone: data.phone,
          status: data.status,
          isDefault: data.isDefault,
        },
      });

      // Auto-create settings
      await tx.branchSettings.create({
        data: { branchId: branch.id },
      });

      // Audit Log
      const auditPayload = await AuditLogger.log({
        module: 'BRANCHES',
        action: 'CREATE',
        newValue: branch,
        branchId: branch.id,
      });
      await tx.auditLog.create({ data: auditPayload });

      return branch;
    });
  }

  static async updateBranch(id: string, data: BranchFormData) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        const branch = await tx.branch.findUnique({ where: { id } });
        if (branch) {
          await tx.branch.updateMany({
            where: { restaurantId: branch.restaurantId },
            data: { isDefault: false },
          });
        }
      }

      const branch = await tx.branch.findUnique({ where: { id } });
      const updated = await tx.branch.update({
        where: { id },
        data: {
          name: data.name,
          location: data.location,
          phone: data.phone,
          status: data.status,
          isDefault: data.isDefault,
        },
      });

      // Audit Log
      const auditPayload = await AuditLogger.log({
        module: 'BRANCHES',
        action: 'UPDATE',
        oldValue: branch,
        newValue: updated,
        branchId: id,
      });
      await tx.auditLog.create({ data: auditPayload });

      return updated;
    });
  }

  static async deleteBranch(id: string) {
    return prisma.$transaction(async (tx) => {
      const branch = await tx.branch.findUnique({ where: { id } });
      const deleted = await tx.branch.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });

      // Audit Log
      const auditPayload = await AuditLogger.log({
        module: 'BRANCHES',
        action: 'DELETE',
        oldValue: branch,
        newValue: deleted,
        branchId: id,
      });
      await tx.auditLog.create({ data: auditPayload });

      return deleted;
    });
  }
}
