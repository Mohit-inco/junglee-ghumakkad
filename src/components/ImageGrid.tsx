import React, { useState, useRef } from 'react';
import { Image } from '@/lib/data';
import ImageModal from './ImageModal';

interface ImageGridProps {
  images: Image[];
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images
}) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [animationState, setAnimationState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle');
  const [clickedImagePosition, setClickedImagePosition] = useState({ 
    x: 0, y: 0, width: 0, height: 0, src: ''
  });
  const gridRef = useRef<HTMLDivElement>(null);

  // Function to handle opening the modal with animation
  const handleOpenModal = (image: Image, e: React.MouseEvent<HTMLDivElement>) => {
    // Get the position and dimensions of the clicked image
    const imgElement = e.currentTarget.querySelector('img');
    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      setClickedImagePosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        src: imgElement.src
      });
      
      // Start opening animation
      setAnimationState('opening');
      document.body.style.overflow = 'hidden';
      
      // After animation completes, show the modal
      setTimeout(() => {
        setSelectedImage(image);
        setAnimationState('open');
      }, 300); // Match this with animation duration
    }
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    // Start closing animation
    setAnimationState('closing');
    
    // Remove the modal after animation completes
    setTimeout(() => {
      setSelectedImage(null);
      document.body.style.overflow = '';
      setAnimationState('idle');
    }, 300);
  };

  // Functions for next/prev navigation
  const handleNextImage = () => {
    if (selectedImage) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    if (selectedImage) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id);
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setSelectedImage(images[prevIndex]);
    }
  };

  // Determine if the grid should be dimmed
  const isGridDimmed = animationState !== 'idle';

  return (
    <>
      {/* Main image grid */}
      <div 
        ref={gridRef}
        className={`columns-1 sm:columns-2 md:columns-2 xl:columns-3 gap-4 space-y-4 transition-all duration-300 ${
          isGridDimmed ? 'opacity-20 scale-98' : 'opacity-100 scale-100'
        }`}
      >
        {images.map(image => (
          <div 
            key={image.id} 
            className="break-inside-avoid mb-4"
            onMouseEnter={() => setHoveredImageId(image.id)}
            onMouseLeave={() => setHoveredImageId(null)}
          >
            <div 
              className="bg-muted relative cursor-pointer overflow-hidden" 
              onClick={(e) => handleOpenModal(image, e)}
            >
              <img 
                src={image.src} 
                alt={image.alt || ''} 
                className={`w-full h-auto object-cover transition-all duration-300 ${
                  hoveredImageId === image.id ? 'brightness-110 scale-105' : 
                  hoveredImageId !== null ? 'brightness-50' : 'brightness-100'
                }`} 
                loading="lazy" 
              />
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="font-medium text-white text-lg mb-1">{image.title || 'Image'}</h3>
                <p className="text-white/80 text-sm">{image.location || ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Animation overlay - shows only during opening animation */}
      {animationState === 'opening' && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div 
            className="absolute"
            style={{
              position: 'fixed',
              left: clickedImagePosition.x,
              top: clickedImagePosition.y,
              width: clickedImagePosition.width,
              height: clickedImagePosition.height,
              animation: 'zoom-to-center 300ms ease-out forwards',
              zIndex: 45
            }}
          >
            <img 
              src={clickedImagePosition.src} 
              alt="Zooming image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-0 animate-fade-in z-40"></div>
        </div>
      )}
      
      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes zoom-to-center {
          0% {
            left: ${clickedImagePosition.x}px;
            top: ${clickedImagePosition.y}px;
            width: ${clickedImagePosition.width}px;
            height: ${clickedImagePosition.height}px;
            transform: scale(1);
          }
          100% {
            left: 50%;
            top: 50%;
            width: ${typeof window !== 'undefined' && window.innerWidth > 768 ? '60vw' : '90vw'};
            height: 80vh;
            transform: translate(-50%, -50%);
            object-fit: contain;
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 0.9; }
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
        
        .animate-fade-in {
          animation: fade-in 300ms forwards;
        }
      `}</style>
      
      {/* Render the image modal when an image is selected */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={handleCloseModal} 
          onNext={handleNextImage} 
          onPrev={handlePrevImage} 
        />
      )}
    </>
  );
};

export default ImageGrid;
