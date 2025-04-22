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
  const trackRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useIsMobile();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [currentImage, setCurrentImage] = useState(image);
  
  // We'll maintain a local cache of recently viewed images to build our track
  const [recentImages, setRecentImages] = useState<Image[]>([image]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Track slider state
  const [mouseDownAt, setMouseDownAt] = useState(0);
  const [prevPercentage, setPrevPercentage] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // Update when prop changes
  useEffect(() => {
    if (image.id !== currentImage.id) {
      if (!isTransitioning) {
        handleImageChange(image);
      }
    }
  }, [image]);

  // Handle image change with track update
  const handleImageChange = (newImage: Image) => {
    setIsTransitioning(true);
    setImageOpacity(0);
    
    setTimeout(() => {
      // Check if image already exists in our recent images
      const existingIndex = recentImages.findIndex(img => img.id === newImage.id);
      
      if (existingIndex !== -1) {
        // Image exists, just update current index
        setCurrentIndex(existingIndex);
        updateTrackPosition(existingIndex);
      } else {
        // Add new image to our recent list (max 9 images in track)
        const updatedImages = [...recentImages, newImage];
        if (updatedImages.length > 9) {
          // Remove oldest image if we exceed 9
          updatedImages.shift();
        }
        setRecentImages(updatedImages);
        setCurrentIndex(updatedImages.length - 1);
        updateTrackPosition(updatedImages.length - 1);
      }
      
      setCurrentImage(newImage);
      
      setTimeout(() => {
        setImageOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };
  
  // Update track position based on index
  const updateTrackPosition = (index: number) => {
    const maxIndex = recentImages.length - 1;
    if (maxIndex === 0) return; // Only one image, don't move track
    
    const newPercentage = -(index / maxIndex) * 100;
    setPercentage(newPercentage);
    setPrevPercentage(newPercentage);
  };

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
    
    setTimeout(() => {
      if (direction === 'next') {
        onNext();
      } else {
        onPrev();
      }
      
      setTimeout(() => {
        setImageOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Track slider functionality 
  const handleOnDown = (e: React.MouseEvent) => {
    setMouseDownAt(e.clientX);
  };
  
  const handleOnUp = () => {
    setMouseDownAt(0);
    setPrevPercentage(percentage);
    
    if (recentImages.length <= 1) return;
    
    // Snap to closest image
    const itemCount = recentImages.length;
    const step = 100 / (itemCount - 1);
    const closestIndex = Math.min(Math.max(Math.round(-percentage / step), 0), itemCount - 1);
    
    const snapPercentage = -(closestIndex / (itemCount - 1)) * 100;
    setPercentage(snapPercentage);
    setPrevPercentage(snapPercentage);
    
    // Only navigate if index changed
    if (closestIndex !== currentIndex) {
      const targetImage = recentImages[closestIndex];
      
      // Find how to get to this image from current
      // This is needed because our parent component manages the active image
      if (targetImage.id === currentImage.id) return;
      
      setIsTransitioning(true);
      setImageOpacity(0);
      setCurrentIndex(closestIndex);
      
      // Let the parent know we're changing images
      // We do this by simulating multiple next/prev calls
      setTimeout(() => {
        const targetId = targetImage.id;
        let tempImage = currentImage;
        
        // Try going forward first (most likely shorter path)
        let found = false;
        for (let i = 0; i < recentImages.length; i++) {
          onNext();
          // We need to simulate the navigation to track what the current image would be
          const nextIndex = recentImages.findIndex(img => img.id === tempImage.id) + 1;
          tempImage = recentImages[nextIndex % recentImages.length] || recentImages[0];
          
          if (tempImage.id === targetId) {
            found = true;
            break;
          }
        }
        
        if (!found) {
          // Reset and try backward
          for (let i = 0; i < recentImages.length; i++) {
            onPrev();
          }
        }
        
        setTimeout(() => {
          setImageOpacity(1);
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };
  
  const handleOnMove = (e: React.MouseEvent) => {
    if (mouseDownAt === 0 || recentImages.length <= 1) return;
    
    const mouseDelta = mouseDownAt - e.clientX;
    const maxDelta = window.innerWidth / 2;
    
    const nextPercentageUnconstrained = prevPercentage + (mouseDelta / maxDelta) * -100;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    
    setPercentage(nextPercentage);
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
    
    // Add track mouse events to window
    const handleWindowMouseDown = (e: MouseEvent) => handleOnDown(e as unknown as React.MouseEvent);
    const handleWindowMouseUp = () => handleOnUp();
    const handleWindowMouseMove = (e: MouseEvent) => handleOnMove(e as unknown as React.MouseEvent);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleWindowMouseDown);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('mousemove', handleWindowMouseMove);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleWindowMouseDown);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [onClose, isTransitioning, mouseDownAt, prevPercentage, currentIndex, recentImages]);

  // Close when clicking outside of image
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click is not on the image or the info panel
    if (imageRef.current && !imageRef.current.contains(e.target as Node) && 
        modalRef.current && !modalRef.current.contains(e.target as Node) &&
        trackRef.current && !trackRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Choose a specific image directly from the track
  const selectTrackImage = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    // Use the same logic as handleOnUp but simplified
    setIsTransitioning(true);
    setImageOpacity(0);
    setCurrentIndex(index);
    updateTrackPosition(index);
    
    // Let the parent know we're changing images
    setTimeout(() => {
      const targetImage = recentImages[index];
      const targetId = targetImage.id;
      
      // Try to find the shortest path to the target image
      const nextImageStep = () => {
        onNext();
        // Check if we've reached the target
        if (image.id === targetId) return true;
        return false;
      };
      
      const prevImageStep = () => {
        onPrev();
        // Check if we've reached the target
        if (image.id === targetId) return true;
        return false;
      };
      
      // Try up to n steps to find the image
      let found = false;
      for (let i = 0; i < recentImages.length && !found; i++) {
        found = nextImageStep();
      }
      
      if (!found) {
        // Reset and try going the other way
        for (let i = 0; i < recentImages.length && !found; i++) {
          found = prevImageStep();
        }
      }
      
      setTimeout(() => {
        setImageOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50" onClick={handleBackdropClick}>
      <div className="fixed inset-0 flex flex-col">
        {/* Header with title and controls */}
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-white text-xl font-medium">
            {currentImage.title}
          </h2>
          <div className="flex space-x-4">
            <button 
              className="p-1.5 text-white hover:text-gray-300 transition-colors" 
              onClick={() => setShowInfo(!showInfo)}
              aria-label="Toggle information"
            >
              <Info className="h-5 w-5" />
            </button>
            <button 
              className="p-1.5 text-white hover:text-gray-300 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      
        {/* Main image display with navigation buttons */}
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={modalRef}
        >
          {/* Navigation buttons */}
          {!isMobile && (
            <>
              <button 
                className="absolute left-6 text-white hover:text-gray-300 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isTransitioning) handleNavigate('prev');
                }}
                disabled={isTransitioning}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              
              <button 
                className="absolute right-6 text-white hover:text-gray-300 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isTransitioning) handleNavigate('next');
                }}
                disabled={isTransitioning}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          
          {/* Main image */}
          <img 
            ref={imageRef} 
            src={getImageSrc(currentImage.src)} 
            alt={currentImage.alt} 
            className="max-h-[calc(100vh-12rem)] max-w-[90vw] md:max-w-[80vw] shadow-xl shadow-black/30 rounded object-contain transition-opacity duration-300 ease-out"
            style={{ opacity: imageOpacity }}
          />
          
          {/* Image info panel with slide animation */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/0 text-white p-6 transform transition-all duration-300 ease-in-out ${
              showInfo ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
              <div className="flex gap-2 mt-2">
                {currentImage.categories.map((category, i) => (
                  <span key={i} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Image track at bottom - only show if we have more than one image */}
        {recentImages.length > 1 && (
          <div className="h-24 relative overflow-hidden">
            {/* Item counter */}
            <div className="absolute top-2 left-6 text-white text-sm">
              {currentIndex + 1} — {recentImages.length}
            </div>
            
            {/* Image track */}
            <div 
              ref={trackRef}
              className="flex gap-4 absolute left-1/2 bottom-0 h-full items-center select-none px-6"
              style={{ 
                transform: `translateX(${percentage}%)`,
                transition: percentage === prevPercentage ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
              }}
            >
              {recentImages.map((img, index) => (
                <div 
                  key={img.id} 
                  className={`relative cursor-pointer transition-transform duration-300 ${
                    index === currentIndex ? 'transform scale-110' : ''
                  }`}
                  onClick={() => selectTrackImage(index)}
                >
                  <img 
                    src={getImageSrc(img.src, "thumbnail")} // Assuming there's a way to get thumbnail versions
                    alt={img.alt}
                    className="h-12 w-16 object-cover border-2 rounded transition-all duration-300"
                    style={{ 
                      opacity: index === currentIndex ? 1 : 0.5,
                      transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
                      borderColor: index === currentIndex ? 'white' : 'transparent'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
