
import React from 'react';
import { useImagePreloader } from '../hooks/useImagePreloader';

interface ImagePreloaderProps {
  images: string[];
  children: React.ReactNode;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  priorityCount?: number;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  images,
  children,
  onComplete,
  onError,
  priorityCount = 6,
}) => {
  const { progress, isLoading, error } = useImagePreloader({
    images,
    onComplete,
    onError,
    priorityCount,
  });

  if (error) {
    console.warn('Image preloading failed, continuing anyway:', error.message);
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-gray-300 text-sm">
          Loading gallery... {Math.round(progress)}%
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
