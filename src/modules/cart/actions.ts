'use server';

import { cookies } from 'next/headers';
import { CartService } from './service';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function getCartAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('dining_session_id')?.value;

  if (!sessionId) {
    return { success: false, error: 'No active session' };
  }

  try {
    const cart = await CartService.getOrCreateCart(sessionId);
    return { success: true, data: cart };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}

export async function addToCartAction(menuItemId: string, quantity: number, modifiers: Prisma.InputJsonValue = [], notes: string = '') {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('dining_session_id')?.value;

  if (!sessionId) {
    return { success: false, error: 'No active session' };
  }

  try {
    await CartService.addItem(sessionId, menuItemId, quantity, modifiers, notes);
    revalidatePath('/menu');
    revalidatePath('/cart');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}
