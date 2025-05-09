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
      <div className="w-full h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No featured images available</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* Parallax Background Image - Increased height to 120% for more parallax room */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 w-full h-[120%]"
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
      
      {/* Thumbnail navigation - moved to right side with minimalistic design */}
      <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
        <div className="flex flex-col gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-12 h-8 rounded-sm overflow-hidden transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-white' 
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
