import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Image, getImageSrc } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onNext,
  onPrev
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useIsMobile();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  
  // Touch handling for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  // Update current image when prop changes
  useEffect(() => {
    if (image.src !== currentImage.src) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentImage(image);
        setIsTransitioning(false);
      }, 300); // Match the transition duration
      return () => clearTimeout(timer);
    }
  }, [image, currentImage.src]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
  };

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

  // Close when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close if click is directly on the backdrop element
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef} 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
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
          
          <div 
            className="flex items-center justify-center h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative inline-block">
              <img 
                ref={imageRef} 
                src={getImageSrc(currentImage.src)} 
                alt={currentImage.alt} 
                className={`max-h-[80vh] rounded object-contain transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${isMobile ? 'max-w-[85vw]' : 'max-w-[70vw]'}`}
                style={{ 
                  filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))', 
                  objectFit: 'contain' 
                }}
              />
            </div>
          </div>
          
          {/* Navigation buttons - hidden on mobile */}
          {!isMobile && (
            <>
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
                onClick={e => {
                  e.stopPropagation();
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
                  onNext();
                }} 
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Image info panel */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 text-white p-6 transform transition-transform duration-300 ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}>
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
  );
};

export default ImageModal;
