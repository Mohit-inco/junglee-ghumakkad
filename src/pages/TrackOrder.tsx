
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const [orderId, setOrderId] = useState(initialOrderId);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = async () => {
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    
    try {
      // Try querying using the order_id field which should be accessible via normal RLS
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId.trim())
        .single();
      
      if (error) {
        console.error('Error fetching order:', error);
        toast.error('Order not found. Please check the order ID and try again');
        setOrderData(null);
      } else if (data) {
        console.log('Order found:', data);
        setOrderData(data);
      } else {
        toast.error('Order not found. Please check the order ID and try again');
        setOrderData(null);
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Error fetching order details. Please try again later');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Try to search if orderId is provided in URL params
  React.useEffect(() => {
    if (initialOrderId) {
      handleSearch();
    }
  }, [initialOrderId]);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-serif mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order ID to check the status and tracking information.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Input
              placeholder="Enter your order ID (e.g., JG12345678)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow"
            />
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? 'Searching...' : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Track
                </>
              )}
            </Button>
          </div>
          
          {orderData ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>Order #{orderData.order_id}</div>
                    <div className={`text-sm py-1 px-3 rounded-full ${getStatusColor(orderData.status)}`}>
                      {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Order Information</h3>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Date:</span>
                          <span>{formatDate(orderData.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span>₹{Number(orderData.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span>{orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="text-sm space-y-1">
                        <p>{orderData.customer_name}</p>
                        <p>{orderData.address}</p>
                        <p>{orderData.city}, {orderData.state}</p>
                        <p>PIN: {orderData.pincode}</p>
                      </div>
                    </div>
                  </div>
                  
                  {orderData.tracking_number && (
                    <div className="mt-6 border rounded-lg p-4 bg-muted/50">
                      <h3 className="font-medium flex items-center">
                        <Package className="h-4 w-4 mr-2" /> 
                        Tracking Information
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm mb-2">Your order has been shipped via India Post.</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="font-medium text-sm bg-background px-3 py-1 rounded border">
                            {orderData.tracking_number}
                          </div>
                          <a
                            href={`https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 text-sm flex items-center"
                          >
                            Track on India Post <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                          {orderData.items.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm">{item.title || 'Print'}</td>
                              <td className="px-4 py-3 text-sm">{item.size}</td>
                              <td className="px-4 py-3 text-sm">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/prints')}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center p-10">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">Track your package</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Enter your order ID above to see the current status of your order and tracking information.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackOrder;
