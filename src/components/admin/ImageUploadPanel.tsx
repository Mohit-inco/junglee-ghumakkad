import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Upload, Loader2 } from 'lucide-react';
import { getAvailableSections } from '@/integrations/supabase/api';
import { GalleryImage } from '@/integrations/supabase/api';
import PrintOptionsForm from './PrintOptionsForm';
import { Session } from '@supabase/supabase-js';
import ImageUploadSection from './ImageUploadSection';
import ImageFormFields from './ImageFormFields';
import ImageGallery from './ImageGallery';

interface ImageFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  photographers_note: string;
  enable_print: boolean;
  sections: string[];
  categories: string[];
  tags: string[];
}

interface Props {
  session: Session | null;
}

const ImageUploadPanel: React.FC<Props> = ({ session }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [availableSections] = useState<string[]>(getAvailableSections());
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  
  // Add a ref to the form card for scrolling
  const formCardRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<ImageFormData>({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      photographers_note: '',
      enable_print: false,
      sections: [],
      categories: [],
      tags: []
    }
  });
  
  useEffect(() => {
    fetchImages();
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
            enable_print: data.enable_print,
            sections: data.sections,
            categories: data.categories || [],
            tags: data.tags || [],
            ...(imageUrl && { image_url: imageUrl }),
            updated_at: new Date().toISOString()
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
            enable_print: data.enable_print,
            sections: data.sections,
            categories: data.categories || [],
            tags: data.tags || [],
            image_url: imageUrl
          });
          
        if (error) throw error;
        toast.success('Image uploaded successfully');
      }
      
      // Reset form and state
      resetForm();
      fetchImages();
      
      // Show print options form if enabled
      if (data.enable_print && selectedImage) {
        setShowPrintOptions(true);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Detailed error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Scroll to form function
  const scrollToForm = () => {
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsEditing(true);
    
    // Populate form with image data
    form.reset({
      title: image.title,
      description: image.description || '',
      location: image.location || '',
      date: image.date ? new Date(image.date).toISOString().split('T')[0] : '',
      photographers_note: image.photographers_note || '',
      enable_print: image.enable_print || false,
      sections: image.sections || [],
      categories: image.categories || [],
      tags: image.tags || []
    });
    
    // Set preview URL if available
    if (image.image_url) {
      setPreviewUrl(image.image_url);
    }
    
    // Scroll to the form after a short delay to ensure state is updated
    setTimeout(() => {
      scrollToForm();
    }, 100);
  };

  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      photographers_note: '',
      enable_print: false,
      sections: [],
      categories: [],
      tags: []
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

  const handleManagePrints = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowPrintOptions(true);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full" ref={formCardRef}>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Image' : 'Upload New Image'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update image details and settings' : 'Add a new image to your gallery with details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              />
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditing ? 'Updating...' : 'Uploading...'}</>
                  ) : (
                    <><Upload className="mr-2 h-4 w-4" /> {isEditing ? 'Update Image' : 'Upload Image'}</>
                  )}
                </Button>
                
                {isEditing && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Print Options Dialog */}
      {showPrintOptions && selectedImage && (
        <PrintOptionsForm 
          imageId={selectedImage.id} 
          onClose={() => setShowPrintOptions(false)}
        />
      )}
      
      {/* Existing Images */}
      <ImageGallery 
        images={images} 
        onEditImage={handleEditImage}
        onManagePrints={handleManagePrints}
      />
    </div>
  );
};

export default ImageUploadPanel;
