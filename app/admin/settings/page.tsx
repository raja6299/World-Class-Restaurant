import { SettingsService } from '@/src/modules/settings/service';
import { prisma } from '@/src/lib/prisma';
import SettingsClient from './SettingsClient';

export default async function AdminSettingsPage() {
  const demoBranch = await prisma.branch.findFirst({
    include: { restaurant: true }
  });
  const branchId = demoBranch?.id || '';
  const restaurantId = demoBranch?.restaurantId || '';

  const data = await SettingsService.getDashboardData(branchId, restaurantId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">System Settings</h1>
        <p className="text-aurum-text-body/60 mt-1">Configure restaurant branding, taxes, and operational parameters.</p>
      </div>

      <SettingsClient 
        branchId={branchId}
        restaurantId={restaurantId}
        branchSettings={data.branchSettings as unknown as import('@/src/modules/settings/dto').BranchSettingsDto}
        branding={data.branding as unknown as import('@/src/modules/settings/dto').BrandingDto}
        features={data.features as unknown as import('@/src/modules/settings/dto').FeatureFlagsDto}
        restaurantName={demoBranch?.restaurant?.name || ''}
      />
    </div>
  );
}
