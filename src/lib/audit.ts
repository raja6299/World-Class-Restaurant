

export class AuditLogger {
  /**
   * Generates a Prisma create payload for an AuditLog.
   * Can be used inside a Prisma Transaction array or interactive transaction (tx).
   */
  static async log(params: {
    branchId?: string;
    userId?: string;
    module: string;
    action: string;
    oldValue?: unknown;
    newValue?: unknown;
  }) {
    const currentUserId = params.userId || 'system';

    return {
      branchId: params.branchId,
      userId: currentUserId,
      module: params.module,
      action: params.action,
      oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : undefined,
      newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : undefined,
    };
  }
}
