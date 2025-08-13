
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { images } from '@/lib/data';
import { debounce } from 'lodash';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [preloadedImages, setPreloadedImages] = useState<Record<number, HTMLImageElement>>({});
  const featuredImages = [1, 2, 3]; // Removed index 5 which has empty/invalid image
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const rafId = useRef<number>();
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Optimized scroll handler with RAF and throttling
  const handleScroll = useCallback(
    debounce(() => {
      if (parallaxRef.current && !isScrolling.current) {
        const scrollY = window.scrollY;
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
        rafId.current = requestAnimationFrame(() => {
          parallaxRef.current!.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
        });
      }
    }, 8), // Reduced debounce time for smoother scrolling
    []
  );
  
  // Optimized scroll event listener
  useEffect(() => {
    const scrollHandler = () => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        handleScroll();
        setTimeout(() => {
          isScrolling.current = false;
        }, 8);
      }
    };
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);
  
  // Aggressive image preloading strategy
  useEffect(() => {
    const preloadAllImages = () => {
      featuredImages.forEach((imageIndex, index) => {
        if (!preloadedImages[index] && images[imageIndex]) {
          const img = new Image();
          
          // Set high priority for first image
          if (index === 0) {
            img.fetchPriority = 'high';
          }
          
          img.onload = () => {
            setLoadedImages(prev => ({
              ...prev,
              [index]: true
            }));
            setPreloadedImages(prev => ({
              ...prev,
              [index]: img
            }));
          };
          
          img.onerror = () => {
            console.warn(`Failed to preload image: ${images[imageIndex]?.src}`);
            // Try loading without preload
            setLoadedImages(prev => ({
              ...prev,
              [index]: false
            }));
          };
          
          // Start loading
          img.src = images[imageIndex].src;
        }
      });
    };

    // Start preloading immediately
    preloadAllImages();
    
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [featuredImages, preloadedImages]);

  // Optimized image rotation with faster transitions
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isComponentMounted = true;
    
    const rotateImages = () => {
      if (isComponentMounted) {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === featuredImages.length - 1 ? 0 : prevIndex + 1
        );
        timeoutId = setTimeout(rotateImages, 4000); // Reduced from 5000ms
      }
    };
    
    // Start rotation after first image loads
    if (loadedImages[0]) {
      timeoutId = setTimeout(rotateImages, 4000);
    }
    
    return () => {
      isComponentMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [featuredImages.length, loadedImages]);

  // Handle image load for direct img elements
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  }, []);

  // Handle image error with better fallback
  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load hero image at index ${index}`);
    setLoadedImages(prev => ({
      ...prev,
      [index]: false
    }));
  }, []);
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Parallax Effect */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-75 ease-out"
        style={{ 
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        {featuredImages.map((imageIndex, index) => {
          const imageData = images[imageIndex];
          if (!imageData) return null;

          return (
            <div
              key={imageIndex}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ willChange: 'opacity' }}
            >
              {/* Loading placeholder with better styling */}
              {!loadedImages[index] && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
                  <div className="absolute inset-0 bg-black/20 animate-pulse" />
                </div>
              )}
              
              {/* Use preloaded image if available, otherwise load directly */}
              {preloadedImages[index] ? (
                <div 
                  className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${
                    loadedImages[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    backgroundImage: `url(${preloadedImages[index].src})`,
                    willChange: 'opacity'
                  }}
                />
              ) : (
                <img
                  src={imageData.src}
                  alt={imageData.alt}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loadedImages[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  style={{ willChange: 'opacity' }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Image Indicators with better performance */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {featuredImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentImageIndex === index 
                ? 'bg-white scale-100' 
                : 'bg-white/50 scale-75 hover:scale-90 hover:bg-white/70'
            }`}
            aria-label={`View image ${index + 1}`}
            style={{ willChange: 'transform, background-color' }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
