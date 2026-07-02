'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadImageAction } from '@/src/modules/storage/actions';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        // Call the server action to handle upload via StorageService
        const result = await uploadImageAction(formData, folder, value);

        if (result.error) {
          setError(result.error);
        } else if (result.url) {
          onChange(result.url);
        }
      } catch (err) {
        setError((err as Error).message || 'An error occurred during upload');
      } finally {
        setIsUploading(false);
      }
    },
    [folder, value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    // Note: We don't immediately delete from storage here to prevent orphaned deletions if the user cancels the form.
    // The StorageService handles replacing the old image when a new one is uploaded, or the backend can clean up orphans later.
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 ${
          isDragActive
            ? 'border-aurum-gold-primary bg-aurum-gold-primary/5'
            : error
            ? 'border-red-500 bg-red-50'
            : value
            ? 'border-transparent'
            : 'border-aurum-gold-primary/20 bg-aurum-cream-secondary hover:bg-aurum-gold-primary/5 hover:border-aurum-gold-primary/50'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />

        {/* Content based on state */}
        <div className="flex flex-col items-center justify-center min-h-[160px] p-6 text-center">
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-aurum-gold-primary" />
              <p className="text-sm font-medium text-aurum-text-body">Uploading image...</p>
            </div>
          ) : value ? (
            <div className="absolute inset-0 group">
              <Image
                src={value}
                alt="Uploaded image preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <p className="text-white font-medium text-sm">Click or drag to replace</p>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-aurum-cream-primary rounded-full shadow-sm">
                <UploadCloud className="w-6 h-6 text-aurum-gold-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-aurum-text-heading">
                  <span className="text-aurum-gold-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-aurum-text-body/60 mt-1">
                  SVG, PNG, JPG or WebP (max. 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
