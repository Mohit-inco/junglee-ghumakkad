
import React from 'react';
import { Trash, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: {
    id: string;
    imageId: string;
    printOptionId: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { getImage, getPrintOption, updateQuantity, removeFromCart } = useCart();
  
  const image = getImage(item.imageId);
  const printOption = getPrintOption(item.printOptionId);
  
  if (!image || !printOption) return null;
  
  const subtotal = (Number(printOption.price) * item.quantity).toFixed(2);
  
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
            <p className="text-sm text-muted-foreground">{printOption.size}</p>
            <p className="text-sm text-muted-foreground">
              {printOption.print_type || "Archival Matte Paper"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">${Number(printOption.price).toFixed(2)} each</p>
          </div>
          <div className="text-right">
            <p className="font-medium">${subtotal}</p>
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
