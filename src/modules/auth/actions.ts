'use server';

import { AuthService } from './service';
import { Logger } from '@/src/lib/logger';
import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const data = await AuthService.signIn(email, password);
    
    // Redirect based on role
    const role = data.user.user_metadata?.role || 'CUSTOMER';
    
    if (['ADMIN', 'OWNER', 'MANAGER'].includes(role)) {
      redirect('/admin/dashboard');
    } else if (role === 'WAITER') {
      redirect('/admin/waiter');
    } else if (['CHEF', 'KITCHEN'].includes(role)) {
      redirect('/admin/kitchen');
    } else {
      redirect('/');
    }
  } catch (error: unknown) {
    Logger.warn('Login failed', 'Auth', { email, error: (error as Error).message });
    return { error: (error as Error).message || 'Invalid login credentials' };
  }
}

export async function logoutAction() {
  try {
    await AuthService.signOut();
  } catch (error) {
    Logger.error('Logout failed', error, 'Auth');
  }
  redirect('/login');
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email is required' };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
    });
    if (error) throw error;
    return { success: true, message: 'Password reset email sent' };
  } catch (error: unknown) {
    Logger.error('Forgot password failed', error, 'Auth');
    return { error: (error as Error).message || 'Failed to send reset email' };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get('password') as string;
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return { success: true, message: 'Password updated successfully' };
  } catch (error: unknown) {
    Logger.error('Reset password failed', error, 'Auth');
    return { error: (error as Error).message || 'Failed to update password' };
  }
}
