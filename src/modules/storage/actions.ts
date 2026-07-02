'use server';

import { StorageService } from './service';
import { Logger } from '@/src/lib/logger';
import { createClient } from '@/src/lib/supabase/server';

export async function uploadImageAction(formData: FormData, folder: string, oldImageUrl?: string): Promise<{ url?: string; error?: string }> {
  try {
    // 1. Validate auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }
    
    const role = user.user_metadata?.role;
    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(role)) {
      return { error: 'Unauthorized to upload images' };
    }

    // 2. Extract file
    const file = formData.get('file') as File | null;
    if (!file) {
      return { error: 'No file provided' };
    }

    // 3. Upload via service
    const url = await StorageService.uploadImage(file, folder, oldImageUrl);
    return { url };
  } catch (error: unknown) {
    Logger.error('uploadImageAction failed', { error });
    return { error: (error as Error).message || 'Failed to upload image' };
  }
}
