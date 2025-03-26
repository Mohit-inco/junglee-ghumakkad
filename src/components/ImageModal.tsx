
import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Image, getImageSrc } from '@/lib/data';

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isGalleryView?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onNext,
  onPrev,
  isGalleryView = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  const [nextImage, setNextImage] = useState<Image | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (nextImage) {
      const timer = setTimeout(() => {
        setCurrentImage(nextImage);
        setNextImage(null);
        setIsTransitioning(false);
      }, 800); // Duration of the crossfade (a bit longer than CSS transition)
      return () => clearTimeout(timer);
    }
  }, [nextImage]);

  // Update current image when the prop changes, but with transition
  useEffect(() => {
    if (image.id !== currentImage.id && !isTransitioning) {
      setIsTransitioning(true);
      setNextImage(image);
    }
  }, [image, currentImage.id, isTransitioning]);

  // Handle key presses for navigation and closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Close when clicking outside of content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Toggle zoom effect on image click
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="blur-backdrop" onClick={handleBackdropClick}>
      <div className="image-modal">
        <div ref={modalRef} className="image-modal-content">
          <div className="relative h-full">
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button 
                className="p-1.5 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
                onClick={() => setShowInfo(!showInfo)} 
                aria-label="Toggle information"
              >
                <Info className="h-5 w-5" />
              </button>
              
              <button 
                className="p-1.5 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
                onClick={onClose} 
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-center h-full">
              {/* Current Image */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={handleImageClick}
              >
                <div className={`transition-transform duration-500 ease-in-out ${isZoomed ? 'scale-125' : 'scale-100'}`}>
                  <img 
                    src={getImageSrc(currentImage.src)} 
                    alt={currentImage.alt} 
                    className="max-h-full max-w-full object-contain shadow-xl shadow-black/30 rounded cursor-zoom-in" 
                  />
                </div>
              </div>
              
              {/* Next Image (for transition) */}
              {nextImage && (
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                    isTransitioning ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={getImageSrc(nextImage.src)} 
                    alt={nextImage.alt} 
                    className="max-h-full max-w-full object-contain shadow-xl shadow-black/30 rounded" 
                  />
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
              onClick={e => {
                e.stopPropagation();
                if (isZoomed) setIsZoomed(false);
                onPrev();
              }} 
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
              onClick={e => {
                e.stopPropagation();
                if (isZoomed) setIsZoomed(false);
                onNext();
              }} 
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image info panel */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 text-white p-6 transform transition-transform duration-300 ${
                showInfo ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <h2 className="text-xl font-medium mb-2">{currentImage.title}</h2>
              <p className="text-white/80 mb-3">{currentImage.description}</p>
              
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-white/70">
                <div>
                  <span className="font-medium block text-white">Location</span>
                  <span>{currentImage.location}</span>
                </div>
                <div>
                  <span className="font-medium block text-white">Date</span>
                  <span>{currentImage.date}</span>
                </div>
                {currentImage.photographerNote && (
                  <div className="w-full mt-1">
                    <span className="font-medium block text-white">Photographer's Note</span>
                    <span className="text-white/80 italic">{currentImage.photographerNote}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
                <div className="flex gap-2">
                  {currentImage.categories.map((category, index) => (
                    <span key={index} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
