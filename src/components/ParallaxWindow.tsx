import React, { useState, useRef } from 'react';
import { Image } from '@/lib/data';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

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
    <div className="w-full flex flex-col">
      {/* Parallax container - increased to 80vh */}
      <div ref={containerRef} className="relative w-[100vw] h-[100vh] overflow-hidden bg-black/10">
        {/* Parallax Background Image with fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ y }}
            className="absolute inset-0 w-full h-[120%]"
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${images[selectedImageIndex].src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat',
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
      </div>
      
      {/* Thumbnail navigation - dark theme instead of white */}
      <div className="w-full py-3 bg-gray-900">
        <div className="flex justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-10 h-6 overflow-hidden transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-blue-400 scale-105' 
                  : 'ring-1 ring-gray-600 hover:ring-blue-300'
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
