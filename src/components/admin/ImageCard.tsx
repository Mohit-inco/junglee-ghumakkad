
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GalleryImage } from '@/integrations/supabase/api';

interface ImageCardProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onManagePrints: (image: GalleryImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onEdit, onManagePrints }) => {
  return (
    <Card key={image.id} className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image.image_url} 
          alt={image.title} 
          className="w-full h-full object-cover"
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
        
        {image.enable_print && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => onManagePrints(image)}
          >
            Print Options
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
