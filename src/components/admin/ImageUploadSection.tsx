
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImagePreview from './ImagePreview';

interface ImageUploadSectionProps {
  setImageFile: (file: File | null) => void;
  setImagePreview: (url: string | null) => void;
  imagePreview: string | null;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  setImageFile,
  setImagePreview,
  imagePreview
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleClearPreview = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Image</FormLabel>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        {imagePreview && (
          <ImagePreview 
            previewUrl={imagePreview} 
            onClear={handleClearPreview}
          />
        )}
        
        <div className="flex-1">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Upload a high-quality image
          </p>
        </div>
      </div>
    </div>
  );
};
