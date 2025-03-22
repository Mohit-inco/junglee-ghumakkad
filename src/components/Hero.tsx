
import React, { useState, useEffect } from 'react';
import { images, getImageSrc } from '@/lib/data';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const featuredImages = [0, 1, 5]; // Indices of featured images from our data
  
  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === featuredImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredImages.length]);
  
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 bg-black">
        {featuredImages.map((imageIndex, index) => {
          const image = images[imageIndex];
          return (
            <div
              key={image.id}
              className="absolute inset-0 w-full h-full transition-opacity duration-2000 ease-in-out"
              style={{
                opacity: currentImageIndex === index ? 1 : 0,
                backgroundImage: `url(${getImageSrc(image.src)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'scale(1.03)', // Slight zoom for effect
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better contrast */}
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
