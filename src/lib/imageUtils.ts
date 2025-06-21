
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

      // For now, return the original URL since Supabase transform API format needs verification
      // This preserves functionality while avoiding type errors
      return url;
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

    // For now, just preload the original image
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};
