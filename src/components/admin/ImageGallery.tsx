
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GalleryImage } from '@/integrations/supabase/api';
import { ImageCard } from './ImageCard';

interface ImageGalleryProps {
  images: GalleryImage[];
  onEditImage: (image: GalleryImage) => void;
  onManagePrints?: (image: GalleryImage) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  onEditImage,
  onManagePrints 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Images</CardTitle>
        <CardDescription>Edit or delete existing images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <ImageCard 
              key={image.id}
              image={image} 
              onEdit={onEditImage}
              onManagePrints={onManagePrints}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGallery;
