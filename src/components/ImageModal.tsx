
import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Image, getImageSrc } from '@/lib/data';

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
  const [showInfo, setShowInfo] = React.useState(false);

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
  
  return (
    <div className="blur-backdrop" onClick={handleBackdropClick}>
      <div className="image-modal">
        <div ref={modalRef} className="image-modal-content">
          <div className="relative h-full">
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button className="p-1.5 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" onClick={() => setShowInfo(!showInfo)} aria-label="Toggle information">
                <Info className="h-5 w-5" />
              </button>
              <button className="p-1.5 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" onClick={onClose} aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-center h-full">
              <img 
                src={getImageSrc(image.src)} 
                alt={image.alt} 
                className="max-h-full max-w-full object-contain shadow-xl shadow-black/30 rounded" 
              />
            </div>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }} 
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }} 
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image info panel */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 text-white p-6 transform transition-transform duration-300 ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}>
              <h2 className="text-xl font-medium mb-2">{image.title}</h2>
              <p className="text-white/80 mb-3">{image.description}</p>
              
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-white/70">
                <div>
                  <span className="font-medium block text-white">Location</span>
                  <span>{image.location}</span>
                </div>
                <div>
                  <span className="font-medium block text-white">Date</span>
                  <span>{image.date}</span>
                </div>
                {image.photographerNote && <div className="w-full mt-1">
                    <span className="font-medium block text-white">Photographer's Note</span>
                    <span className="text-white/80 italic">{image.photographerNote}</span>
                  </div>}
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
                <div className="flex gap-2">
                  {image.categories.map((category, index) => <span key={index} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                      {category}
                    </span>)}
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
