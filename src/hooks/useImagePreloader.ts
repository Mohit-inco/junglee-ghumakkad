import { useState, useEffect } from 'react';
import { getCDNImageUrl, getProgressiveImageUrls } from '@/lib/imageUtils';

interface UseImagePreloaderOptions {
  images: string[];
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (loaded: number, total: number) => void;
  enableProgressive?: boolean;
}

interface UseImagePreloaderReturn {
  progress: number;
  isLoading: boolean;
  error: Error | null;
  loadedImages: Set<string>;
}

export const useImagePreloader = ({
  images,
  onComplete,
  onError,
  onProgress,
  enableProgressive = true
}: UseImagePreloaderOptions): UseImagePreloaderReturn => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!images.length) {
      setIsLoading(false);
      setProgress(100);
      onComplete?.();
      return;
    }

    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (loadedImages.has(src)) {
          resolve();
          return;
        }

        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          
          if (enableProgressive) {
            // Preload different sizes for progressive loading
            const urls = getProgressiveImageUrls(src);
            const preloadPromises = [
              urls.thumbnail,
              urls.medium
            ].map(url => {
              const preloadImg = new Image();
              preloadImg.src = url;
              return Promise.resolve(); // Don't wait for these
            });
            
            Promise.all(preloadPromises).catch(() => {}); // Ignore errors for progressive preloading
          }
          
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          // Try optimized version as fallback
          const optimizedSrc = getCDNImageUrl(src, { width: 800, quality: 70 });
          if (optimizedSrc !== src) {
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
              setLoadedImages(prev => new Set([...prev, src]));
              resolve();
            };
            fallbackImg.onerror = () => {
              // Try the original URL without any transformations
              const originalImg = new Image();
              originalImg.onload = () => {
                setLoadedImages(prev => new Set([...prev, src]));
                resolve();
              };
              originalImg.onerror = () => {
                console.warn(`Completely failed to load image: ${src}`);
                // Don't reject, just resolve to continue with other images
                resolve();
              };
              originalImg.src = src;
            };
            fallbackImg.src = optimizedSrc;
          } else {
            console.warn(`Completely failed to load image: ${src}`);
            // Don't reject, just resolve to continue with other images
            resolve();
          }
        };
        
        // Use optimized version for preloading
        img.src = getCDNImageUrl(src, { width: 400, quality: 60 });
      });
    };

    const loadAllImages = async () => {
      let loadedCount = 0;
      
      for (const imageSrc of images) {
        try {
          await loadImage(imageSrc);
          loadedCount++;
          const newProgress = Math.round((loadedCount / images.length) * 100);
          setProgress(newProgress);
          onProgress?.(loadedCount, images.length);
        } catch (err) {
          const error = err as Error;
          console.error('Error preloading image:', error);
          setError(error);
          onError?.(error);
          // Continue loading other images even if one fails
          loadedCount++;
          const newProgress = Math.round((loadedCount / images.length) * 100);
          setProgress(newProgress);
        }
      }
      
      setIsLoading(false);
      onComplete?.();
    };

    loadAllImages();
  }, [images, onComplete, onError, onProgress, enableProgressive, loadedImages]);

  return {
    progress,
    isLoading,
    error,
    loadedImages
  };
};

export default useImagePreloader;