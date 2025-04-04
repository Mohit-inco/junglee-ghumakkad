
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  previewUrl: string | null;
  onClear: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ previewUrl, onClear }) => {
  if (!previewUrl) return null;
  
  return (
    <div className="relative w-40 h-40">
      <img 
        src={previewUrl} 
        alt="Preview" 
        className="w-full h-full object-cover rounded-md"
      />
      <Button 
        type="button" 
        variant="destructive" 
        size="icon" 
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImagePreview;
