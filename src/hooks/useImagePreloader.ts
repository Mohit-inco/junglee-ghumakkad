import { useState, useEffect } from 'react';
import ImagePreloader from '../lib/imagePreloader';

interface UseImagePreloaderOptions {
  images: string[];
  priorityImages?: string[];
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const useImagePreloader = ({ images, priorityImages, onComplete, onError }: UseImagePreloaderOptions) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const preloader = new ImagePreloader({
      priorityImages,
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
  }, [images, priorityImages, onComplete, onError]);

  return {
    progress,
    isLoading,
    error,
  };
}; 