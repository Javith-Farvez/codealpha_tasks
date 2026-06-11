'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader } from 'lucide-react';
import { ImageUploadService } from '@/lib/image-upload';

interface ImageUploadInputProps {
  onUpload: (imageUrl: string) => void;
  onError?: (error: string) => void;
  maxSizeMB?: number;
  bucket?: 'avatars' | 'covers' | 'posts';
  currentImage?: string;
}

export default function ImageUploadInput({
  onUpload,
  onError,
  maxSizeMB = 5,
  bucket = 'posts',
  currentImage,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setError('');
    setLoading(true);

    try {
      // Validate file
      const validation = ImageUploadService.validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Upload image
      const uploaded = await ImageUploadService.uploadImage(file, bucket);

      // Set preview and callback
      setPreview(uploaded.url);
      onUpload(uploaded.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={loading}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden bg-secondary">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleClear}
            disabled={loading}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span className="text-sm text-foreground/60">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-3 text-foreground/40" />
              <p className="font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-foreground/60">
                PNG, JPG, GIF or WebP (max {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!preview && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      )}
    </div>
  );
}
