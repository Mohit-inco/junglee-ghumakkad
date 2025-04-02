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

  // Fetch gallery images
  const { data: galleryImages = [], isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: fetchGalleryImages
  });

  // Mutations for CRUD operations
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
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  });

  // File upload handler
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
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Form submission handler
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
      } else {
        await createMutation.mutateAsync(imageData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to open the edit dialog
  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setTitle(image.title);
    setDescription(image.description);
    setPhotographerNote(image.photographer_note);
    setLocation(image.location);
    setDate(image.date);
    setImageUrl(image.image_url);
    setAlt(image.alt);
    setCategories(image.categories);
    setIsDialogOpen(true);
  };

  // Handler to open the add new dialog
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
    setIsDialogOpen(true);
  };

  // Handler to delete an image
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate(id);
    }
  };

  // Category management functions
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  // Function to close the dialog and reset the form
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
  };

  // Fetch print options for associating with images
  const { data: printOptions = [], isLoading: printOptionsLoading } = useQuery({
    queryKey: ['printOptions'],
    queryFn: fetchPrintOptions
  });

  const handleManagePrintOptions = async (imageId: string, selectedPrintOptions: string[]) => {
    try {
      // First, remove existing print options for this image
      await removeImagePrintOptions(imageId);

      // Then add the new selected print options
      const printOptionMappings = selectedPrintOptions.map(printOptionId => ({
        image_id: imageId,
        print_option_id: printOptionId
      }));

      await addImagePrintOptions(printOptionMappings);

      toast({
        title: "Print Options Updated",
        description: "Print options for the image have been successfully updated."
      });

      // Refresh the gallery images to reflect the changes
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update print options",
        variant: "destructive"
      });
    }
  };

  // In the existing image edit dialog, add a section for managing print options
  const renderPrintOptionsSection = (imageId: string) => {
    const [selectedPrintOptions, setSelectedPrintOptions] = useState<string[]>([]);

    useEffect(() => {
      const fetchInitialPrintOptions = async () => {
        if (!imageId) return;
  
        try {
          const { data, error } = await supabase
            .from('image_print_options')
            .select('print_option_id')
            .eq('image_id', imageId);
  
          if (error) {
            console.error("Error fetching initial print options:", error);
            return;
          }
  
          const initialOptions = data?.map(item => item.print_option_id) || [];
          setSelectedPrintOptions(initialOptions);
        } catch (error) {
          console.error("Error fetching initial print options:", error);
        }
      };
  
      fetchInitialPrintOptions();
    }, [imageId, supabase]);

    return (
      <div className="mt-4">
        <Label>Available Print Options</Label>
        <div className="flex flex-col space-y-2">
          {printOptionsLoading ? (
            <div>Loading print options...</div>
          ) : (
            <Select 
              multiple 
              value={selectedPrintOptions}
              onValueChange={setSelectedPrintOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select print options" />
              </SelectTrigger>
              <SelectContent>
                {printOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.size} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(option.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button 
            size="sm" 
            onClick={() => handleManagePrintOptions(imageId, selectedPrintOptions)}
            disabled={printOptionsLoading}
          >
            Save Print Options
          </Button>
        </div>
      </div>
    );
  };

  // Update the dialog content to include print options management
  const renderEditDialog = () => (
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
                <Input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
                <Label htmlFor="imageUpload" className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 py-2 text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Upload'}
                </Label>
              </div>
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
          </div>
          
          {editingImage && renderPrintOptionsSection(editingImage.id)}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
  );

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
      {renderEditDialog()}
    </div>
  );
};

export default AdminGallery;
