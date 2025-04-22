import React, { useEffect } from 'react';
import { Image } from '@/lib/data';

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  animating?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onNext,
  onPrev,
  animating = false
}) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      animating ? 'opacity-0' : 'opacity-100'
    } transition-opacity duration-300`}>
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative z-10 max-w-6xl w-full mx-auto overflow-hidden flex flex-col">
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white rounded-full p-2 
                     hover:bg-opacity-70 transition-all duration-200"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Navigation buttons */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white 
                     rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
          onClick={onPrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white 
                     rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
          onClick={onNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={image.src} 
            alt={image.alt} 
            className="max-h-[80vh] max-w-full object-contain" 
          />
        </div>
        
        {/* Image info */}
        <div className="bg-black bg-opacity-75 p-4 text-white">
          <h2 className="text-xl font-bold">{image.title}</h2>
          <p className="text-sm text-gray-300">{image.location}</p>
          {image.description && <p className="mt-2">{image.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
