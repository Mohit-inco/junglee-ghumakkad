
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getGalleryImages, getPrintOptions, GalleryImage, PrintOption } from '@/integrations/supabase/api';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useQuery } from '@tanstack/react-query';

const Print = () => {
  const { id } = useParams<{ id?: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(id || null);
  const { addToCart } = useCart();
  
  // Fetch all gallery images
  const { data: images = [] } = useQuery({
    queryKey: ['print-gallery-images'],
    queryFn: () => getGalleryImages(),
  });
  
  // Filter to show only images with enable_print set to true
  const printableImages = images.filter(img => img.enable_print);
  
  // Fetch print options when an image is selected
  const { data: printOptions = [] } = useQuery({
    queryKey: ['print-options', selectedImage],
    queryFn: () => selectedImage ? getPrintOptions(selectedImage) : Promise.resolve([]),
    enabled: !!selectedImage
  });
  
  // Reset selected image when navigating directly to print/:id
  useEffect(() => {
    if (id) {
      setSelectedImage(id);
    }
  }, [id]);
  
  // Find the currently selected image
  const currentImage = selectedImage 
    ? printableImages.find(img => img.id === selectedImage) 
    : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Fine Art Prints</h1>
            <p className="text-muted-foreground max-w-2xl">
              All prints are produced using archival inks on museum-quality papers, 
              ensuring vibrant color reproduction and longevity.
            </p>
          </div>
          
          {currentImage ? (
            <>
              {/* Back to all prints */}
              <Link 
                to="/print" 
                className="inline-flex items-center text-sm font-medium mb-6 hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to all prints
              </Link>
              
              {/* Selected Image Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div className="rounded-lg overflow-hidden bg-muted shadow-md">
                  <img 
                    src={currentImage.image_url} 
                    alt={currentImage.title} 
                    className="w-full h-auto"
                  />
                </div>
                
                <div>
                  <h2 className="text-3xl font-serif mb-2">{currentImage.title}</h2>
                  <p className="text-muted-foreground mb-6">{currentImage.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <p>{currentImage.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                      <p>{currentImage.date || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentImage.categories?.map((category, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {category}
                        </span>
                      )) || <span className="text-muted-foreground">No categories specified</span>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Available Print Options</h3>
                    {printOptions.length > 0 ? (
                      <div className="space-y-4">
                        {printOptions.map((option) => (
                          <div key={option.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                            <div>
                              <p className="font-medium">{option.size}</p>
                              <p className="text-sm text-muted-foreground">
                                {option.print_type || "Archival Matte Paper"}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-4">${parseFloat(option.price.toString()).toFixed(2)}</span>
                              <button
                                onClick={() => addToCart(currentImage.id, option.id)}
                                disabled={!option.in_stock}
                                className={`px-4 py-1.5 rounded text-sm font-medium ${
                                  option.in_stock 
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                              >
                                {option.in_stock ? 'Add to Cart' : 'Out of Stock'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No print options available for this image.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Print Information Section */}
              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-card rounded-lg border p-8 shadow-sm">
                    <h3 className="text-xl font-medium mb-4">Museum Quality</h3>
                    <p className="text-muted-foreground">
                      All prints are produced using archival pigment inks on premium fine art papers, 
                      ensuring exceptional color accuracy and longevity of over 100 years.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-8 shadow-sm">
                    <h3 className="text-xl font-medium mb-4">Shipping & Handling</h3>
                    <p className="text-muted-foreground">
                      Prints are carefully packaged in acid-free materials and shipped in rigid 
                      containers to ensure they arrive in perfect condition.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-8 shadow-sm">
                    <h3 className="text-xl font-medium mb-4">Limited Editions</h3>
                    <p className="text-muted-foreground">
                      Select prints are offered as limited editions, individually signed and 
                      numbered, with certificates of authenticity included.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* All Prints Grid */}
              <div>
                <h2 className="text-3xl font-serif mb-6">Available Prints</h2>
                <p className="text-muted-foreground mb-8">
                  Select an image to view available print sizes and options.
                </p>
                
                {printableImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {printableImages.map(image => (
                      <div
                        key={image.id}
                        className="group rounded-lg overflow-hidden border shadow-sm cursor-pointer"
                        onClick={() => setSelectedImage(image.id)}
                      >
                        <div className="hover-image-card aspect-[4/3] bg-muted">
                          <img 
                            src={image.image_url} 
                            alt={image.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="image-overlay">
                            <h3 className="font-medium text-white text-lg mb-1">{image.title}</h3>
                            <p className="text-white/80 text-sm">{image.location || ''}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-medium mb-2">No prints available yet</h3>
                    <p className="text-muted-foreground">
                      Check back soon for new print offerings.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Print;
