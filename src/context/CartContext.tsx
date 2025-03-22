
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { CartItem as CartItemType, Image, PrintOption, images, printOptions } from "@/lib/data";

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (imageId: number, printOptionId: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  getImage: (imageId: number) => Image | undefined;
  getPrintOption: (printOptionId: number) => PrintOption | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("wildlifeCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("wildlifeCart", JSON.stringify(cartItems));
    
    // Calculate total price and count
    let total = 0;
    let count = 0;
    
    cartItems.forEach(item => {
      const printOption = printOptions.find(option => option.id === item.printOptionId);
      if (printOption) {
        total += printOption.price * item.quantity;
        count += item.quantity;
      }
    });
    
    setCartTotal(total);
    setCartCount(count);
  }, [cartItems]);

  const getImage = (imageId: number) => {
    return images.find(image => image.id === imageId);
  };

  const getPrintOption = (printOptionId: number) => {
    return printOptions.find(option => option.id === printOptionId);
  };

  const addToCart = (imageId: number, printOptionId: number) => {
    // Check if print option is in stock
    const printOption = printOptions.find(option => option.id === printOptionId);
    if (!printOption?.inStock) {
      toast.error("This print size is currently out of stock.");
      return;
    }

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
      const newItem: CartItemType = {
        id: `${imageId}-${printOptionId}-${Date.now()}`,
        imageId,
        printOptionId,
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
      toast.success("Item added to cart");
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== cartItemId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedItems = cartItems.map(item => 
      item.id === cartItemId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
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
