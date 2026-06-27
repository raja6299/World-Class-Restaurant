/* ═══════════════════════════════════════════════════════
   AURUM RESTAURANT — Firestore Database Operations
   ═══════════════════════════════════════════════════════ */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { ReservationData } from '@/lib/types';

/**
 * Submit a reservation to Firestore.
 * Falls back gracefully if Firebase is not configured.
 */
export async function submitReservation(
  data: Omit<ReservationData, 'status' | 'createdAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!isFirebaseConfigured) {
    // Simulate success in development without Firebase
    console.warn('[AURUM] Firebase not configured — simulating reservation submission.');
    return {
      success: true,
      id: `dev-${Date.now()}`,
    };
  }

  try {
    const docRef = await addDoc(collection(db, 'reservations'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('[AURUM] Firestore reservation error:', error);
    return {
      success: false,
      error: 'Unable to complete reservation. Please contact us directly.',
    };
  }
}
