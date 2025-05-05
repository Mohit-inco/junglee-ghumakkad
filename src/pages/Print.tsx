
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { getImageById, getPrintOptions } from '@/integrations/supabase/api';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Maximize } from 'lucide-react';
import ImageModal from '@/components/ImageModal';

const Print: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  
  const [image, setImage] = useState<any>(null);
  const [printOptions, setPrintOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
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
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Button variant="outline" className="mb-6" onClick={() => navigate('/prints')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prints
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="rounded-lg overflow-hidden bg-muted">
                <img 
                  src={image.image_url} 
                  alt={image.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Preview card */}
              <Card className="mt-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowImageModal(true)}>
                <CardContent className="p-3 flex items-center space-x-2">
                  <div className="h-10 w-10 overflow-hidden rounded bg-muted flex-shrink-0">
                    <img 
                      src={image.image_url} 
                      alt={image.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">View full size</p>
                  </div>
                  <Maximize className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{image.title}</h1>
              <p className="text-muted-foreground mb-4">{image.description}</p>
              
              {image.location && (
                <p className="text-sm mb-2">
                  <span className="font-medium">Location:</span> {image.location}
                </p>
              )}
              
              {image.photographers_note && (
                <div className="bg-muted p-4 rounded-md mb-6 italic">
                  <p className="text-sm">{image.photographers_note}</p>
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Print</CardTitle>
                  <CardDescription>Select a size to purchase a print of this photograph</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {printOptions.length === 0 ? (
                    <p className="text-muted-foreground">No print options are currently available for this image.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {printOptions.map((option) => (
                        <Button
                          key={option.id}
                          variant={selectedSize === option.size ? "default" : "outline"}
                          onClick={() => setSelectedSize(option.size)}
                          className="justify-between"
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
                    className="w-full" 
                    disabled={!selectedSize || printOptions.length === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                  
                  {items.some(item => item.imageId === image.id) && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
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
      
      <Footer />
      
      {/* Image Modal */}
      {showImageModal && image && (
        <ImageModal
          image={{
            id: image.id,
            src: image.image_url,
            alt: image.title,
            title: image.title,
            description: image.description,
            location: image.location || 'Unknown',
            date: image.date || 'N/A',
            photographerNote: image.photographers_note,
            categories: image.categories || [],
            enablePrint: image.enable_print,
            width: 1200,  // Adding default width
            height: 800   // Adding default height
          }}
          onClose={() => setShowImageModal(false)}
          onNext={() => {/* No op */}}
          onPrev={() => {/* No op */}}
        />
      )}
    </div>
  );
};

export default Print;
