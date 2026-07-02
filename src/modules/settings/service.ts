import { SettingsRepository } from './repository';

export class SettingsService {
  static async getDashboardData(branchId: string, restaurantId: string) {
    const branchSettings = await SettingsRepository.getBranchSettings(branchId);
    const branding = await SettingsRepository.getRestaurantBranding(restaurantId);
    const features = await SettingsRepository.getFeatureFlags(restaurantId);

    return {
      branchSettings,
      branding,
      features
    };
  }
}
