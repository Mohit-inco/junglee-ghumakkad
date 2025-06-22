
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getGalleryImages } from '@/integrations/supabase/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

const PrintsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  
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

  // Handle click on print to navigate to print details page
  const handlePrintClick = (id: string) => {
    navigate(`/print/${id}`);
  };

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden flex flex-col h-full">
                      <div 
                        className="relative h-64 cursor-pointer"
                        onClick={() => handlePrintClick(image.id)}
                      >
                        <img
                          src={image.image_url}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardContent className="flex-grow p-4">
                        <h3 className="font-medium text-lg mb-1">{image.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {image.description}
                        </p>
                        {image.location && (
                          <p className="text-xs text-muted-foreground">
                            {image.location}
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          className="w-full"
                          onClick={() => handlePrintClick(image.id)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          View Print Options
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
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
