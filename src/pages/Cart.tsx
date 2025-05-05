
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowRight, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  pincode: z.string().min(6, { message: "Pincode must be at least 6 digits." }),
});

const Cart = () => {
  const { items, total, clearCart, getImage } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };
  
  const handlePaymentSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Generate a unique order ID - prefixed with JG (Junglee Ghumakkad)
      const orderId = `JG${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
      
      // Generate a 6-digit OTP for order verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Calculate the final total including tax and shipping
      const shipping = total > 1000 ? 0 : 100;
      const tax = total * 0.18;
      const finalTotal = total + shipping + tax;
      
      // Format order items for storage
      const orderItems = items.map(item => {
        const imageDetails = getImage(item.imageId);
        return {
          id: item.id,
          imageId: item.imageId,
          optionId: item.optionId,
          title: imageDetails?.title || 'Unknown',
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        };
      });

      // Insert order into the database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_id: orderId,
          customer_name: values.name,
          customer_email: values.email,
          customer_phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          payment_method: paymentMethod,
          items: orderItems,
          total_amount: finalTotal,
        })
        .select();

      if (error) {
        throw error;
      }

      // Send order confirmation email
      const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          customerName: values.name,
          customerEmail: values.email,
          customerPhone: values.phone,
          orderId,
          otp,
          totalAmount: finalTotal,
          items: orderItems
        }
      });

      if (emailResponse.error) {
        console.error("Email error:", emailResponse.error);
        toast.warning("Order placed, but confirmation email could not be sent.");
      }

      // Send OTP via SMS
      const smsResponse = await supabase.functions.invoke('send-sms-otp', {
        body: {
          phone: values.phone,
          message: `Your Junglee Ghumakkad order #${orderId} is confirmed! Verification code: ${otp}. Thank you for your purchase.`
        }
      });

      if (smsResponse.error) {
        console.error("SMS error:", smsResponse.error);
        toast.warning("Order placed, but SMS verification could not be sent.");
      }

      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Your order has been placed successfully!');
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation?orderId=${orderId}&total=${finalTotal.toFixed(2)}`);
      
    } catch (error: any) {
      console.error("Order submission error:", error);
      toast.error(error.message || 'An error occurred while placing your order');
    } finally {
      setIsSubmitting(false);
    }
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
            <>
              {!isCheckingOut ? (
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
                        to="/prints"
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
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹{(total > 1000 ? 0 : 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (18% GST)</span>
                        <span>₹{(total * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{(total + (total > 1000 ? 0 : 100) + (total * 0.18)).toFixed(2)}</span>
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
                      Secure payment processing. All major credit/debit cards accepted.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                        <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your email" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="City" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input placeholder="Pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                        
                        <div className="space-y-3">
                          <div 
                            className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'online' ? 'border-primary' : ''}`}
                            onClick={() => setPaymentMethod('online')}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary' : 'border-muted-foreground'}`}>
                                {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                              </div>
                              <div className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2" />
                                <span>Online Payment</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground ml-7 mt-1">Pay securely with Credit/Debit Card, UPI, or Net Banking</p>
                          </div>
                          
                          <div 
                            className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-primary' : ''}`}
                            onClick={() => setPaymentMethod('cod')}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                              </div>
                              <span>Cash on Delivery</span>
                            </div>
                            <p className="text-xs text-muted-foreground ml-7 mt-1">Pay when you receive the product</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1" 
                            onClick={() => setIsCheckingOut(false)}
                          >
                            Back to Cart
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Processing...' : 'Place Order'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-6 shadow-sm h-fit">
                    <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹{(total > 1000 ? 0 : 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (18% GST)</span>
                        <span>₹{(total * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{(total + (total > 1000 ? 0 : 100) + (total * 0.18)).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Items in Cart</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {items.map(item => {
                          const image = getImage(item.imageId);
                          return (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {image?.title || 'Item'} ({item.size})</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
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
                to="/prints"
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
