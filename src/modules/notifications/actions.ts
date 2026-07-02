'use server';

import { NotificationService } from './service';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function markNotificationAsReadAction(id: string) {
  try {
    await NotificationService.markAsRead(id);
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('markNotificationAsReadAction failed', { error });
    return { error: (error as Error).message || 'Failed to mark notification as read' };
  }
}
