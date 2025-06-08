import { useState, useEffect } from 'react';
import ImagePreloader from '../lib/imagePreloader';

interface UseImagePreloaderOptions {
  images: string[];
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const useImagePreloader = ({ images, onComplete, onError }: UseImagePreloaderOptions) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const preloader = new ImagePreloader({
      onProgress: (progress) => {
        setProgress(progress);
      },
      onComplete: () => {
        setIsLoading(false);
        onComplete?.();
      },
      onError: (error) => {
        setError(error);
        setIsLoading(false);
        onError?.(error);
      },
    });

    preloader.addImages(images);
    preloader.preload();

    return () => {
      // Cleanup if needed
    };
  }, [images, onComplete, onError]);

  return {
    progress,
    isLoading,
    error,
  };
}; 