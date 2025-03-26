
import React, { useState, useEffect, useRef } from 'react';
import { images } from '@/lib/data';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Using image indices 3, 4, and 6 as requested (which are at index 2, 3, and 5 in the array)
  const featuredImages = [2, 3, 5]; 
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Auto-rotate images with smooth transition
  useEffect(() => {
    const rotateImages = () => {
      setNextImageIndex((currentImageIndex + 1) % featuredImages.length);
      setIsTransitioning(true);
      
      // After the fade out completes, update the current image
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setIsTransitioning(false);
      }, 1000); // 1 second for fade out/in transition
    };
    
    const interval = setInterval(rotateImages, 6000); // 6 seconds between transitions (includes 1s fade)
    return () => clearInterval(interval);
  }, [currentImageIndex, nextImageIndex, featuredImages.length]);
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Parallax Effect */}
      <div ref={parallaxRef} className="absolute inset-0 bg-black">
        {featuredImages.map((imageIndex, index) => {
          const image = images[imageIndex];
          return (
            <div
              key={image.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1500 ease-in-out ${
                currentImageIndex === index 
                  ? isTransitioning ? 'opacity-0' : 'opacity-100' 
                  : nextImageIndex === index && isTransitioning 
                    ? 'opacity-100' 
                    : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'scale(1.05)', // Slight zoom for effect
              }}
            />
          );
        })}
      </div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {featuredImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setNextImageIndex(index);
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentImageIndex(index);
                  setIsTransitioning(false);
                }, 1000);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white scale-100' 
                : 'bg-white/50 scale-75 hover:scale-90 hover:bg-white/70'
            }`}
            aria-label={`View image ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
