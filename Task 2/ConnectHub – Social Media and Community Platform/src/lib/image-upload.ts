// Image upload utilities for ConnectHub
// Supports both mock uploads and real Supabase storage

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
  type: string;
}

export class ImageUploadService {
  /**
   * Upload image to storage
   * When Supabase is connected, this will use real storage
   * For now, it creates a mock URL using data URI
   */
  static async uploadImage(
    file: File,
    bucket: 'avatars' | 'covers' | 'posts'
  ): Promise<UploadedImage> {
    // Validate file
    if (!file) throw new Error('No file provided');
    if (file.size > 5 * 1024 * 1024) throw new Error('File too large (max 5MB)');

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) throw new Error('Invalid file type');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          resolve({
            url: dataUrl,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Delete image from storage
   */
  static async deleteImage(url: string): Promise<void> {
    // When Supabase is connected, implement actual deletion
    console.log('Deleting image:', url);
  }

  /**
   * Get public URL for image
   */
  static getPublicUrl(path: string): string {
    // When Supabase is connected, use actual storage URLs
    return path;
  }

  /**
   * Validate image file
   */
  static validateImage(file: File): { valid: boolean; error?: string } {
    if (!file) return { valid: false, error: 'No file provided' };
    if (file.size > 5 * 1024 * 1024)
      return { valid: false, error: 'File too large (max 5MB)' };

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type))
      return { valid: false, error: 'Invalid file type' };

    return { valid: true };
  }
}
