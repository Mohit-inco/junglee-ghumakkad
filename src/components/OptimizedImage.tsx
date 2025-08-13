import React, { useState, useRef, useEffect } from 'react';
import { getCDNImageUrl, getProgressiveImageUrls, getSmartImageUrl, ImageTransformOptions } from '@/lib/imageUtils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  progressive?: boolean;
  lazy?: boolean;
  transformOptions?: ImageTransformOptions;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  progressive = true,
  lazy = true,
  transformOptions = {},
  onLoad,
  onError,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Get optimized URLs
  const options = { width, height, quality, ...transformOptions };
  const optimizedSrc = getSmartImageUrl(src, options);
  const progressiveUrls = progressive ? getProgressiveImageUrls(src) : null;

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`bg-muted animate-pulse ${className}`}
        style={{ width, height }}
        {...props}
      />
    );
  }

  if (hasError) {
    return (
      <div
        className={`bg-muted flex items-center justify-center text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder blur */}
      {progressive && !isLoaded && (
        <img
          src={progressiveUrls?.placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${className}`}
          style={{ filter: 'blur(10px)' }}
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;