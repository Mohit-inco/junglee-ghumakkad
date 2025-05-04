import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Upload, Loader2, Plus, PencilLine } from 'lucide-react';
import { getAvailableSections } from '@/integrations/supabase/api';
import { GalleryImage } from '@/integrations/supabase/api';
import { Session } from '@supabase/supabase-js';
import ImageUploadSection from './ImageUploadSection';
import ImageFormFields from './ImageFormFields';
import ImageGallery from './ImageGallery';
import PrintOptions from './PrintOptions';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

interface ImageFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  photographers_note: string;
  sections: string[];
  categories: string[];
  genres: string[];
  enable_print: boolean;
}

interface Props {
  session: Session | null;
}

const ImageUploadPanel: React.FC<Props> = ({ session }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [availableSections] = useState<string[]>(getAvailableSections());
  const [availableCategories, setAvailableCategories] = useState<string[]>(['wildlife', 'landscape', 'portrait', 'street', 'astro', 'macro']);
  const [availableGenres, setAvailableGenres] = useState<string[]>(['Wildlife', 'StreetPalette', 'AstroShot', 'Landscape']);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [selectedPrintImage, setSelectedPrintImage] = useState<GalleryImage | null>(null);
  
  const form = useForm<ImageFormData>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      photographers_note: '',
      sections: [],
      categories: [],
      genres: [],
      enable_print: false,
    }
  });
  
  useEffect(() => {
    fetchImages();
    // Fetch all unique categories and genres from existing images
    fetchCategoriesAndGenres();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast.error(`Error fetching images: ${error.message}`);
    }
  };

  const fetchCategoriesAndGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('categories, genres');

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Extract all categories from all images and flatten the array
        const allCategories = data
          .map(item => item.categories || [])
          .flat()
          .filter(Boolean);
        
        // Remove duplicates
        const uniqueCategories = [...new Set(allCategories)];
        
        // Merge with default categories
        const defaultCategories = ['wildlife', 'landscape', 'portrait', 'street', 'astro', 'macro'];
        const mergedCategories = [...new Set([...defaultCategories, ...uniqueCategories])];
        
        setAvailableCategories(mergedCategories);
        
        // Extract all genres from all images and flatten the array
        const allGenres = data
          .map(item => item.genres || [])
          .flat()
          .filter(Boolean);
        
        // Remove duplicates and merge with default genres
        if (allGenres.length > 0) {
          const defaultGenres = ['Wildlife', 'StreetPalette', 'AstroShot', 'Landscape'];
          const mergedGenres = [...new Set([...defaultGenres, ...allGenres])];
          
          setAvailableGenres(mergedGenres);
        }
      }
    } catch (error: any) {
      console.error('Error fetching categories and genres:', error);
      // Keep the default categories and genres if there's an error
    }
  };

  const handleAddCategory = (category: string) => {
    setAvailableCategories(prev => [...prev, category]);
  };
  
  const handleAddGenre = (genre: string) => {
    setAvailableGenres(prev => [...prev, genre]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const openNewImageForm = () => {
    // Reset form and state first
    resetForm();
    setIsEditing(false);
    
    // Then open the form sheet with a slight delay
    setTimeout(() => {
      setIsFormSheetOpen(true);
    }, 50);
  };

  const onSubmit = async (data: ImageFormData) => {
    if (!file && !isEditing) {
      toast.error('Please select an image to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      let imageUrl = selectedImage?.image_url || '';
      
      // If we have a new file, upload it to Supabase storage
      if (file) {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      if (isEditing && selectedImage) {
        // Update existing image
        const { error } = await supabase
          .from('gallery_images')
          .update({
            title: data.title,
            description: data.description,
            location: data.location,
            date: data.date,
            photographers_note: data.photographers_note,
            sections: data.sections,
            categories: data.categories || [],
            genres: data.genres || [],
            enable_print: data.enable_print,
            updated_at: new Date().toISOString(),
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq('id', selectedImage.id);
          
        if (error) throw error;
        toast.success('Image updated successfully');
      } else {
        // Insert new image
        const { error } = await supabase
          .from('gallery_images')
          .insert({
            title: data.title,
            description: data.description,
            location: data.location,
            date: data.date,
            photographers_note: data.photographers_note,
            sections: data.sections,
            categories: data.categories || [],
            genres: data.genres || [],
            enable_print: data.enable_print,
            image_url: imageUrl
          });
          
        if (error) throw error;
        toast.success('Image uploaded successfully');
      }
      
      // Reset form and state
      resetForm();
      setIsFormSheetOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Detailed error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    // First set all the state
    setSelectedImage(image);
    setIsEditing(true);
    
    // Populate form with image data
    form.reset({
      title: image.title,
      description: image.description || '',
      location: image.location || '',
      date: image.date ? new Date(image.date).toISOString().split('T')[0] : '',
      photographers_note: image.photographers_note || '',
      sections: image.sections || [],
      categories: image.categories || [],
      genres: image.genres || [],
      enable_print: image.enable_print || false,
    });
    
    // Set preview URL if available
    if (image.image_url) {
      setPreviewUrl(image.image_url);
    }
    
    // Open the form sheet with a slight delay to ensure state is updated
    setTimeout(() => {
      setIsFormSheetOpen(true);
    }, 50);
  };

  const handleManagePrints = (image: GalleryImage) => {
    setSelectedPrintImage(image);
    setIsPrintSheetOpen(true);
  };

  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      photographers_note: '',
      sections: [],
      categories: [],
      genres: [],
      enable_print: false,
    });
    setFile(null);
    setPreviewUrl(null);
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleClearPreview = () => {
    setPreviewUrl(null);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Action buttons at the top */}
      <div className="flex justify-end">
        <Button 
          onClick={openNewImageForm}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> 
          Upload New Image
        </Button>
      </div>

      {/* Form Sheet Panel */}
      <Sheet open={isFormSheetOpen} onOpenChange={(open) => {
        setIsFormSheetOpen(open);
        if (!open) {
          // Reset form when sheet is closed
          resetForm();
        }
      }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>{isEditing ? 'Edit Image' : 'Upload New Image'}</SheetTitle>
            <SheetDescription>
              {isEditing ? 'Update image details and settings' : 'Add a new image to your gallery with details'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <ImageUploadSection
                onFileChange={handleFileChange}
                previewUrl={previewUrl}
                onClearPreview={handleClearPreview}
                isEditing={isEditing}
                file={file}
              />
              
              {/* Form Fields */}
              <ImageFormFields 
                form={form} 
                availableSections={availableSections} 
                availableCategories={availableCategories}
                availableGenres={availableGenres}
                onAddCategory={handleAddCategory}
                onAddGenre={handleAddGenre}
              />
              
              <SheetFooter className="pt-4 gap-4">
                <Button 
                  type="submit" 
                  disabled={uploading}
                >
                  {uploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditing ? 'Updating...' : 'Uploading...'}</>
                  ) : (
                    <>{isEditing ? <PencilLine className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />} {isEditing ? 'Update Image' : 'Upload Image'}</>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormSheetOpen(false)}
                >
                  Cancel
                </Button>
              </SheetFooter>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Print Options Side Panel */}
      <Sheet open={isPrintSheetOpen} onOpenChange={setIsPrintSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Manage Print Options</SheetTitle>
            <SheetDescription>
              {selectedPrintImage ? `Configure print options for "${selectedPrintImage.title}"` : 'Configure print options'}
            </SheetDescription>
          </SheetHeader>
          
          {selectedPrintImage && (
            <div className="mt-6">
              <PrintOptions imageId={selectedPrintImage.id} />
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Main content: Gallery of existing images */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
          <CardDescription>
            Manage your existing gallery images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery 
            images={images} 
            onEditImage={handleEditImage}
            onManagePrints={handleManagePrints}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadPanel;
