
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
import { ArrowLeft } from 'lucide-react';

const Print: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [image, setImage] = useState<any>(null);
  const [printOptions, setPrintOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchImageAndOptions = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const imageData = await getImageById(id);
        
        if (!imageData || !imageData.enable_print) {
          toast.error('This image is not available for print');
          navigate('/gallery');
          return;
        }
        
        setImage(imageData);
        
        // Fetch print options
        const options = await getPrintOptions(id);
        setPrintOptions(options.filter(option => option.in_stock));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        toast.error('Failed to load image details');
        setLoading(false);
      }
    };
    
    fetchImageAndOptions();
  }, [id, navigate]);
  
  const handleAddToCart = () => {
    if (!image || !selectedSize) return;
    
    const selectedOption = printOptions.find(option => option.size === selectedSize);
    
    if (!selectedOption) {
      toast.error('Please select a valid print size');
      return;
    }
    
    addToCart(image.id, selectedOption.id, selectedOption.size, selectedOption.price, image);
    toast.success('Print added to cart');
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
            <Button variant="outline" onClick={() => navigate('/gallery')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Gallery
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
          <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={!selectedSize || printOptions.length === 0}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Print;
