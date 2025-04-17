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
  const [imageOpacity, setImageOpacity] = useState(1);
  
  // Update internal image when prop changes
  useEffect(() => {
    if (image !== currentImage && !isTransitioning) {
      setCurrentImage(image);
    }
  }, [image, currentImage, isTransitioning]);
  
  // Touch handling for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNavigate('next');
    } else if (isRightSwipe) {
      handleNavigate('prev');
    }
  };

  // Handle navigation with fade transition
  const handleNavigate = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setImageOpacity(0);
    
    // Wait for fade out to complete before changing image
    setTimeout(() => {
      if (direction === 'next') {
        onNext();
      } else {
        onPrev();
      }
      
      // Update the current image after navigation
      setCurrentImage(image);
      
      // Fade in the new image
      setTimeout(() => {
        setImageOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 300); // Same as the transition duration in CSS
  };

  // Handle key presses for navigation and closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          handleNavigate('next');
          break;
        case 'ArrowLeft':
          handleNavigate('prev');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isTransitioning]);

  // Close when clicking outside of image
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click is not on the image or the info panel
    if (imageRef.current && !imageRef.current.contains(e.target as Node) && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
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
            
            <div 
              className="flex items-center justify-center h-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                ref={imageRef} 
                src={getImageSrc(currentImage.src)} 
                alt={currentImage.alt} 
                className={`max-h-[80vh] shadow-xl shadow-black/30 rounded object-contain transition-opacity duration-600 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${isMobile ? 'w-[90vw]' : 'w-[60vw]'}`}
                style={{ opacity: imageOpacity }}
              />
            </div>
            
            {/* Navigation buttons - hidden on mobile */}
            {!isMobile && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    if (!isTransitioning) handleNavigate('prev');
                  }} 
                  disabled={isTransitioning}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    if (!isTransitioning) handleNavigate('next');
                  }}
                  disabled={isTransitioning}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Image info panel */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 text-white p-6 transform transition-opacity duration-600 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}>
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
