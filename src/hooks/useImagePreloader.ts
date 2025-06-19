
import { useState, useEffect } from 'react';
import SmartImagePreloader from '../lib/smartImagePreloader';

interface UseImagePreloaderOptions {
  images: string[];
  onComplete?: () => void;
  onError?: (error: Error) => void;
  priorityCount?: number;
}

export const useImagePreloader = ({ 
  images, 
  onComplete, 
  onError,
  priorityCount = 6 
}: UseImagePreloaderOptions) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const preloader = new SmartImagePreloader({
      priorityCount,
      batchSize: 3,
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
      preloader.abort();
    };
  }, [images, onComplete, onError, priorityCount]);

  return {
    progress,
    isLoading,
    error,
  };
};
