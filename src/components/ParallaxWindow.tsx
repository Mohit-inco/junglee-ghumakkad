
import React, { useState, useEffect, useRef } from 'react';
import { Image } from '@/lib/data';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxWindowProps {
  images: Image[];
}

const ParallaxWindow: React.FC<ParallaxWindowProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect values for depth
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  // Auto-rotate images (optional, can be disabled)
  useEffect(() => {
    const interval = setInterval(() => {
      if (images.length > 1) {
        setSelectedImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 7000); // Change image every 7 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  // If no images, display placeholder
  if (images.length === 0) {
    return (
      <div className="w-full h-[70vh] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No featured images available</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[70vh] overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 w-full h-[110%]"
      >
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-out"
          style={{ 
            backgroundImage: `url(${images[selectedImageIndex].src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </motion.div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
      
      {/* Image information */}
      <div className="absolute bottom-20 left-0 right-0 px-6 text-white transition-all duration-500 ease-out transform">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-serif mb-2">{images[selectedImageIndex].title}</h3>
          <p className="text-white/80 text-sm">
            {images[selectedImageIndex].location}
            {images[selectedImageIndex].date && ` • ${images[selectedImageIndex].date}`}
          </p>
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-200 ${
                  selectedImageIndex === index 
                    ? 'ring-2 ring-white scale-105' 
                    : 'ring-1 ring-white/30 hover:ring-white/70'
                }`}
                aria-label={`View ${image.title}`}
              >
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxWindow;
