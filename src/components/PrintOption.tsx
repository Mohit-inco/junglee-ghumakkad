
import React from 'react';
import { Image, getImageSrc } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { PrintOption as PrintOptionType } from '@/integrations/supabase/api';

interface PrintOptionCardProps {
  image: Image;
  printOption: PrintOptionType;
}

const PrintOption: React.FC<PrintOptionCardProps> = ({ image, printOption }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    if (printOption.in_stock) {
      addToCart(image.id, printOption.id);
    }
  };
  
  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 flex flex-col h-full">
        <div className="rounded-md overflow-hidden mb-4 bg-muted">
          <img 
            src={getImageSrc(image.src)} 
            alt={image.title} 
            className="w-full h-48 object-cover"
          />
        </div>
        
        <h3 className="font-medium text-lg">{image.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{printOption.size} print</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-xl">${Number(printOption.price).toFixed(2)}</span>
            {printOption.in_stock ? (
              <span className="text-xs flex items-center text-green-600">
                <Check className="h-3.5 w-3.5 mr-1" /> In Stock
              </span>
            ) : (
              <span className="text-xs text-destructive">Out of Stock</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!printOption.in_stock}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              printOption.in_stock 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {printOption.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintOption;
