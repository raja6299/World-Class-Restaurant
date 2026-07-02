import { prisma } from '@/src/lib/prisma';
import { CustomerProfile } from '@prisma/client';

export class CustomerRepository {
  static async getProfileByUserId(userId: string) {
    return await prisma.customerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  static async upsertProfile(userId: string, data: Partial<CustomerProfile>) {
    return await prisma.customerProfile.upsert({
      where: { userId },
      update: {
        ...data,
        allergies: data.allergies,
        dietaryPreferences: data.dietaryPreferences,
        communicationPrefs: data.communicationPrefs ? JSON.parse(JSON.stringify(data.communicationPrefs)) : undefined,
      },
      create: {
        userId,
        ...data,
        allergies: data.allergies || [],
        dietaryPreferences: data.dietaryPreferences || [],
        communicationPrefs: data.communicationPrefs ? JSON.parse(JSON.stringify(data.communicationPrefs)) : undefined,
      },
      include: { user: true },
    });
  }

  static async incrementVisitStats(userId: string, orderTotal: number) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile) return null;

    const newVisits = profile.totalVisits + 1;
    const newLTV = profile.lifetimeValue + orderTotal;
    const newAvgSpend = newLTV / newVisits;

    return await prisma.customerProfile.update({
      where: { userId },
      data: {
        lastVisit: new Date(),
        totalVisits: newVisits,
        lifetimeValue: newLTV,
        averageSpend: newAvgSpend,
      }
    });
  }
}
