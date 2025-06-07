import React from 'react';
import { useImagePreloader } from '../hooks/useImagePreloader';

interface ImagePreloaderProps {
  images: string[];
  children: React.ReactNode;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  images,
  children,
  onComplete,
  onError,
}) => {
  const { progress, isLoading, error } = useImagePreloader({
    images,
    onComplete,
    onError,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading images: {error.message}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-gray-600">Loading images... {Math.round(progress)}%</p>
      </div>
    );
  }

  return <>{children}</>;
}; 