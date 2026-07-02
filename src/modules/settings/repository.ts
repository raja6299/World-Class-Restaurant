import { prisma } from '@/src/lib/prisma';
import { BranchSettings, FeatureFlag, Restaurant } from '@prisma/client';

export class SettingsRepository {
  static async getBranchSettings(branchId: string): Promise<BranchSettings | null> {
    return await prisma.branchSettings.findUnique({
      where: { branchId }
    });
  }

  static async getRestaurantBranding(restaurantId: string): Promise<Restaurant | null> {
    return await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
  }

  static async getFeatureFlags(restaurantId: string): Promise<FeatureFlag | null> {
    return await prisma.featureFlag.findUnique({
      where: { restaurantId }
    });
  }
}
