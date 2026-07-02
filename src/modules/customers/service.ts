import { CustomerRepository } from './repository';
import { CustomerProfile } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { differenceInDays } from 'date-fns';

export interface CustomerPreferences {
  allergies?: string[];
  dietaryPreferences?: string[];
  communicationPrefs?: {
    email?: boolean;
    sms?: boolean;
    promotions?: boolean;
  };
  [key: string]: unknown;
}

export class CustomerService {
  static async getProfile(userId: string) {
    let profile = await CustomerRepository.getProfileByUserId(userId);
    if (!profile) {
      profile = await CustomerRepository.upsertProfile(userId, { preferredLanguage: 'en' } as Partial<CustomerProfile>);
    }
    return profile;
  }

  static async updatePreferences(userId: string, data: CustomerPreferences) {
    return await CustomerRepository.upsertProfile(userId, data as unknown as Partial<CustomerProfile>);
  }

  static async recordSuccessfulVisit(userId: string, orderTotal: number) {
    return await CustomerRepository.incrementVisitStats(userId, orderTotal);
  }

  static async getAllProfilesWithSegments() {
    const profiles = await prisma.customerProfile.findMany({
      include: { user: true },
      orderBy: { lifetimeValue: 'desc' }
    });

    return profiles.map(profile => {
      let segment = 'NEW';
      if (profile.totalVisits > 5 && profile.lifetimeValue > 10000) {
        segment = 'VIP';
      } else if (profile.totalVisits > 2) {
        segment = 'LOYAL';
      }
      
      let churnRisk = 'LOW';
      if (profile.lastVisit) {
        const daysSinceVisit = differenceInDays(new Date(), profile.lastVisit);
        if (daysSinceVisit > 90) churnRisk = 'HIGH';
        else if (daysSinceVisit > 30) churnRisk = 'MEDIUM';
      }

      return {
        ...profile,
        segment,
        churnRisk
      };
    });
  }
}
