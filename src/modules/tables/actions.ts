'use server';

import { TableService } from './service';
import { TableFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function createTableAction(branchId: string, data: TableFormData) {
  try {
    await TableService.createTable(branchId, data);
    revalidatePath('/admin/tables');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createTableAction failed', { error });
    return { error: (error as Error).message || 'Failed to create table' };
  }
}

export async function updateTableAction(id: string, data: TableFormData) {
  try {
    await TableService.updateTable(id, data);
    revalidatePath('/admin/tables');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateTableAction failed', { error });
    return { error: (error as Error).message || 'Failed to update table' };
  }
}

export async function deleteTableAction(id: string) {
  try {
    await TableService.deleteTable(id);
    revalidatePath('/admin/tables');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteTableAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete table' };
  }
}
