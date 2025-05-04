
import React from 'react';
import { Trash, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: {
    id: string;
    imageId: string;
    optionId: string;
    size: string;
    price: number;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { getImage, updateQuantity, removeFromCart } = useCart();
  
  const image = getImage(item.imageId);
  
  if (!image) return null;
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b last:border-b-0">
      <div className="sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
        <img 
          src={image.image_url} 
          alt={image.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{image.title}</h3>
            <p className="text-sm text-muted-foreground mb-1">{image.description}</p>
            <div className="text-sm">
              <span className="font-medium">Size:</span> {item.size}
            </div>
            <div className="text-primary font-medium mt-1">
              ${item.price.toFixed(2)} each
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border rounded-md">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 text-muted-foreground hover:text-foreground" 
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 text-muted-foreground hover:text-foreground" 
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove item"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
