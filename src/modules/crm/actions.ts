'use server';

import { CrmService } from './service';
import { CustomerProfileFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function updateCustomerProfileAction(userId: string, data: CustomerProfileFormData) {
  try {
    await CrmService.updateCustomerProfile(userId, data);
    revalidatePath('/admin/crm');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateCustomerProfileAction failed', { error });
    return { error: (error as Error).message || 'Failed to update customer profile' };
  }
}

export async function importCustomersAction(data: Record<string, unknown>[]) {
  try {
    // For now, assume branch context is handled or we use a global import.
    // In a real app we'd pass branchId if required by the service.
    // We will just call a new service method `importCustomers`
    await CrmService.importCustomers(data);
    revalidatePath('/admin/crm');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('importCustomersAction failed', { error });
    throw new Error((error as Error).message || 'Failed to import customers');
  }
}
