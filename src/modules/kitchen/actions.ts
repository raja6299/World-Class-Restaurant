'use server';

import { createClient } from '@/src/lib/supabase/server';
import { z } from 'zod';

import { KitchenService, OrderStatus } from './service';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatusAction(
  orderId: string, 
  status: string,
  isManager: boolean = false
) {
  try {
    const parsedOrderId = z.string().uuid().parse(orderId);
    const parsedStatus = z.string().min(1).parse(status);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    const userId = user.id;
    const updated = await KitchenService.updateOrderStatus(parsedOrderId, parsedStatus as OrderStatus, userId, isManager);
    revalidatePath('/admin/kitchen');
    return { success: true, data: updated };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}

export async function getLiveQueueAction(branchId: string) {
  try {
    const parsedBranchId = z.string().uuid().parse(branchId);
    const queue = await KitchenService.getLiveQueue(parsedBranchId);
    return { success: true, data: queue };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}
