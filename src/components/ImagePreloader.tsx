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
        <span className="loader-5 mb-6" />
      </div>
    );
  }

  return <>{children}</>;
}; 