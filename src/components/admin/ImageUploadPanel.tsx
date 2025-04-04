
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { ChevronDown, ImagePlus, Upload, Loader2, X } from 'lucide-react';
import { getAvailableSections } from '@/integrations/supabase/api';
import { GalleryImage } from '@/integrations/supabase/api';
import PrintOptionsForm from './PrintOptionsForm';
import { Session } from '@supabase/supabase-js';

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

  return (
    <div className="space-y-6">
      <Card className="w-full">
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
              <div className="space-y-2">
                <FormLabel>Image</FormLabel>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  {previewUrl && (
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
                        onClick={() => {
                          setPreviewUrl(null);
                          setFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
                      {isEditing && !file ? "Leave empty to keep the current image" : "Upload a high-quality image"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter image description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where was this photo taken?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Taken</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Photographer's Note */}
              <FormField
                control={form.control}
                name="photographers_note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photographer's Note</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any special notes about this image?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Categories */}
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value.length > 0 
                            ? `${field.value.length} categories selected` 
                            : "Select categories"}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {['wildlife', 'landscape', 'portrait', 'street', 'astro', 'macro'].map((category) => (
                          <DropdownMenuCheckboxItem
                            key={category}
                            checked={field.value.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, category]);
                              } else {
                                field.onChange(field.value.filter((val) => val !== category));
                              }
                            }}
                          >
                            {category}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormDescription>
                      Select one or more categories for this image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Sections */}
              <FormField
                control={form.control}
                name="sections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Sections</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {field.value.length > 0 
                            ? `${field.value.length} sections selected` 
                            : "Select sections"}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {availableSections.map((section) => (
                          <DropdownMenuCheckboxItem
                            key={section}
                            checked={field.value.includes(section)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, section]);
                              } else {
                                field.onChange(field.value.filter((val) => val !== section));
                              }
                            }}
                          >
                            {section}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormDescription>
                      Choose which sections this image should appear in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tags separated by commas" 
                        value={field.value?.join(', ') || ''} 
                        onChange={(e) => {
                          const value = e.target.value;
                          const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                          field.onChange(tags);
                        }}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Add relevant tags to help with searching and filtering
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Enable Print */}
              <FormField
                control={form.control}
                name="enable_print"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available for Print</FormLabel>
                      <FormDescription>
                        Make this image available for purchase as a print
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
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
      <Card>
        <CardHeader>
          <CardTitle>Manage Images</CardTitle>
          <CardDescription>Edit or delete existing images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
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
                    onClick={() => handleEditImage(image)}
                  >
                    Edit
                  </Button>
                  
                  {image.enable_print && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedImage(image);
                        setShowPrintOptions(true);
                      }}
                    >
                      Print Options
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadPanel;
