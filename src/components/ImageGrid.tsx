
import React, { useState } from 'react';
import { Image } from '@/lib/data';
import ImageModal from './ImageModal';

interface ImageGridProps {
  images: Image[];
  columns?: number; // Make this prop optional with a default value
  showPrices?: boolean; // Option to show prices
  minPrice?: Record<string, number>; // Minimum price per image ID
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3, // Default to 3 columns if not specified
  showPrices = false,
  minPrice = {}
}) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  
  const openModal = (image: Image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };
  
  const nextImage = () => {
    if (selectedImage) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
    }
  };
  
  const prevImage = () => {
    if (selectedImage) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id);
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setSelectedImage(images[prevIndex]);
    }
  };
  
  // Generate the appropriate column class based on the columns prop
  const getColumnClass = () => {
    switch(columns) {
      case 1: return 'columns-1';
      case 2: return 'columns-1 sm:columns-2';
      case 3: return 'columns-1 sm:columns-2 md:columns-2 xl:columns-3';
      case 4: return 'columns-1 sm:columns-2 md:columns-3 xl:columns-4';
      default: return 'columns-1 sm:columns-2 md:columns-2 xl:columns-3';
    }
  };
  
  return (
    <>
      <div className={`${getColumnClass()} gap-4 space-y-4`}>
        {images.map(image => (
          <div 
            key={image.id} 
            className="break-inside-avoid overflow-hidden"
            onMouseEnter={() => setHoveredImageId(image.id)}
            onMouseLeave={() => setHoveredImageId(null)}
          >
            <div 
              className="hover-image-card bg-muted relative cursor-pointer transition-all duration-300" 
              onClick={() => openModal(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className={`w-full h-auto object-cover transition-all duration-300 ${
                  hoveredImageId === image.id ? 'brightness-110' : 
                  hoveredImageId !== null ? 'brightness-50' : 'brightness-100'
                }`} 
                loading="lazy" 
              />
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="font-medium text-white text-lg mb-1">{image.title}</h3>
                <p className="text-white/80 text-sm">{image.location}</p>
                {showPrices && minPrice[image.id] && (
                  <p className="mt-1 text-white font-medium">
                    From ₹{minPrice[image.id].toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && <ImageModal image={selectedImage} onClose={closeModal} onNext={nextImage} onPrev={prevImage} />}
    </>
  );
};

export default ImageGrid;
