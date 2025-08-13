import { supabase } from '@/integrations/supabase/client';

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  resize?: 'cover' | 'contain' | 'fill';
  blur?: number;
  brightness?: number;
  contrast?: number;
}

// Advanced CDN-based image URL generator with full optimization
export const getCDNImageUrl = (url: string, options: ImageTransformOptions = {}): string => {
  if (!url) return '';
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    resize = 'cover',
    blur,
    brightness,
    contrast
  } = options;
  
  // Handle Supabase storage URLs with advanced transformations
  if (url.includes('supabase.co/storage')) {
    try {
      const urlObj = new URL(url);
      let path = urlObj.pathname.split('/storage/v1/object/public/')[1];
      
      if (!path) return url;
      
      // Fix double slashes in the path (common issue with Supabase storage)
      path = path.replace(/\/+/g, '/').replace(/^\//, '');
      
      // Use Supabase's image transformation API
      const baseUrl = url.split('/storage/v1/object/public/')[0];
      const transformUrl = `${baseUrl}/storage/v1/render/image/public/${path}`;
      const params = new URLSearchParams();
      
      if (width) params.append('width', width.toString());
      if (height) params.append('height', height.toString());
      if (quality) params.append('quality', quality.toString());
      if (format) params.append('format', format);
      if (resize) params.append('resize', resize);
      if (blur) params.append('blur', blur.toString());
      if (brightness) params.append('brightness', brightness.toString());
      if (contrast) params.append('contrast', contrast.toString());
      
      return `${transformUrl}?${params.toString()}`;
    } catch (error) {
      console.error('Error processing Supabase URL:', error);
      return url;
    }
  }
  
  return url;
};

// Get responsive image sources for different screen sizes
export const getResponsiveImageSources = (url: string, baseOptions: ImageTransformOptions = {}) => {
  const sources = [
    {
      media: '(max-width: 640px)',
      srcset: getCDNImageUrl(url, { ...baseOptions, width: 640 }),
      sizes: '100vw'
    },
    {
      media: '(max-width: 1024px)',
      srcset: getCDNImageUrl(url, { ...baseOptions, width: 1024 }),
      sizes: '100vw'
    },
    {
      media: '(min-width: 1025px)',
      srcset: getCDNImageUrl(url, { ...baseOptions, width: 1920 }),
      sizes: '100vw'
    }
  ];
  
  return sources;
};

// Legacy function for backward compatibility
export const getThumbnailUrl = (url: string, width: number = 300): string => {
  return getCDNImageUrl(url, { width, quality: 60 });
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

// Legacy function for backward compatibility  
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  return getCDNImageUrl(url, { width, quality: 80 });
};

// Progressive image loading with placeholder
export const getProgressiveImageUrls = (url: string) => {
  return {
    placeholder: getCDNImageUrl(url, { width: 20, quality: 20, blur: 10 }),
    thumbnail: getCDNImageUrl(url, { width: 400, quality: 60 }),
    medium: getCDNImageUrl(url, { width: 800, quality: 75 }),
    full: getCDNImageUrl(url, { width: 1920, quality: 85 })
  };
};

// Smart image format detection based on browser support
export const getOptimalFormat = (): 'avif' | 'webp' | 'jpg' => {
  if (typeof window === 'undefined') return 'webp';
  
  // Check for AVIF support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  try {
    const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    if (avifSupported) return 'avif';
  } catch {}
  
  // Check for WebP support
  try {
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    if (webpSupported) return 'webp';
  } catch {}
  
  return 'jpg';
};

// Get optimized image URL with automatic format detection
export const getSmartImageUrl = (url: string, options: Omit<ImageTransformOptions, 'format'> = {}) => {
  const format = getOptimalFormat();
  return getCDNImageUrl(url, { ...options, format });
};