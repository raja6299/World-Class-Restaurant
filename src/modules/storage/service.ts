import { createClient } from '@/src/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { Logger } from '@/src/lib/logger';

const BUCKET_NAME = 'aurum-assets';

export class StorageService {
  /**
   * Uploads an image to Supabase Storage, compressing it and replacing an old image if provided.
   * @param file The File object from FormData
   * @param folder The folder inside the bucket (e.g., 'menu-images')
   * @param oldImageUrl Optional URL of the image to delete before uploading the new one
   */
  static async uploadImage(file: File, folder: string, oldImageUrl?: string): Promise<string> {
    try {
      const supabase = await createClient();
      
      // 1. Delete old image if provided
      if (oldImageUrl) {
        await this.deleteImage(oldImageUrl, supabase);
      }

      // 2. Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // 3. Compress image and convert to WebP
      let buffer: Buffer = Buffer.from(await file.arrayBuffer());
      if (file.type !== 'image/svg+xml') {
        buffer = await sharp(buffer)
          .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
      }

      // 4. Generate unique filename
      const ext = file.type === 'image/svg+xml' ? 'svg' : 'webp';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const path = `${folder}/${filename}`;

      // 5. Upload to Supabase
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, buffer, {
          contentType: file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        Logger.error('Supabase upload failed', error, 'Storage');
        throw new Error('Failed to upload image to storage');
      }

      // 6. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      Logger.error('StorageService.uploadImage error', error, 'Storage');
      throw error;
    }
  }

  /**
   * Deletes an image from the storage bucket based on its public URL.
   */
  static async deleteImage(imageUrl: string, supabaseClient?: SupabaseClient) {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;

    try {
      // If a client isn't passed in (e.g., calling this standalone), create one
      const supabase = supabaseClient || await createClient();
      
      // Extract path from URL (e.g., https://xyz.supabase.co/storage/v1/object/public/aurum-assets/folder/filename.webp)
      const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length !== 2) return;
      
      const path = urlParts[1];
      
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);
        
      if (error) {
        Logger.warn('Failed to delete old image from storage', 'Storage', { path, error });
      }
    } catch (error) {
      Logger.error('StorageService.deleteImage error', error, 'Storage');
    }
  }
}
