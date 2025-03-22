
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
  
  const currentImage = images[featuredImages[currentImageIndex]];
  
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
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text contrast */}
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-white px-6 text-center z-10 animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold mb-6 max-w-4xl tracking-tight">
          Capturing the Untamed Beauty of Wildlife
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 leading-relaxed">
          Award-winning wildlife photography from the world's most remote and pristine habitats
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/gallery"
            className="px-8 py-3 rounded-md bg-white text-black font-medium hover:bg-white/90 transition-colors duration-300"
          >
            Explore Gallery
          </Link>
          <Link
            to="/print"
            className="px-8 py-3 rounded-md bg-black/30 backdrop-blur-sm border border-white/30 text-white font-medium hover:bg-black/50 transition-colors duration-300"
          >
            Browse Prints
          </Link>
        </div>
        
        {/* Image Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
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
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 right-10 hidden md:flex items-center text-sm text-white/80 animate-pulse">
          <span className="mr-2">Scroll to explore</span>
          <ChevronRight className="h-5 w-5 rotate-90" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
