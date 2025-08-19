import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Fetch images using React Query
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => getGalleryImages('gallery')
  });
  
  // Memoize the updateGenreCategories function to prevent recreation on every render
  const updateGenreCategories = useCallback((genre: string, imagesList: GalleryImage[]) => {
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
  }, [selectedCategory]);
  
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
  }, [images, selectedGenre, updateGenreCategories]);
  
  // Update categories when genre changes
  useEffect(() => {
    if (images.length > 0) {
      updateGenreCategories(selectedGenre, images);
    }
  }, [selectedGenre, images, updateGenreCategories]);

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
  
  // Memoize filtered images to prevent recalculation on every render
  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const matchesGenre = selectedGenre 
        ? image.genres?.includes(selectedGenre) 
        : true;
        
      const matchesCategory = selectedCategory 
        ? image.categories?.includes(selectedCategory) 
        : true;
      
      return matchesGenre && matchesCategory;
    });
  }, [images, selectedGenre, selectedCategory]);

  // Memoize formatted images to prevent recreation on every render
  const formattedImages = useMemo(() => {
    return filteredImages.map(image => ({
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
      width: 0,
      height: 0
    }));
  }, [filteredImages]);

  // Scroll animation effect - only run when formattedImages actually change
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    // Observe all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [formattedImages.length]); // Only depend on the length, not the entire array

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
                <div ref={galleryRef} className="gallery-container">
                  <ImageGrid images={formattedImages} columns={3} />
                </div>
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
