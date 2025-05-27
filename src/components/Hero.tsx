import React, { useState, useEffect, useRef, useCallback } from 'react';
import { images } from '@/lib/data';
import { debounce } from 'lodash';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const featuredImages = [1, 2, 3, 5];
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const rafId = useRef<number>();
  
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
    }, 16),
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
        }, 16);
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
  
  // Optimized image rotation with cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isComponentMounted = true;
    
    const rotateImages = () => {
      if (isComponentMounted) {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === featuredImages.length - 1 ? 0 : prevIndex + 1
        );
        timeoutId = setTimeout(rotateImages, 5000);
      }
    };
    
    timeoutId = setTimeout(rotateImages, 5000);
    
    return () => {
      isComponentMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [featuredImages.length]);

  // Preload next image with error handling
  useEffect(() => {
    const nextIndex = (currentImageIndex + 1) % featuredImages.length;
    const nextImage = new Image();
    nextImage.src = images[featuredImages[nextIndex]].src;
    nextImage.onload = () => {
      setLoadedImages(prev => ({
        ...prev,
        [nextIndex]: true
      }));
    };
    nextImage.onerror = () => {
      console.error(`Failed to preload image: ${images[featuredImages[nextIndex]].src}`);
    };
  }, [currentImageIndex, featuredImages]);

  // Handle image load
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  }, []);
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Parallax Effect */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ 
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        {featuredImages.map((imageIndex, index) => (
          <div
            key={imageIndex}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'opacity' }}
          >
            {!loadedImages[index] && (
              <div className="absolute inset-0 bg-gray-900 animate-pulse" />
            )}
            <img
              src={images[imageIndex].src}
              alt={images[imageIndex].alt}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                loadedImages[index] ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {featuredImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white scale-100' 
                : 'bg-white/50 scale-75 hover:scale-90 hover:bg-white/70'
            }`}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
