
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ImageGrid from '@/components/ImageGrid';
import { getGalleryImages, GalleryImage } from '@/integrations/supabase/api';
import { useQuery } from '@tanstack/react-query';
import { Image } from '@/lib/data';

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || 'Wildlife');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>(['Wildlife', 'StreetPalette', 'AstroShot', 'Landscape']);
  const [genreCategories, setGenreCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const IMAGES_PER_PAGE = 20;
  
  // Fetch images using React Query with pagination
  const { data: imagesResponse, isLoading, error } = useQuery({
    queryKey: ['gallery-images', selectedGenre, selectedCategory, page],
    queryFn: () => getGalleryImages('gallery', { 
      genre: selectedGenre, 
      category: selectedCategory,
      page,
      limit: IMAGES_PER_PAGE 
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Handle both paginated and non-paginated responses
  const images = Array.isArray(imagesResponse) ? imagesResponse : (imagesResponse?.data || []);
  const totalCount = Array.isArray(imagesResponse) ? images.length : (imagesResponse?.count || 0);

  // Update hasMore based on total count
  useEffect(() => {
    if (!Array.isArray(imagesResponse)) {
      setHasMore(images.length < totalCount);
    } else {
      setHasMore(false); // No pagination for array response
    }
  }, [images.length, totalCount, imagesResponse]);
  
  // Extract all unique categories and genres from images
  useEffect(() => {
    if (images.length > 0) {
      const categories = Array.from(
        new Set(images.flatMap(image => Array.isArray(image.categories) ? image.categories : []))
      ).sort() as string[];
      setAllCategories(categories);
      
      const genres = Array.from(
        new Set(images.flatMap(image => Array.isArray(image.genres) ? image.genres : []))
      ).sort() as string[];
      
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
    setPage(1); // Reset page when genre changes
  }, [selectedGenre, images]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  // Update URL when genre or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGenre) {
      params.set('genre', selectedGenre);
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    setSearchParams(params);
  }, [selectedGenre, selectedCategory, setSearchParams]);
  
  // Function to update categories based on selected genre
  const updateGenreCategories = (genre: string, imagesList: GalleryImage[]) => {
    const genreImages = imagesList.filter(image => 
      Array.isArray(image.genres) && image.genres.includes(genre)
    );
    
    const categories = Array.from(
      new Set(genreImages.flatMap(image => Array.isArray(image.categories) ? image.categories : []))
    ).sort() as string[];
    
    setGenreCategories(categories);
    // Reset category selection if current selected category is not in the new genre
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setSelectedCategory(null);
    }
  };
  
  // Filter images based on genre and category
  const filteredImages = images.filter(image => {
    const matchesGenre = selectedGenre 
      ? Array.isArray(image.genres) && image.genres.includes(selectedGenre)
      : true;
      
    const matchesCategory = selectedCategory 
      ? Array.isArray(image.categories) && image.categories.includes(selectedCategory)
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
    categories: Array.isArray(image.categories) ? image.categories : [],
    photographerNote: image.photographers_note || '',
    enablePrint: image.enable_print || false,
    width: 0,
    height: 0
  }));

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Genre Navigation */}
          <div className="mb-10 flex flex-wrap gap-6 md:gap-8">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
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
          
          {/* Category Navigation */}
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
          {isLoading && page === 1 && (
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
                <>
                  <ImageGrid images={formattedImages} columns={3} />
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
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
                  Showing {filteredImages.length} of {totalCount} images
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
