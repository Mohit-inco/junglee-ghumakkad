import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash, Save } from 'lucide-react';
import { useSupabaseClient } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchGalleryImages, 
  createGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage, 
  uploadImage, 
  fetchPrintOptions,
  addImagePrintOptions,
  removeImagePrintOptions
} from '@/lib/supabase';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  photographer_note: string;
  location: string;
  date: string;
  image_url: string;
  alt: string;
  categories: string[];
  created_at: string;
}

const AdminGallery = () => {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photographerNote, setPhotographerNote] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPrintOptions, setSelectedPrintOptions] = useState<string[]>([]);

  const { data: galleryImages = [], isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: fetchGalleryImages
  });

  const createMutation = useMutation({
    mutationFn: createGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Image added",
        description: "New image has been added to the gallery.",
      });
      closeDialog();
    },
    onError: (error: any) => {
      console.error("Create image error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add image",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<GalleryImage>) => updateGalleryImage(editingImage!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Image updated",
        description: "Image details have been updated.",
      });
      closeDialog();
    },
    onError: (error: any) => {
      console.error("Update image error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update image",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Image deleted",
        description: "Image has been removed from the gallery.",
      });
    },
    onError: (error: any) => {
      console.error("Delete image error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'gallery');
      setImageUrl(imageUrl);
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imageData = {
      title,
      description,
      photographer_note: photographerNote,
      location,
      date,
      image_url: imageUrl,
      alt,
      categories,
    };

    try {
      if (editingImage) {
        await updateMutation.mutateAsync(imageData);
        if (selectedPrintOptions.length > 0) {
          await handleManagePrintOptions(editingImage.id, selectedPrintOptions);
        }
      } else {
        const result = await createMutation.mutateAsync(imageData);
        
        if (result && result[0] && result[0].id && selectedPrintOptions.length > 0) {
          await handleManagePrintOptions(result[0].id, selectedPrintOptions);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setTitle(image.title);
    setDescription(image.description || '');
    setPhotographerNote(image.photographer_note || '');
    setLocation(image.location || '');
    setDate(image.date || '');
    setImageUrl(image.image_url);
    setAlt(image.alt || '');
    setCategories(image.categories || []);
    
    fetchImagePrintOptionsForImage(image.id);
    
    setIsDialogOpen(true);
  };

  const fetchImagePrintOptionsForImage = async (imageId: string) => {
    try {
      const { data, error } = await supabase
        .from('image_print_options')
        .select('print_option_id')
        .eq('image_id', imageId);

      if (error) {
        console.error("Error fetching print options:", error);
        return;
      }

      const options = data?.map(item => item.print_option_id) || [];
      setSelectedPrintOptions(options);
    } catch (error) {
      console.error("Error in fetchImagePrintOptionsForImage:", error);
    }
  };

  const handleAddNew = () => {
    setEditingImage(null);
    setTitle('');
    setDescription('');
    setPhotographerNote('');
    setLocation('');
    setDate('');
    setImageUrl('');
    setAlt('');
    setCategories([]);
    setSelectedPrintOptions([]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate(id);
    }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingImage(null);
    setTitle('');
    setDescription('');
    setPhotographerNote('');
    setLocation('');
    setDate('');
    setImageUrl('');
    setAlt('');
    setCategories([]);
    setSelectedPrintOptions([]);
  };

  const { data: printOptions = [], isLoading: printOptionsLoading } = useQuery({
    queryKey: ['printOptions'],
    queryFn: fetchPrintOptions
  });

  const handleManagePrintOptions = async (imageId: string, selectedOptions: string[]) => {
    try {
      await removeImagePrintOptions(imageId);

      if (selectedOptions.length > 0) {
        const printOptionMappings = selectedOptions.map(printOptionId => ({
          image_id: imageId,
          print_option_id: printOptionId
        }));

        await addImagePrintOptions(printOptionMappings);
      }

      toast({
        title: "Print Options Updated",
        description: "Print options for the image have been successfully updated."
      });

      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    } catch (error: any) {
      console.error("Error managing print options:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update print options",
        variant: "destructive"
      });
    }
  };

  const handlePrintOptionChange = (printOptionId: string) => {
    if (selectedPrintOptions.includes(printOptionId)) {
      setSelectedPrintOptions(selectedPrintOptions.filter(id => id !== printOptionId));
    } else {
      setSelectedPrintOptions([...selectedPrintOptions, printOptionId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gallery Images</h2>
          <p className="text-muted-foreground">Manage images on the gallery page</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Image
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryImages.map((image) => (
              <TableRow key={image.id}>
                <TableCell>{image.title}</TableCell>
                <TableCell>{image.location}</TableCell>
                <TableCell>{image.date}</TableCell>
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
            {galleryImages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No images found. Add your first image.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            <DialogDescription>
              {editingImage 
                ? 'Update the details of your existing image.' 
                : 'Add a new image to your gallery.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Image Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Image Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="photographerNote">Photographer's Note</Label>
                <Input
                  id="photographerNote"
                  placeholder="Note for the photographer"
                  value={photographerNote}
                  onChange={(e) => setPhotographerNote(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Image Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="imageUrl"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={uploading}
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      disabled={uploading}
                      className="relative z-10"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
                {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading image...</p>}
              </div>

              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  placeholder="Alt Text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>

              <div>
                <Label>Categories</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button type="button" size="sm" onClick={addCategory}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="secondary"
                      size="sm"
                      onClick={() => removeCategory(category)}
                    >
                      {category} <Trash className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Available Print Options</Label>
                <div className="flex flex-col space-y-2 mt-2">
                  {printOptionsLoading ? (
                    <div>Loading print options...</div>
                  ) : (
                    <div className="space-y-2">
                      {printOptions.map(option => (
                        <div className="flex items-center gap-2" key={option.id}>
                          <input 
                            type="checkbox" 
                            id={`print-option-${option.id}`}
                            checked={selectedPrintOptions.includes(option.id)}
                            onChange={() => handlePrintOptionChange(option.id)}
                            className="w-4 h-4"
                          />
                          <label htmlFor={`print-option-${option.id}`} className="text-sm">
                            {option.size} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(option.price)}
                            {!option.in_stock && ' (Out of Stock)'}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> 
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
