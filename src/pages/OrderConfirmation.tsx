
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || `ORD${Math.floor(Math.random() * 10000)}`;
  const total = searchParams.get('total') || '0.00';
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Thank You For Your Order!</h1>
          
          <div className="bg-card border rounded-lg p-8 mt-6">
            <p className="text-lg mb-6">
              Your order has been placed successfully. We'll send you an email confirmation shortly.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Order Number:</span>
                <span>{orderId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Total Amount:</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Estimated Delivery:</span>
                <span>7-10 business days</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-8">
              If you have any questions about your order, please contact us at <a href="mailto:support@jungleeghumakkad.com" className="text-primary hover:underline">support@jungleeghumakkad.com</a>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">
                  Return to Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/prints">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
