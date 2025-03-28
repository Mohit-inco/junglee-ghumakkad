
import React, { useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/lib/data';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Printer } from 'lucide-react';

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hidePrintOption?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  image, 
  onClose, 
  onNext, 
  onPrev,
  hidePrintOption = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && onNext) onNext();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
  }, [onClose, onNext, onPrev]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-10" onClick={handleClickOutside}>
      <div ref={modalRef} className="relative bg-transparent max-w-5xl w-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Navigation arrows */}
        {onPrev && (
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}
        
        {onNext && (
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
        
        {/* Image container */}
        <div className="w-full h-[70vh] overflow-hidden">
          <img 
            src={image.src} 
            alt={image.alt} 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Image info */}
        <div className="bg-background/90 backdrop-blur-sm p-6 mt-4 rounded-lg">
          <h2 className="text-2xl font-serif">{image.title}</h2>
          <p className="text-muted-foreground mt-2 mb-4">{image.description}</p>
          
          <div className="flex flex-wrap gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center mr-6">
              <MapPin className="h-4 w-4 mr-1 text-primary/70" />
              <span>{image.location}</span>
            </div>
            
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-1 text-primary/70" />
              <span>{image.date}</span>
            </div>
            
            {!hidePrintOption && (
              <div className="flex ml-auto">
                <Link 
                  to={`/print/${image.id}`}
                  className="flex items-center bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 rounded-md transition-colors"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  <span>Order Print</span>
                </Link>
              </div>
            )}
          </div>
          
          {image.photographerNote && (
            <div className="mt-4 text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-4">
              <p>{image.photographerNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
