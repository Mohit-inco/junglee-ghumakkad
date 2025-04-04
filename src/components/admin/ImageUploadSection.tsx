
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImagePreview from './ImagePreview';

interface ImageUploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  onClearPreview: () => void;
  isEditing: boolean;
  file: File | null;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onFileChange,
  previewUrl,
  onClearPreview,
  isEditing,
  file
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Image</FormLabel>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        {previewUrl && (
          <ImagePreview 
            previewUrl={previewUrl} 
            onClear={onClearPreview}
          />
        )}
        
        <div className="flex-1">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {isEditing && !file ? "Leave empty to keep the current image" : "Upload a high-quality image"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
