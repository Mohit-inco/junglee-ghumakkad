
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ImageGrid from '@/components/ImageGrid';
import { getGalleryImages, GalleryImage } from '@/integrations/supabase/api';
import { useQuery } from '@tanstack/react-query';
import { Image } from '@/lib/data';
import { toast } from 'sonner';

const PrintsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // Fetch images using React Query - only get images with enable_print=true
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['prints-gallery'],
    queryFn: async () => {
      const allImages = await getGalleryImages('gallery');
      // Filter only images that have enable_print set to true
      return allImages.filter(image => image.enable_print === true);
    }
  });
  
  // Extract all unique categories from images
  useEffect(() => {
    if (images.length > 0) {
      const categories = Array.from(
        new Set(images.flatMap(image => image.categories || []))
      ).sort();
      setAllCategories(categories);
    }
  }, [images]);
  
  // Filter images based on category
  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory 
      ? image.categories?.includes(selectedCategory) 
      : true;
    
    return matchesCategory;
  });

  // Convert Supabase image data to the format expected by ImageGrid
  const formattedImages: Image[] = filteredImages.map(image => ({
    id: image.id,
    src: image.image_url,
    title: image.title,
    description: image.description || '',
    location: image.location || '',
    date: image.date || '',
    alt: image.title,
    categories: image.categories || [],
    photographerNote: image.photographers_note || '',
    enablePrint: image.enable_print || false,
    width: 0,  // Add placeholder values
    height: 0
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-serif mb-4">Available Prints</h1>
            <p className="text-muted-foreground">
              Browse our collection of fine art prints available for purchase.
            </p>
          </div>
          
          {/* Category Filters */}
          {allCategories.length > 0 && (
            <div className="mb-10">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedCategory === null 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  All Categories
                </button>
                
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading available prints...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-destructive">Failed to load prints</h3>
              <p className="text-muted-foreground">
                There was an error loading the prints. Please try again later.
              </p>
            </div>
          )}
          
          {/* Prints Gallery Grid */}
          {!isLoading && !error && (
            <>
              {filteredImages.length > 0 ? (
                <ImageGrid images={formattedImages} columns={3} />
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium mb-2">No prints currently available</h3>
                  <p className="text-muted-foreground">
                    Check back soon as we regularly update our collection with new prints.
                  </p>
                </div>
              )}
              
              {/* Results count */}
              {filteredImages.length > 0 && (
                <p className="text-sm text-muted-foreground mt-6">
                  Showing {filteredImages.length} prints available for purchase
                </p>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrintsGallery;
