
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GalleryImage } from '@/integrations/supabase/api';

interface ImageCardProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate thumbnail URL by adding query parameters for resizing
  // This assumes your image hosting supports query parameters for resizing
  // Common parameters for CDNs like Cloudinary, Imgix, or Supabase Storage
  const getThumbnailUrl = (url: string) => {
    // Check if URL already has query parameters
    const separator = url.includes('?') ? '&' : '?';
    
    // For Supabase Storage, you might use width and height parameters
    // Adjust the parameters based on your image hosting provider
    return `${url}${separator}width=300&quality=60`;
  };

  return (
    <Card key={image.id} className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {/* Low-quality placeholder that loads immediately */}
        <div 
          className={`w-full h-full absolute inset-0 bg-center bg-cover blur-sm transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: `url(${getThumbnailUrl(image.image_url)})`, backgroundSize: 'cover' }}
        />
        
        {/* Actual image with proper loading */}
        <img 
          src={getThumbnailUrl(image.image_url)} 
          alt={image.title} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{image.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{image.description}</p>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {image.sections?.map((section) => (
            <span 
              key={section} 
              className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5"
            >
              {section}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(image)}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};
