import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ImageModal from '@/components/ImageModal';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { getImageById, getPrintOptions } from '@/integrations/supabase/api';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Maximize2 } from 'lucide-react';

const ImageBackgroundPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  
  const [image, setImage] = useState(null);
  const [printOptions, setPrintOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const fetchImageAndOptions = async () => {
      try {
        if (!id) {
          toast.error('Image ID is missing');
          navigate('/prints');
          return;
        }
        
        setLoading(true);
        const imageData = await getImageById(id);
        
        if (!imageData) {
          toast.error('Image not found');
          navigate('/prints');
          return;
        }
        
        if (!imageData.enable_print) {
          toast.error('This image is not available for print');
          navigate('/prints');
          return;
        }
        
        setImage(imageData);
        
        // Fetch print options
        const options = await getPrintOptions(id);
        
        if (options.length === 0) {
          toast.error('No print options available for this image');
        } else {
          // Filter to only show in-stock items
          const inStockOptions = options.filter(option => option.in_stock);
          setPrintOptions(inStockOptions);
          
          // Select the first size by default if available
          if (inStockOptions.length > 0) {
            setSelectedSize(inStockOptions[0].size);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        toast.error('Failed to load image details');
        setLoading(false);
        navigate('/prints');
      }
    };
    
    fetchImageAndOptions();
  }, [id, navigate]);
  
  const handleAddToCart = () => {
    if (!image || !selectedSize) {
      toast.error('Please select a print size');
      return;
    }
    
    const selectedOption = printOptions.find(option => option.size === selectedSize);
    
    if (!selectedOption) {
      toast.error('Selected print size is not available');
      return;
    }
    
    addToCart(image.id, selectedOption.id, selectedOption.size, selectedOption.price, image);
    toast.success('Print added to cart');
    
    // Navigate to cart after adding item
    navigate('/cart');
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Format image data for ImageModal component
  const formatImageForModal = () => {
    if (!image) return null;
    
    return {
      id: image.id,
      src: image.image_url,
      alt: image.title,
      title: image.title,
      description: image.description,
      location: image.location || 'Unknown location',
      date: image.date || 'Unknown date',
      photographerNote: image.photographers_note,
      categories: image.categories || [],
      enablePrint: image.enable_print
    };
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-24 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!image) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Image Not Found</h1>
            <p className="mb-6">The requested image could not be found.</p>
            <Button variant="outline" onClick={() => navigate('/prints')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Prints
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Full-screen background image with gradient overlay */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ 
          backgroundImage: `url(${image.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>
      
      <main className="flex-grow pt-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Button variant="outline" className="mb-6 bg-black/40 hover:bg-black/60 text-white border-white/20" onClick={() => navigate('/prints')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prints
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-3">{image.title}</h1>
              <p className="text-white/80 mb-6">{image.description}</p>
              
              {image.location && (
                <p className="text-sm mb-4">
                  <span className="font-medium">Location:</span> {image.location}
                </p>
              )}
              
              {image.photographers_note && (
                <div className="bg-black/40 p-4 rounded-md mb-6 italic">
                  <p className="text-white/90 text-sm">{image.photographers_note}</p>
                </div>
              )}
              
              {/* Image preview card */}
              <div className="bg-black/40 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 mb-6 cursor-pointer" onClick={openModal}>
                <div className="relative group">
                  <img 
                    src={image.image_url} 
                    alt={image.title}
                    className="w-full h-auto object-cover max-h-64"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm text-white/70">Click to view full image</p>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-black/40 text-white border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Order Print</CardTitle>
                  <CardDescription className="text-white/70">Select a size to purchase a print of this photograph</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {printOptions.length === 0 ? (
                    <p className="text-white/70">No print options are currently available for this image.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {printOptions.map((option) => (
                        <Button
                          key={option.id}
                          variant={selectedSize === option.size ? "default" : "outline"}
                          onClick={() => setSelectedSize(option.size)}
                          className={`justify-between ${
                            selectedSize === option.size 
                              ? "bg-white text-black" 
                              : "bg-black/40 text-white border-white/30 hover:bg-white/20"
                          }`}
                        >
                          <span>{option.size}</span>
                          <span>${Number(option.price).toFixed(2)}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-3">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/80" 
                    disabled={!selectedSize || printOptions.length === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                  
                  {items.some(item => item.imageId === image.id) && (
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent text-white border-white/30 hover:bg-white/20" 
                      onClick={() => navigate('/cart')}
                    >
                      View Cart
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Image Modal */}
      {showModal && image && (
        <ImageModal 
          image={formatImageForModal()}
          onClose={closeModal}
          onNext={() => {}} // Placeholder - you can implement navigation between images if needed
          onPrev={() => {}} // Placeholder - you can implement navigation between images if needed
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ImageBackgroundPrint;
