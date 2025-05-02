
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ImageGrid from '@/components/ImageGrid';
import { getGalleryImages, GalleryImage } from '@/integrations/supabase/api';
import { useQuery } from '@tanstack/react-query';
import { Image } from '@/lib/data';

const Gallery = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Wildlife');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>(['Wildlife', 'StreetPalette', 'AstroShot', 'Landscape']);
  const [genreCategories, setGenreCategories] = useState<string[]>([]);
  
  // Fetch images using React Query
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages('gallery')
  });
  
  // Extract all unique categories and genres from images
  useEffect(() => {
    if (images.length > 0) {
      const categories = Array.from(
        new Set(images.flatMap(image => image.categories || []))
      ).sort();
      setAllCategories(categories);
      
      const genres = Array.from(
        new Set(images.flatMap(image => image.genres || []))
      ).sort();
      
      if (genres.length > 0) {
        setAllGenres(prevGenres => {
          // Combine default genres with fetched genres, removing duplicates
          const combinedGenres = [...new Set([...prevGenres, ...genres])];
          return combinedGenres;
        });
      }
      
      // Update genre-specific categories
      updateGenreCategories(selectedGenre, images);
    }
  }, [images]);
  
  // Update categories when genre changes
  useEffect(() => {
    updateGenreCategories(selectedGenre, images);
  }, [selectedGenre, images]);
  
  // Function to update categories based on selected genre
  const updateGenreCategories = (genre: string, imagesList: GalleryImage[]) => {
    const genreImages = imagesList.filter(image => 
      image.genres?.includes(genre)
    );
    
    const categories = Array.from(
      new Set(genreImages.flatMap(image => image.categories || []))
    ).sort();
    
    setGenreCategories(categories);
    // Reset category selection if current selected category is not in the new genre
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setSelectedCategory(null);
    }
  };
  
  // Filter images based on genre and category
  const filteredImages = images.filter(image => {
    const matchesGenre = selectedGenre 
      ? image.genres?.includes(selectedGenre) 
      : true;
      
    const matchesCategory = selectedCategory 
      ? image.categories?.includes(selectedCategory) 
      : true;
    
    return matchesGenre && matchesCategory;
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
    width: 0,  // Add placeholder values
    height: 0
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Genre Filters - Styled like headings with Helvetica Bold */}
          <div className="mb-10 flex flex-wrap gap-6 md:gap-8">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? genre : genre)}
                className={`relative font-bold text-2xl md:text-3xl transition-all border-b-2 pb-1 ${
                  selectedGenre === genre 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground opacity-70 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                {genre}
              </button>
            ))}
          </div>
          
          {/* Category Filters - Only show categories for selected genre */}
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
              
              {genreCategories.map(category => (
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
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading gallery...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-destructive">Failed to load images</h3>
              <p className="text-muted-foreground">
                There was an error loading the gallery. Please try again later.
              </p>
            </div>
          )}
          
          {/* Gallery Grid */}
          {!isLoading && !error && (
            <>
              {filteredImages.length > 0 ? (
                <ImageGrid images={formattedImages} columns={3} />
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-medium mb-2">No matching images found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
              
              {/* Results count */}
              {filteredImages.length > 0 && (
                <p className="text-sm text-muted-foreground mt-6">
                  Showing {filteredImages.length} of {images.length} images
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

export default Gallery;
