
import { supabase } from '@/integrations/supabase/client';

// Enhanced image optimization with multiple quality levels
export const getOptimizedImageUrl = (url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg';
}): string => {
  if (!url) return '';
  
  const { width, height, quality = 70, format = 'webp' } = options || {};
  
  // If it's a Supabase storage URL
  if (url.includes('supabase.co/storage')) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/storage/v1/object/public/')[1];
      
      if (!path) return url;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(path);

      const separator = data.publicUrl.includes('?') ? '&' : '?';
      const params = [];
      
      if (width) params.push(`width=${width}`);
      if (height) params.push(`height=${height}`);
      params.push(`quality=${quality}`);
      params.push(`format=${format}`);
      
      return `${data.publicUrl}${separator}${params.join('&')}`;
    } catch (error) {
      console.error('Error processing Supabase URL:', error);
      return url;
    }
  }
  
  return url;
};

// Get thumbnail with very low quality for instant loading
export const getThumbnailUrl = (url: string, width: number = 150): string => {
  return getOptimizedImageUrl(url, {
    width,
    quality: 30,
    format: 'webp'
  });
};

// Get medium quality version for main display
export const getMediumQualityUrl = (url: string, width: number = 800): string => {
  return getOptimizedImageUrl(url, {
    width,
    quality: 70,
    format: 'webp'
  });
};

// Get high quality version for modal/print
export const getHighQualityUrl = (url: string): string => {
  return getOptimizedImageUrl(url, {
    quality: 90,
    format: 'webp'
  });
};

// Progressive image loading with multiple quality levels
export const preloadImageProgressive = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('Invalid image URL'));
      return;
    }

    // First load thumbnail
    const thumbnailUrl = getThumbnailUrl(url);
    const thumbnailImg = new Image();
    
    thumbnailImg.onload = () => {
      // Then load medium quality
      const mediumUrl = getMediumQualityUrl(url);
      const mediumImg = new Image();
      
      mediumImg.onload = () => resolve();
      mediumImg.onerror = () => {
        // Fallback to original if medium fails
        const originalImg = new Image();
        originalImg.onload = () => resolve();
        originalImg.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        originalImg.src = url;
      };
      mediumImg.src = mediumUrl;
    };
    
    thumbnailImg.onerror = () => {
      // Direct fallback to original URL
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve();
      fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      fallbackImg.src = url;
    };
    
    thumbnailImg.src = thumbnailUrl;
  });
};

// Check if image is in viewport or close to it
export const isImageNearViewport = (element: HTMLElement, threshold: number = 200): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  return (
    rect.bottom >= -threshold &&
    rect.top <= windowHeight + threshold &&
    rect.right >= -threshold &&
    rect.left <= windowWidth + threshold
  );
};

// Batch image loading to prevent overwhelming the browser
export const loadImagesBatch = async (urls: string[], batchSize: number = 3): Promise<void> => {
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(url => preloadImageProgressive(url)));
    
    // Small delay between batches to prevent blocking
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};
