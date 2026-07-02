'use server';

import { UserService } from './service';
import { UserSchema, UserFormData } from './validation';
import { revalidatePath } from 'next/cache';
import { Logger } from '@/src/lib/logger';

export async function createUserAction(formData: UserFormData) {
  try {
    const validated = UserSchema.parse(formData);
    await UserService.createUser(validated);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('createUserAction error', { error });
    return { error: (error as Error).message || 'Failed to create user' };
  }
}

export async function updateUserAction(id: string, formData: UserFormData) {
  try {
    const validated = UserSchema.parse(formData);
    await UserService.updateUser(id, validated);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('updateUserAction error', { error });
    return { error: (error as Error).message || 'Failed to update user' };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await UserService.deleteUser(id);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: unknown) {
    Logger.error('deleteUserAction error', { error });
    return { error: (error as Error).message || 'Failed to delete user' };
  }
}
