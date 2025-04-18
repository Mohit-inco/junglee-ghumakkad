import React, { useState, useEffect } from 'react';
import { Image } from '@/lib/data';
import ImageModal from './ImageModal';

interface ImageGridProps {
  images: Image[];
  columns?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, columns = 2 }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [columnArrays, setColumnArrays] = useState<Image[][]>([]);
  
  useEffect(() => {
    // Create column arrays based on specified column count
    const cols = Array.from({ length: columns }, () => [] as Image[]);
    
    // Distribute images among columns for masonry layout
    images.forEach((image, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push(image);
    });
    
    setColumnArrays(cols);
  }, [images, columns]);
  
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
  
  // Responsive column classes (keeping original logic)
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  
  return (
    <>
      {/* Replace grid with flex for masonry layout */}
      <div className="flex flex-wrap w-full gap-3 md:gap-4">
        {columnArrays.map((column, columnIndex) => (
          <div 
            key={`column-${columnIndex}`} 
            className="flex-grow flex flex-col gap-3 md:gap-4"
            style={{ 
              width: `calc(${100/columns}% - ${columns > 1 ? '0.75rem' : '0px'})`,
            }}
          >
            {column.map((image) => (
              <div key={image.id} className="group rounded-md overflow-hidden">
                <div 
                  className="hover-image-card bg-muted relative cursor-pointer"
                  onClick={() => openModal(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <h3 className="font-medium text-white text-lg mb-1">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={closeModal} 
          onNext={nextImage} 
          onPrev={prevImage} 
        />
      )}
    </>
  );
};

export default ImageGrid;
