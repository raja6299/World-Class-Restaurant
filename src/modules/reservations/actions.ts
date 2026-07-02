'use server';

import { ReservationService } from './service';
import { ReservationFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function createReservationAction(branchId: string, data: ReservationFormData) {
  try {
    await ReservationService.createReservation(branchId, data);
    revalidatePath('/admin/reservations');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createReservationAction failed', { error });
    return { error: (error as Error).message || 'Failed to create reservation' };
  }
}

export async function updateReservationAction(id: string, data: ReservationFormData) {
  try {
    await ReservationService.updateReservation(id, data);
    revalidatePath('/admin/reservations');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateReservationAction failed', { error });
    return { error: (error as Error).message || 'Failed to update reservation' };
  }
}

export async function deleteReservationAction(id: string) {
  try {
    await ReservationService.deleteReservation(id);
    revalidatePath('/admin/reservations');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteReservationAction failed', { error });
    return { error: (error as Error).message || 'Failed to delete reservation' };
  }
}
