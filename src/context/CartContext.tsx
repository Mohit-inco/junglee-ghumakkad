
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { GalleryImage } from "@/integrations/supabase/api";

interface CartItem {
  id: string;
  imageId: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (imageId: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  getImage: (imageId: string) => GalleryImage | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ 
  children: React.ReactNode, 
  images?: GalleryImage[]
}> = ({ 
  children, 
  images = []
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>(images);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update cached images when props change
  useEffect(() => {
    if (images.length > 0) {
      setAllImages(prev => {
        const newImages = [...prev];
        images.forEach(image => {
          if (!newImages.find(i => i.id === image.id)) {
            newImages.push(image);
          }
        });
        return newImages;
      });
    }
  }, [images]);

  // Load cart from localStorage on initial render with proper error handling
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("wildlifeCart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      // If there's an error, start with an empty cart
      localStorage.removeItem("wildlifeCart");
    }
  }, []);

  // Save cart to localStorage when it changes with proper error handling
  useEffect(() => {
    if (isUpdating) return; // Skip during batch updates
    
    try {
      localStorage.setItem("wildlifeCart", JSON.stringify(cartItems));
      
      // Calculate total price and count
      let count = 0;
      
      cartItems.forEach(item => {
        count += item.quantity;
      });
      
      setCartTotal(0); // Setting to 0 as we removed pricing
      setCartCount(count);
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems, isUpdating]);

  const getImage = (imageId: string) => {
    return allImages.find(image => image.id === imageId);
  };

  const addToCart = (imageId: string) => {
    try {
      setIsUpdating(true);
      
      // Check if item already in cart
      const existingItemIndex = cartItems.findIndex(
        item => item.imageId === imageId
      );

      if (existingItemIndex > -1) {
        // Update quantity if already in cart
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
        toast.success("Item quantity updated in cart");
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `${imageId}-${Date.now()}`,
          imageId,
          quantity: 1,
        };
        setCartItems(prevItems => [...prevItems, newItem]);
        toast.success("Item added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      // Use setTimeout to ensure React has time to process the state update
      setTimeout(() => setIsUpdating(false), 0);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    try {
      setIsUpdating(true);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      toast.info("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setTimeout(() => setIsUpdating(false), 0);
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    try {
      if (quantity < 1) {
        removeFromCart(cartItemId);
        return;
      }

      setIsUpdating(true);
      const updatedItems = cartItems.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setTimeout(() => setIsUpdating(false), 0);
    }
  };

  const clearCart = () => {
    try {
      setIsUpdating(true);
      setCartItems([]);
      toast.info("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setTimeout(() => setIsUpdating(false), 0);
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    getImage
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
