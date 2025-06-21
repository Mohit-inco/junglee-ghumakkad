
import { supabase } from '@/integrations/supabase/client';

// Function to get optimized image URL with transformations
export const getOptimizedImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  resize?: 'cover' | 'contain' | 'fill';
} = {}): string => {
  if (!url) return '';
  
  // If it's a Supabase storage URL
  if (url.includes('supabase.co/storage')) {
    try {
      // Extract the path from the URL
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/storage/v1/object/public/')[1];
      
      if (!path) return url;

      // Get the public URL using Supabase client
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(path, {
          transform: {
            width: options.width,
            height: options.height,
            quality: options.quality || 80,
            format: options.format || 'webp',
            resize: options.resize || 'cover'
          }
        });

      return data.publicUrl;
    } catch (error) {
      console.error('Error processing Supabase URL:', error);
      return url;
    }
  }
  
  return url;
};

// Function to get a thumbnail version of an image URL
export const getThumbnailUrl = (url: string, width: number = 300): string => {
  return getOptimizedImageUrl(url, {
    width,
    quality: 60,
    format: 'webp',
    resize: 'cover'
  });
};

// Function to preload an image with both thumbnail and full version
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('Invalid image URL'));
      return;
    }

    // First load the thumbnail
    const thumbnailUrl = getThumbnailUrl(url);
    const thumbnailImg = new Image();
    
    thumbnailImg.onload = () => {
      // Then load the full version
      const fullImg = new Image();
      
      fullImg.onload = () => resolve();
      fullImg.onerror = () => reject(new Error(`Failed to load full image: ${url}`));
      fullImg.src = getOptimizedImageUrl(url, { quality: 85, format: 'webp' });
    };
    
    thumbnailImg.onerror = () => {
      console.warn(`Failed to load thumbnail: ${thumbnailUrl}, falling back to original URL`);
      // If thumbnail fails, try loading the original image
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve();
      fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      fallbackImg.src = url;
    };
    
    thumbnailImg.src = thumbnailUrl;
  });
};
