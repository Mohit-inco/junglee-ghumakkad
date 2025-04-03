import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { X, Upload, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { BlogImage } from '@/integrations/supabase/api';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface BlogImageUploaderProps {
  blogId: string;
  onClose: () => void;
}

interface ImageFormData {
  caption: string;
  display_order: number;
}

const BlogImageUploader: React.FC<BlogImageUploaderProps> = ({ blogId, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const form = useForm<ImageFormData>({
    defaultValues: {
      caption: '',
      display_order: 0
    }
  });

  useEffect(() => {
    fetchImages();
  }, [blogId]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_images')
        .select('*')
        .eq('blog_id', blogId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast.error(`Error fetching blog images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview(null);
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const uploadImage = async (data: ImageFormData) => {
    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      const imageUrl = urlData.publicUrl;
      
      // Get the highest display order
      const highestOrder = images.length > 0 
        ? Math.max(...images.map(img => img.display_order || 0)) + 1 
        : 0;
      
      // Save to the database
      const { error } = await supabase
        .from('blog_images')
        .insert({
          blog_id: blogId,
          caption: data.caption,
          image_url: imageUrl,
          display_order: highestOrder
        });
        
      if (error) throw error;
      
      toast.success('Image uploaded successfully');
      
      // Reset form and fetch updated images
      form.reset({
        caption: '',
        display_order: 0
      });
      setFile(null);
      setPreview(null);
      fetchImages();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_images')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the local state immediately for a responsive UI
    setImages(items);
    
    // Update display order in the database
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index
      }));
      
      // Update each image with its new display_order
      for (const update of updates) {
        const { error } = await supabase
          .from('blog_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      toast.success('Image order updated');
    } catch (error: any) {
      toast.error(`Error updating image order: ${error.message}`);
      // Revert to the original order by re-fetching
      fetchImages();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Blog Images</CardTitle>
          <CardDescription>Upload and arrange images for this blog post</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(uploadImage)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Upload New Image</FormLabel>
              <div className="flex flex-col md:flex-row gap-4">
                {preview && (
                  <div className="relative w-40 h-40">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        setPreview(null);
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
                    className="mb-2"
                  />
                  
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a caption for this image (optional)" 
                            {...field}
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={uploading || !file}
            >
              {uploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Upload Image</>
              )}
            </Button>
          </form>
        </Form>
        
        {/* Existing Images */}
        <div>
          <h3 className="text-lg font-medium mb-2">Blog Images</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop to rearrange images. They will appear in this order in the blog post.
          </p>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blog-images">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {images.map((image, index) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center border rounded-lg p-2 bg-background"
                          >
                            <div 
                              {...provided.dragHandleProps}
                              className="px-2 cursor-move"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            
                            <div className="h-16 w-16 mr-3">
                              <img 
                                src={image.image_url} 
                                alt={image.caption || 'Blog image'} 
                                className="h-full w-full object-cover rounded"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm line-clamp-2">
                                {image.caption || 'No caption'}
                              </p>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => deleteImage(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              No images added to this blog post yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogImageUploader;
