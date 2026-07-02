'use server';

import { BranchService } from './service';
import { BranchFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function createBranchAction(restaurantId: string, data: BranchFormData) {
  try {
    await BranchService.createBranch(restaurantId, data);
    revalidatePath('/admin/branches');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('Failed to create branch', { error });
    return { error: (error as Error).message || 'Failed to create branch' };
  }
}

export async function updateBranchAction(id: string, data: BranchFormData) {
  try {
    await BranchService.updateBranch(id, data);
    revalidatePath('/admin/branches');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('Failed to update branch', { error });
    return { error: (error as Error).message || 'Failed to update branch' };
  }
}

export async function deleteBranchAction(id: string) {
  try {
    await BranchService.deleteBranch(id);
    revalidatePath('/admin/branches');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('Failed to delete branch', { error });
    return { error: (error as Error).message || 'Failed to delete branch' };
  }
}
