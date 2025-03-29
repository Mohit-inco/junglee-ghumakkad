
import React, { useState } from 'react';
import { Image } from '@/lib/data';
import ImageModal from './ImageModal';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageGridProps {
  images: Image[];
  columns?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, columns = 3 }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  
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
  
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  
  return (
    <>
      <div className={`grid ${gridClass} gap-6 md:gap-8`}>
        {images.map((image) => (
          <div key={image.id} className="group rounded-md overflow-hidden shadow-md">
            <div 
              className="hover-image-card relative cursor-pointer"
              onClick={() => openModal(image)}
            >
              <AspectRatio ratio={4/3} className="bg-muted">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <h3 className="font-medium text-white text-lg mb-1">{image.title}</h3>
                  <p className="text-white/80 text-sm">{image.location}</p>
                </div>
              </AspectRatio>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={closeModal} 
          onNext={nextImage} 
          onPrev={prevImage} 
          hidePrintOption={true}
        />
      )}
    </>
  );
};

export default ImageGrid;
