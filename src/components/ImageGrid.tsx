
import React, { useState } from 'react';
import { Image, getImageSrc } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageModal from './ImageModal';

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
  
  // Calculate the grid classes based on the number of columns
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
          <div key={image.id} className="hover-image-card rounded-md overflow-hidden">
            <div 
              className="aspect-[4/3] bg-muted relative"
              onClick={() => openModal(image)}
            >
              <img 
                src={getImageSrc(image.src)} 
                alt={image.alt} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="image-overlay">
                <h3 className="font-medium text-white text-lg mb-1">{image.title}</h3>
                <p className="text-white/80 text-sm mb-3">{image.location}</p>
                <Link 
                  to={`/print/${image.id}`}
                  className="inline-flex items-center bg-white/20 text-white text-sm backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  View print options
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </div>
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
        />
      )}
    </>
  );
};

export default ImageGrid;
