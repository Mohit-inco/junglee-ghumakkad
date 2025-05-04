
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, PrintOption } from '@/integrations/supabase/api';

type CartItem = {
  id: string;
  imageId: string;
  optionId: string;
  size: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  count: number;
  addToCart: (imageId: string, optionId: string, size: string, price: number, image?: GalleryImage) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getImage: (imageId: string) => GalleryImage | undefined;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [images, setImages] = useState<Record<string, GalleryImage>>({});
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        
        // Fetch images for cart items
        const uniqueImageIds = [...new Set(parsedCart.map((item: CartItem) => item.imageId))];
        
        uniqueImageIds.forEach(async (imageId) => {
          fetchImage(imageId);
        });
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const fetchImage = async (imageId: string) => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('id', imageId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setImages(prev => ({
          ...prev,
          [imageId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };
  
  const addToCart = (imageId: string, optionId: string, size: string, price: number, image?: GalleryImage) => {
    // Save the image data if provided
    if (image) {
      setImages(prev => ({
        ...prev,
        [imageId]: image
      }));
    } else if (!images[imageId]) {
      fetchImage(imageId);
    }
    
    // Check if this item is already in the cart
    const existingItem = items.find(item => 
      item.imageId === imageId && item.optionId === optionId
    );
    
    if (existingItem) {
      // Update quantity
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${imageId}-${optionId}-${Date.now()}`,
        imageId,
        optionId,
        size,
        price,
        quantity: 1
      };
      
      setItems([...items, newItem]);
    }
  };
  
  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const getImage = (imageId: string): GalleryImage | undefined => {
    return images[imageId];
  };
  
  // Calculate totals
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  
  return (
    <CartContext.Provider value={{
      items,
      total,
      count,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getImage
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
