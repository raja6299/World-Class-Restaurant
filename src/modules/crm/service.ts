import { prisma } from '@/src/lib/prisma';
import { CustomerProfileFormData, CustomerProfileSchema } from './validation';
import { differenceInDays } from 'date-fns';
import { AuditLogger } from '@/src/lib/audit';

export class CrmService {
  static async getCustomers(branchId: string) {
    const users = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        restaurant: { branches: { some: { id: branchId } } },
        deletedAt: null
      },
      include: {
        profile: true,
        sessions: {
          include: {
            orders: {
              select: { id: true, totalAmount: true, createdAt: true, status: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => {
      let segment = 'NEW';
      const profile = user.profile;
      
      if (profile) {
        if (profile.manualSegment) {
          segment = profile.manualSegment;
        } else if (profile.totalVisits > 5 && profile.lifetimeValue > 10000) {
          segment = 'VIP';
        } else if (profile.totalVisits > 2) {
          segment = 'LOYAL';
        } else if (profile.totalVisits > 0) {
          segment = 'REGULAR';
        }
      }

      let churnRisk = 'LOW';
      if (profile?.lastVisit) {
        const daysSinceVisit = differenceInDays(new Date(), profile.lastVisit);
        if (daysSinceVisit > 90) churnRisk = 'HIGH';
        else if (daysSinceVisit > 30) churnRisk = 'MEDIUM';
      }

      // Flatten orders from sessions
      const orders = user.sessions.flatMap(s => s.orders).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Build clean DTO without sessions
      const restUser = { ...user };
      delete (restUser as Record<string, unknown>)['sessions'];

      return {
        ...restUser,
        segment,
        churnRisk,
        orders
      };
    });
  }

  static async updateCustomerProfile(userId: string, data: CustomerProfileFormData) {
    const validated = CustomerProfileSchema.parse(data);

    return prisma.$transaction(async (tx) => {
      const oldUser = await tx.user.findUnique({ where: { id: userId } });
      const oldProfile = await tx.customerProfile.findUnique({ where: { userId } });

      await tx.user.update({
        where: { id: userId },
        data: {
          name: validated.name,
          phone: validated.phone,
          email: validated.email || null,
        }
      });

      const profile = await tx.customerProfile.upsert({
        where: { userId },
        create: {
          userId,
          preferredLanguage: validated.preferredLanguage,
          marketingConsent: validated.marketingConsent,
          birthday: validated.birthday ? new Date(validated.birthday) : null,
          anniversary: validated.anniversary ? new Date(validated.anniversary) : null,
          tags: validated.tags,
          internalNotes: validated.internalNotes,
          manualSegment: validated.manualSegment,
        },
        update: {
          preferredLanguage: validated.preferredLanguage,
          marketingConsent: validated.marketingConsent,
          birthday: validated.birthday ? new Date(validated.birthday) : null,
          anniversary: validated.anniversary ? new Date(validated.anniversary) : null,
          tags: validated.tags,
          internalNotes: validated.internalNotes,
          manualSegment: validated.manualSegment,
        }
      });

      const auditPayload = await AuditLogger.log({
        module: 'CRM_PROFILE',
        action: 'UPDATE',
        oldValue: { user: oldUser, profile: oldProfile },
        newValue: { user: { name: validated.name, phone: validated.phone, email: validated.email }, profile },
        // BranchID is not strictly required for global customers, but if context exists we pass it. For now omit.
      });
      await tx.auditLog.create({ data: auditPayload });

      return profile;
    });
  }

  static async importCustomers(data: Record<string, unknown>[]) {
    return prisma.$transaction(async (tx) => {
      // Find the first branch to get restaurantId, assuming single restaurant tenant
      const restaurant = await tx.restaurant.findFirst();
      if (!restaurant) throw new Error("Restaurant not found");

      let importedCount = 0;
      for (const row of data) {
        if (!row.name && !row.phone && !row.email) continue;
        
        // Basic duplicate check by phone or email
        const existing = await tx.user.findFirst({
          where: {
            OR: [
              ...(row.phone ? [{ phone: String(row.phone) }] : []),
              ...(row.email ? [{ email: String(row.email) }] : [])
            ]
          }
        });

        if (!existing) {
          const newUser = await tx.user.create({
            data: {
              name: row.name ? String(row.name) : null,
              phone: row.phone ? String(row.phone) : null,
              email: row.email ? String(row.email) : null,
              role: 'CUSTOMER',
              restaurantId: restaurant.id
            }
          });

          await tx.customerProfile.create({
            data: {
              userId: newUser.id,
              preferredLanguage: 'en',
              internalNotes: 'Imported via CSV/Excel'
            }
          });

          importedCount++;
        }
      }

      await tx.auditLog.create({
        data: await AuditLogger.log({
          module: 'CRM_PROFILE',
          action: 'IMPORT',
          newValue: { count: importedCount },
        })
      });

      return importedCount;
    });
  }
}
