
import React, { useState } from 'react';
import { Image } from '@/lib/data';
import ImageModal from './ImageModal';

interface ImageGridProps {
  images: Image[];
  columns?: number; // Add optional columns prop
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images
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
  
  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-2 xl:columns-3 gap-4 space-y-4">
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 bg-[#000a0e]/0">
                <h3 className="font-medium text-white text-lg mb-1">{image.title}</h3>
                <p className="text-white/80 text-sm">{image.location}</p>
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
