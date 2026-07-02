'use server';

import { RestaurantSettingsSchema, BranchSettingsSchema, RestaurantSettingsData, BranchSettingsData } from './validation';
import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function updateRestaurantSettingsAction(restaurantId: string, formData: RestaurantSettingsData) {
  try {
    const data = RestaurantSettingsSchema.parse(formData);
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data,
    });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateRestaurantSettingsAction failed', { error });
    return { error: (error as Error).message || 'Failed to update restaurant settings' };
  }
}

export async function updateBranchSettingsAction(branchId: string, formData: BranchSettingsData) {
  try {
    const data = BranchSettingsSchema.parse(formData);
    
    // Parse business hours back to JSON safely if provided
    let parsedBusinessHours = null;
    if (data.businessHours) {
      try {
        parsedBusinessHours = JSON.parse(data.businessHours);
      } catch {
        throw new Error('Business hours must be valid JSON');
      }
    }

    await prisma.branchSettings.update({
      where: { branchId },
      data: {
        currency: data.currency,
        timezone: data.timezone,
        gst: data.gst,
        serviceCharge: data.serviceCharge,
        upiVpa: data.upiVpa,
        ...(parsedBusinessHours ? { businessHours: parsedBusinessHours } : {}),
      },
    });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateBranchSettingsAction failed', { error });
    return { error: (error as Error).message || 'Failed to update branch settings' };
  }
}
