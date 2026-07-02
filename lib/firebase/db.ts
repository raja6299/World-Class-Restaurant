/* ═══════════════════════════════════════════════════════
   AURUM RESTAURANT — Firestore Database Operations
   ═══════════════════════════════════════════════════════ */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { ReservationData } from '@/lib/types';
import { Logger, NotConfiguredError } from '@/src/lib/logger';

/**
 * Submit a reservation to Firestore.
 * Throws NotConfiguredError if Firebase is not configured.
 */
export async function submitReservation(
  data: Omit<ReservationData, 'status' | 'createdAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isFirebaseConfigured) {
    Logger.warn('[AURUM] Firebase not configured — submission failed.', 'Firebase');
    throw new NotConfiguredError('Firebase is not configured.');
  }

  try {
    const docRef = await addDoc(collection(db, 'reservations'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    Logger.error('[AURUM] Firestore reservation error:', error, 'Firebase');
    return {
      success: false,
      error: 'Unable to complete reservation. Please contact us directly.',
    };
  }
}
