
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ImageGrid from '@/components/ImageGrid';
import { images } from '@/lib/data';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract all unique categories from images
  const allCategories = Array.from(
    new Set(images.flatMap(image => image.categories))
  ).sort();
  
  // Filter images based on category and search term
  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory ? image.categories.includes(selectedCategory) : true;
    const matchesSearch = searchTerm 
      ? image.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.location.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Gallery Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Wildlife Gallery</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore the collection of wildlife photographs from around the world, 
              capturing rare moments and extraordinary creatures in their natural habitats.
            </p>
          </div>
          
          {/* Filters and Search */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === null 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                All
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
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-4 py-2 pr-10 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
          
          {/* Gallery Grid */}
          {filteredImages.length > 0 ? (
            <ImageGrid images={filteredImages} columns={3} />
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No matching images found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all images by selecting 'All'.
              </p>
            </div>
          )}
          
          {/* Results count */}
          {filteredImages.length > 0 && (
            <p className="text-sm text-muted-foreground mt-6">
              Showing {filteredImages.length} of {images.length} images
            </p>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
