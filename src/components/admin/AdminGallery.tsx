import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Image, Save } from 'lucide-react';
import { fetchGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage, uploadImage, GalleryImage, PrintOption } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useSupabaseClient } from '@/lib/supabase';

const AdminGallery = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    photographer_note: '',
    location: '',
    date: '',
    image_url: '',
    alt: '',
    categories: '',
    available_as_print: false,
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [printSizes, setPrintSizes] = useState<PrintOption[]>([]);
  const [selectedPrintOptions, setSelectedPrintOptions] = useState<string[]>([]);
  
  // Query to fetch gallery images
  const { data: galleryItems = [], isLoading: imagesLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: fetchGalleryImages
  });
  
  // Query to fetch print options for the integration
  const { data: availablePrintOptions = [], isLoading: printOptionsLoading } = useQuery({
    queryKey: ['printOptions'],
    queryFn: async () => {
      const { data, error } = await useSupabaseClient()
        .from('print_options')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  // Mutation to delete an image
  const deleteImageMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Image deleted",
        description: "The image has been removed from the gallery.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
    setFormData({ ...formData, alt: file.name.split('.')[0] });
  };
  
  const handleEdit = async (image: GalleryImage) => {
    setFormData({
      id: image.id,
      title: image.title,
      description: image.description,
      photographer_note: image.photographer_note,
      location: image.location,
      date: image.date,
      image_url: image.image_url,
      alt: image.alt,
      categories: image.categories.join(', '),
      available_as_print: false, // Will be updated by loadImagePrintOptions
    });
    setEditingItemId(image.id);
    setImagePreview(image.image_url);
    setImageFile(null);
    
    // Load print options for this image
    await loadImagePrintOptions(image.id);
    
    setIsDialogOpen(true);
  };
  
  const handleNewImage = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      photographer_note: '',
      location: '',
      date: '',
      image_url: '',
      alt: '',
      categories: '',
      available_as_print: false,
    });
    setEditingItemId(null);
    setImagePreview(null);
    setImageFile(null);
    setSelectedPrintOptions([]);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert categories string to array
      const categoriesArray = formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat);
      
      // Upload image if there's a new file
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'gallery');
      }
      
      // Prepare the data
      const imageData = {
        title: formData.title,
        description: formData.description,
        photographer_note: formData.photographer_note,
        location: formData.location,
        date: formData.date,
        image_url: imageUrl,
        alt: formData.alt,
        categories: categoriesArray,
      };
      
      if (editingItemId) {
        // Update existing item
        updateImageMutation.mutate({ id: editingItemId, data: imageData });
      } else {
        // Add new item
        createImageMutation.mutate({...imageData, print_options: formData.available_as_print ? selectedPrintOptions : []} as any);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error processing your request",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteImageMutation.mutate(id);
    }
  };

  const handlePrintOptionToggle = (printId: string) => {
    setSelectedPrintOptions(prevSelected => {
      if (prevSelected.includes(printId)) {
        return prevSelected.filter(id => id !== printId);
      } else {
        return [...prevSelected, printId];
      }
    });
  };
  
  const createImageMutation = useMutation({
    mutationFn: async (data: Omit<GalleryImage, 'id' | 'created_at'> & { print_options?: string[] }) => {
      // First create the gallery image
      const newImage = await createGalleryImage(data);
      
      // If available as print and print options selected, associate them
      if (formData.available_as_print && selectedPrintOptions.length > 0 && newImage && newImage[0]) {
        const imageId = newImage[0].id;
        
        // Associate selected print options with the image
        const { error } = await useSupabaseClient()
          .from('image_print_options')
          .insert(
            selectedPrintOptions.map(printId => ({
              image_id: imageId,
              print_option_id: printId
            }))
          );
          
        if (error) throw error;
      }
      
      return newImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Image added",
        description: `"${formData.title}" has been added to the gallery.`,
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add image",
        variant: "destructive",
      });
    }
  });
  
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Omit<GalleryImage, 'id' | 'created_at'>> }) => {
      // First update the gallery image
      const updatedImage = await updateGalleryImage(id, data);
      
      // Update print options associations
      if (updatedImage) {
        // Delete existing associations
        const { error: deleteError } = await useSupabaseClient()
          .from('image_print_options')
          .delete()
          .eq('image_id', id);
          
        if (deleteError) throw deleteError;
        
        // If available as print and options selected, create new associations
        if (formData.available_as_print && selectedPrintOptions.length > 0) {
          const { error } = await useSupabaseClient()
            .from('image_print_options')
            .insert(
              selectedPrintOptions.map(printId => ({
                image_id: id,
                print_option_id: printId
              }))
            );
            
          if (error) throw error;
        }
      }
      
      return updatedImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Image updated",
        description: `"${formData.title}" has been updated successfully.`,
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update image",
        variant: "destructive",
      });
    }
  });
  
  const loadImagePrintOptions = async (imageId: string) => {
    try {
      const { data, error } = await useSupabaseClient()
        .from('image_print_options')
        .select('print_option_id')
        .eq('image_id', imageId);
        
      if (error) throw error;
      
      if (data) {
        setSelectedPrintOptions(data.map(item => item.print_option_id));
        setFormData(prev => ({ ...prev, available_as_print: data.length > 0 }));
      }
    } catch (error) {
      console.error("Error loading print options:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gallery Management</h2>
          <p className="text-muted-foreground">Add, edit, or remove images from your gallery.</p>
        </div>
        <Button onClick={handleNewImage}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>
      
      {imagesLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Categories</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryItems.map((image: GalleryImage) => (
              <TableRow key={image.id}>
                <TableCell>
                  <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt={image.alt} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }} 
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{image.title}</TableCell>
                <TableCell className="hidden md:table-cell">{image.location}</TableCell>
                <TableCell className="hidden md:table-cell">{image.categories.join(", ")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(image)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(image.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {galleryItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No images found. Add your first image.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            <DialogDescription>
              {editingItemId 
                ? 'Make changes to the image details below.' 
                : 'Fill in the image details to add it to your gallery.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="imageUpload">Image</Label>
                <div className="mt-1 flex items-center space-x-4">
                  {imagePreview && (
                    <div className="h-24 w-24 bg-muted rounded overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended size: 1920x1080px or larger
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Image title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="March 2024"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the image"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="photographer_note">Photographer's Note</Label>
                <Textarea 
                  id="photographer_note"
                  name="photographer_note"
                  value={formData.photographer_note}
                  onChange={handleInputChange}
                  placeholder="Your personal note about taking this photograph"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Where was this photo taken?"
                />
              </div>
              
              <div>
                <Label htmlFor="categories">Categories</Label>
                <Input 
                  id="categories"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  placeholder="Birds, Wildlife, Water (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate categories with commas
                </p>
              </div>
              
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input 
                  id="alt"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  placeholder="Alternative text for accessibility"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Describe the image for screen readers and SEO
                </p>
              </div>
            </div>
            
            {/* Print options section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="available_as_print"
                  checked={formData.available_as_print}
                  onCheckedChange={(checked) => setFormData({...formData, available_as_print: checked})}
                />
                <Label htmlFor="available_as_print">Available as print</Label>
              </div>
              
              {formData.available_as_print && (
                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="font-medium">Select available print sizes:</h4>
                  
                  {printOptionsLoading ? (
                    <div className="py-4 text-center">Loading print options...</div>
                  ) : availablePrintOptions.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">
                      No print options available. Please add them in the Prints tab first.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availablePrintOptions.map((option: PrintOption) => (
                        <div key={option.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`print-${option.id}`}
                            checked={selectedPrintOptions.includes(option.id)}
                            onCheckedChange={() => handlePrintOptionToggle(option.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={`print-${option.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {option.size}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              ${option.price.toFixed(2)} {option.in_stock ? '(In Stock)' : '(Out of Stock)'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createImageMutation.isPending || updateImageMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {createImageMutation.isPending || updateImageMutation.isPending ? 'Saving...' : 
                  editingItemId ? 'Save Changes' : 'Add Image'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
