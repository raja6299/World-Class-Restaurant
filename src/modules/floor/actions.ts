'use server';

import { createClient } from '@/src/lib/supabase/server';
import { z } from 'zod';

import { FloorService } from './service';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/src/lib/prisma';

export async function updateTableStatusAction(tableId: string, status: string) {
  try {
    const parsedTableId = z.string().uuid().parse(tableId);
    const parsedStatus = z.string().min(1).parse(status);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    const userId = user.id;
    const updated = await FloorService.updateTableStatus(parsedTableId, parsedStatus, userId);
    revalidatePath('/admin/waiter');
    return { success: true, data: updated };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}

export async function openSessionAction(tableId: string, branchId: string, guestCount: number) {
  try {
    const parsedTableId = z.string().uuid().parse(tableId);
    const parsedBranchId = z.string().uuid().parse(branchId);
    const parsedGuestCount = z.number().int().min(1).parse(guestCount);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    const waiterId = user.id;
    
    const session = await prisma.$transaction(async (tx) => {
      const newSession = await tx.diningSession.create({
        data: {
          branchId: parsedBranchId,
          tableId: parsedTableId,
          waiterId,
          guestCount: parsedGuestCount,
          status: 'ACTIVE'
        }
      });
      
      await tx.table.update({
        where: { id: parsedTableId },
        data: { status: 'OCCUPIED' }
      });
      
      return newSession;
    });

    revalidatePath('/admin/waiter');
    return { success: true, data: session };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}
