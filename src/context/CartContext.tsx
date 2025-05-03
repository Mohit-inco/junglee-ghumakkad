
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { GalleryImage, PrintOption } from "@/integrations/supabase/api";

interface CartItem {
  id: string;
  imageId: string;
  printOptionId: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (imageId: string, printOptionId: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  getImage: (imageId: string) => GalleryImage | undefined;
  getPrintOption: (printOptionId: string) => PrintOption | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ 
  children: React.ReactNode, 
  images?: GalleryImage[], 
  printOptions?: PrintOption[] 
}> = ({ 
  children, 
  images = [], 
  printOptions = [] 
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>(images);
  const [allPrintOptions, setAllPrintOptions] = useState<PrintOption[]>(printOptions);
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to properly handle boolean values from the database
  const isItemInStock = (inStockValue: any): boolean => {
    return inStockValue === true || inStockValue === 'true' || inStockValue === 't';
  };

  // Update cached images and print options when props change
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

  useEffect(() => {
    if (printOptions.length > 0) {
      setAllPrintOptions(prev => {
        const newOptions = [...prev];
        printOptions.forEach(option => {
          if (!newOptions.find(o => o.id === option.id)) {
            newOptions.push(option);
          }
        });
        return newOptions;
      });
    }
  }, [printOptions]);

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
      let total = 0;
      let count = 0;
      
      cartItems.forEach(item => {
        const printOption = allPrintOptions.find(option => option.id === item.printOptionId);
        if (printOption) {
          total += Number(printOption.price) * item.quantity;
          count += item.quantity;
        }
      });
      
      setCartTotal(total);
      setCartCount(count);
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems, allPrintOptions, isUpdating]);

  const getImage = (imageId: string) => {
    return allImages.find(image => image.id === imageId);
  };

  const getPrintOption = (printOptionId: string) => {
    return allPrintOptions.find(option => option.id === printOptionId);
  };

  const addToCart = (imageId: string, printOptionId: string) => {
    try {
      // Check if print option is in stock using the helper function
      const printOption = allPrintOptions.find(option => option.id === printOptionId);
      
      console.log("CartContext - addToCart:", {
        imageId,
        printOptionId, 
        printOption,
        rawStockValue: printOption?.in_stock,
        stockType: printOption ? typeof printOption.in_stock : 'undefined'
      });
      
      const isInStock = printOption ? isItemInStock(printOption.in_stock) : false;
      console.log("Stock status determined:", isInStock);
      
      if (!isInStock) {
        toast.error("This print size is currently out of stock.");
        return;
      }

      setIsUpdating(true);
      
      // Check if item already in cart
      const existingItemIndex = cartItems.findIndex(
        item => item.imageId === imageId && item.printOptionId === printOptionId
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
          id: `${imageId}-${printOptionId}-${Date.now()}`,
          imageId,
          printOptionId,
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
    getImage,
    getPrintOption,
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
