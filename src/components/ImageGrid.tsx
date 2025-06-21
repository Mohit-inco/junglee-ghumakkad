
import React, { useState } from 'react';
import { Image } from '@/lib/data';
import ImageModal from './ImageModal';
import { getThumbnailUrl, getOptimizedImageUrl } from '@/lib/imageUtils';

interface ImageGridProps {
  images: Image[];
  columns?: number;
  showPrices?: boolean;
  minPrice?: Record<string, number>;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3,
  showPrices = false,
  minPrice = {}
}) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
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
  
  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to original URL if optimized version fails
    if (!target.src.includes('transform')) {
      target.src = '/placeholder-image.jpg';
    } else {
      // Remove transform parameters and try original
      const originalUrl = target.src.split('?')[0];
      target.src = originalUrl;
    }
    console.error(`Failed to load image: ${target.src}`);
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
        {images.map(image => {
          // Use optimized thumbnail for grid view
          const thumbnailSrc = getThumbnailUrl(image.src, 400);
          // Use higher quality for modal
          const fullSrc = getOptimizedImageUrl(image.src, { quality: 90, format: 'webp' });
          
          return (
            <div 
              key={image.id} 
              className="break-inside-avoid overflow-hidden"
              onMouseEnter={() => setHoveredImageId(image.id)}
              onMouseLeave={() => setHoveredImageId(null)}
            >
              <div 
                className="hover-image-card bg-muted relative cursor-pointer transition-all duration-300" 
                onClick={() => openModal({ ...image, src: fullSrc })}
              >
                {/* Loading placeholder */}
                {!loadedImages[image.id] && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <img 
                  src={thumbnailSrc}
                  alt={image.alt} 
                  className={`w-full h-auto object-cover transition-all duration-300 ${
                    hoveredImageId === image.id ? 'brightness-110' : 
                    hoveredImageId !== null ? 'brightness-50' : 'brightness-100'
                  } ${loadedImages[image.id] ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(image.id)}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  {showPrices && minPrice[image.id] && (
                    <p className="mt-1 text-white font-medium">
                      From ₹{minPrice[image.id].toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedImage && <ImageModal image={selectedImage} onClose={closeModal} onNext={nextImage} onPrev={prevImage} />}
    </>
  );
};

export default ImageGrid;
