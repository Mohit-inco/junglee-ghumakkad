
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, total, clearCart } = useCart();
  
  const handleCheckout = () => {
    alert("Checkout functionality would be implemented here!");
    // In a real application, redirect to checkout or payment gateway
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-serif mb-4">Shopping Cart</h1>
            <p className="text-muted-foreground">
              Review your selections before proceeding to checkout.
            </p>
          </div>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
                
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={clearCart}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear cart
                  </button>
                  <Link
                    to="/gallery"
                    className="text-sm font-medium hover:text-primary/80 transition-colors"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm h-fit">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure payment processing. All major credit cards accepted.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-medium">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Looks like you haven't added any prints to your cart yet. 
                Explore our collection to find the perfect wildlife print.
              </p>
              <Link
                to="/gallery"
                className="inline-flex items-center px-6 py-3 mt-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Prints
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
