
import { supabase } from '@/integrations/supabase/client';

// Function to get a thumbnail version of an image URL with WebP optimization
export const getThumbnailUrl = (url: string, width: number = 400): string => {
  if (!url) {
    console.warn('getThumbnailUrl: Empty URL provided');
    return '';
  }
  
  console.log('getThumbnailUrl: Processing URL:', url);
  
  // If it's a Supabase storage URL
  if (url.includes('supabase.co/storage')) {
    try {
      // Extract the path from the URL - handle both old and new URL formats
      const urlObj = new URL(url);
      let path = '';
      
      if (urlObj.pathname.includes('/storage/v1/object/public/')) {
        path = urlObj.pathname.split('/storage/v1/object/public/')[1];
      } else if (urlObj.pathname.includes('/object/public/')) {
        path = urlObj.pathname.split('/object/public/')[1];
      }
      
      if (!path) {
        console.warn('getThumbnailUrl: Could not extract path from URL:', url);
        return url;
      }

      // Remove the 'images/' prefix if it exists in the path
      if (path.startsWith('images/')) {
        path = path.substring(7);
      }

      console.log('getThumbnailUrl: Extracted path:', path);

      // Get the public URL using Supabase client with transform
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(path, {
          transform: {
            width: width,
            height: Math.round(width * 1.2), // Maintain aspect ratio
            resize: 'cover',
            quality: 60
          }
        });

      console.log('getThumbnailUrl: Generated thumbnail URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('getThumbnailUrl: Error processing Supabase URL:', error, 'Original URL:', url);
      return url;
    }
  }
  
  // For local images or other URLs, return as is
  console.log('getThumbnailUrl: Non-Supabase URL, returning as is:', url);
  return url;
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
      fullImg.src = url;
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

// Function to get optimized image URL for display
export const getOptimizedImageUrl = (url: string, width?: number, quality: number = 80): string => {
  if (!url) {
    console.warn('getOptimizedImageUrl: Empty URL provided');
    return '';
  }
  
  // If it's a Supabase storage URL
  if (url.includes('supabase.co/storage')) {
    try {
      // Extract the path from the URL
      const urlObj = new URL(url);
      let path = '';
      
      if (urlObj.pathname.includes('/storage/v1/object/public/')) {
        path = urlObj.pathname.split('/storage/v1/object/public/')[1];
      } else if (urlObj.pathname.includes('/object/public/')) {
        path = urlObj.pathname.split('/object/public/')[1];
      }
      
      if (!path) {
        console.warn('getOptimizedImageUrl: Could not extract path from URL:', url);
        return url;
      }

      // Remove the 'images/' prefix if it exists in the path
      if (path.startsWith('images/')) {
        path = path.substring(7);
      }

      // Get the public URL using Supabase client
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(path, {
          transform: {
            width: width,
            quality: quality,
            resize: width ? 'cover' : undefined
          }
        });

      return data.publicUrl;
    } catch (error) {
      console.error('getOptimizedImageUrl: Error processing Supabase URL:', error);
      return url;
    }
  }
  
  return url;
};

// Function to get high quality image URL for modal view
export const getHighQualityImageUrl = (url: string): string => {
  return getOptimizedImageUrl(url, 1920, 90);
};
