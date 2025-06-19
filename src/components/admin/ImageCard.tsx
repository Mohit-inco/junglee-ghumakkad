
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GalleryImage } from '@/integrations/supabase/api';
import { Edit, Printer, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ImageCardProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onManagePrints?: (image: GalleryImage) => void;
  onDelete?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  onEdit, 
  onManagePrints,
  onDelete 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // First delete associated print options
      const { error: printOptionsError } = await supabase
        .from('print_options')
        .delete()
        .eq('image_id', image.id);

      if (printOptionsError) {
        console.error('Error deleting print options:', printOptionsError);
      }

      // Then delete the gallery image
      const { error: imageError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (imageError) throw imageError;

      // If image is stored in Supabase storage, attempt to delete it
      if (image.image_url && image.image_url.includes('supabase.co/storage')) {
        try {
          const urlObj = new URL(image.image_url);
          const path = urlObj.pathname.split('/storage/v1/object/public/images/')[1];
          
          if (path) {
            const { error: storageError } = await supabase.storage
              .from('images')
              .remove([path]);
              
            if (storageError) {
              console.warn('Could not delete image from storage:', storageError);
            }
          }
        } catch (storageError) {
          console.warn('Could not delete image from storage:', storageError);
        }
      }

      toast.success('Image deleted successfully');
      onDelete?.();
    } catch (error: any) {
      toast.error(`Error deleting image: ${error.message}`);
      console.error('Error deleting image:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={image.image_url} 
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm line-clamp-2">{image.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {image.sections?.map(section => (
            <span key={section} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {section}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(image)}
            className="flex items-center gap-1"
          >
            <Edit size={14} />
            Edit
          </Button>
          
          {onManagePrints && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onManagePrints(image)}
              className="flex items-center gap-1"
            >
              <Printer size={14} />
              Prints
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                disabled={isDeleting}
                className="flex items-center gap-1"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the image 
                  "{image.title}" and all its associated data including print options.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
