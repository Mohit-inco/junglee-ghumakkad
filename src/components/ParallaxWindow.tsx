import React, { useState, useRef } from 'react';
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
  
  // Increased parallax effect sensitivity (0-400 instead of 0-200)
  const y = useTransform(scrollYProgress, [0, 1], [0, 400]);
  
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
      {/* Parallax Background Image - Increased height to 120% for more parallax room */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 w-full h-[120%]"
      >
        <div 
          className="w-full h-full transition-all duration-1000 ease-out"
          style={{ 
            backgroundImage: `url(${images[selectedImageIndex].src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30" />
      
      {/* Thumbnail navigation - very small rectangles at bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex gap-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-8 h-4 rounded-sm overflow-hidden transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'ring-1 ring-white' 
                  : 'ring-1 ring-white/30 hover:ring-white/70 opacity-60 hover:opacity-100'
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
  );
};

export default ParallaxWindow;
