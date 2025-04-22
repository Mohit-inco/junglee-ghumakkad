import React, { useEffect, useRef, useState } from 'react';
import { X, Info } from 'lucide-react';
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
  const [rotateValue, setRotateValue] = useState(0);
  
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

  // Handle navigation without image transition animation
  const handleNavigate = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Rotate the X icon
    if (direction === 'next') {
      setRotateValue(rotateValue + 90);
    } else {
      setRotateValue(rotateValue - 90);
    }
    
    // Navigate immediately without animation
    if (direction === 'next') {
      onNext();
    } else {
      onPrev();
    }
    
    // Update the current image and reset transition state
    setCurrentImage(image);
    setIsTransitioning(false);
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
  }, [onClose, isTransitioning, rotateValue]);

  // Close when clicking outside of image
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click is not on the image or the info panel
    if (imageRef.current && !imageRef.current.contains(e.target as Node) && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div ref={modalRef} className="relative w-full h-full flex items-center justify-center">
        <div className="absolute top-4 right-4 z-10 flex space-x-4">
          <button 
            className="p-2 text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors" 
            onClick={() => setShowInfo(!showInfo)} 
            aria-label="Toggle information"
          >
            <Info className="h-5 w-5" />
          </button>
          <button 
            className="p-2 text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors" 
            onClick={onClose} 
            aria-label="Close modal"
            style={{ transform: `rotate(${rotateValue}deg)`, transition: 'transform 0.3s ease' }}
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
            className={`max-h-[80vh] object-contain ${isMobile ? 'w-[90vw]' : 'w-[60vw]'}`}
          />
        </div>
        
        {/* Image info panel with slide transition */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 text-white p-6 transform transition-transform duration-300 ease-in-out ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}
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
  );
};

export default ImageModal;
