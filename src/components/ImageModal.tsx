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
  const [isClosing, setIsClosing] = useState(false);

  // Update internal image when prop changes
  useEffect(() => {
    if (image !== currentImage && !isTransitioning) {
      setCurrentImage(image);
    }
  }, [image, currentImage, isTransitioning]);

  // Touch handling for swipe navigation and close
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  // Minimum swipe distance (in px) to trigger navigation or close
  const minSwipeDistance = 50;
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const xDistance = touchStart.x - touchEnd.x;
    const yDistance = touchStart.y - touchEnd.y;
    
    // Determine if the swipe is more horizontal or vertical
    if (Math.abs(xDistance) > Math.abs(yDistance)) {
      // Horizontal swipe - for navigation
      const isLeftSwipe = xDistance > minSwipeDistance;
      const isRightSwipe = xDistance < -minSwipeDistance;
      
      if (isLeftSwipe && !isMobile) {
        handleNavigate('next');
      } else if (isRightSwipe && !isMobile) {
        handleNavigate('prev');
      }
    } else {
      // Vertical swipe - for closing on mobile
      const isUpSwipe = yDistance > minSwipeDistance;
      
      if (isUpSwipe && isMobile) {
        handleCloseWithAnimation();
      }
    }
  };

  // Close with animation
  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Handle navigation with X button rotation
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
          handleCloseWithAnimation();
          break;
        case 'ArrowRight':
          if (!isMobile) handleNavigate('next');
          break;
        case 'ArrowLeft':
          if (!isMobile) handleNavigate('prev');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isTransitioning, rotateValue, isMobile]);

  // Handle clicks outside image and info panel
  const handleBackdropClick = (e: React.MouseEvent) => {
    // If info panel is showing, close it first
    if (showInfo) {
      setShowInfo(false);
      return;
    }

    // Only close if the click is not on the image
    if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
      handleCloseWithAnimation();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
      onClick={handleBackdropClick}
    >
      <div ref={modalRef} className="relative w-full h-full flex items-center justify-center">
        {/* Navigation buttons - hidden on mobile */}
        {!isMobile && (
          <>
            <div className="absolute top-1/2 left-[12%] z-10 px-0">
              <button 
                className="p-2 text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors" 
                onClick={e => {
                  e.stopPropagation();
                  handleNavigate('prev');
                }} 
                aria-label="Previous image"
                style={{
                  transform: `rotate(${rotateValue}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>
            
            <div className="absolute top-1/2 right-[12%] z-10">
              <button 
                className="p-2 text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors" 
                onClick={e => {
                  e.stopPropagation();
                  handleNavigate('next');
                }} 
                aria-label="Next image"
                style={{
                  transform: `rotate(${rotateValue}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>
          </>
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            className="p-2 text-white bg-black/20 rounded-full hover:bg-black/40 transition-colors" 
            onClick={e => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }} 
            aria-label="Toggle information"
          >
            <Info className="h-6 w-6" />
          </button>
        </div>
        
        <div 
          className={`flex items-center justify-center h-full ${isMobile ? 'mt-6' : ''}`}
          onTouchStart={handleTouchStart} 
          onTouchMove={handleTouchMove} 
          onTouchEnd={handleTouchEnd}
        >
          <img 
            ref={imageRef} 
            src={getImageSrc(currentImage.src)} 
            alt={currentImage.alt} 
            className={`max-h-[80vh] object-contain ${isMobile ? 'w-[90vw]' : 'w-[60vw]'} ${isClosing ? 'transform translate-y-full transition-transform duration-300' : ''}`}
            onClick={e => e.stopPropagation()} // Prevent closing when clicking on image
          />
        </div>
        
        {/* Image info panel with slide transition */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 text-white p-6 transform transition-transform duration-300 ease-in-out ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={e => e.stopPropagation()} // Prevent closing modal when clicking on info panel
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
        
        {/* Mobile swipe indicator - visible only on mobile */}
        {isMobile && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center text-white/50 text-xs">
            <div className="flex flex-col items-center">
              <div className="h-1 w-16 bg-white/30 rounded-full mb-2"></div>
              <span>Swipe up to close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
