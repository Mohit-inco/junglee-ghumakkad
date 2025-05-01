
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
  
  // Convert in_stock value to boolean regardless of its type
  const isInStock = convertToBoolean(printOption.in_stock);
  
  // Helper function to properly convert various types to boolean
  function convertToBoolean(value: any): boolean {
    // If value is null or undefined, assume it's in stock
    if (value === null || value === undefined) return true;
    
    // If it's already a boolean, return it
    if (typeof value === 'boolean') return value;
    
    // If it's a string, check for false values
    if (typeof value === 'string') {
      const lowercased = value.toLowerCase();
      return !(lowercased === 'false' || lowercased === '0' || 
               lowercased === 'f' || lowercased === 'no');
    }
    
    // If it's a number, 0 is false, anything else is true
    if (typeof value === 'number') return value !== 0;
    
    // Default to true for any other case
    return true;
  }
  
  const handleAddToCart = () => {
    if (isInStock) {
      addToCart(image.id, printOption.id);
      console.log('Added to cart:', {imageId: image.id, printOptionId: printOption.id});
    } else {
      console.log('Cannot add to cart, item out of stock');
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
        <p className="text-muted-foreground text-sm mb-1">{printOption.size} print</p>
        <p className="text-muted-foreground text-sm mb-4">
          {printOption.print_type || "Archival Matte Paper"}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-xl">${Number(printOption.price).toFixed(2)}</span>
            {isInStock ? (
              <span className="text-xs flex items-center text-green-600">
                <Check className="h-3.5 w-3.5 mr-1" /> In Stock
              </span>
            ) : (
              <span className="text-xs text-destructive">Out of Stock</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              isInStock 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintOption;
