import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Define order status options
const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const AdminOrders: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate('/admin-login');
          return;
        }
        
        setUser(data.session.user);
        
        // Use the check_if_admin function we already set up
        const { data: adminCheckData, error: adminCheckError } = await supabase
          .rpc('check_if_admin', { input_user_id: data.session.user.id });
        
        console.log("Admin check data:", adminCheckData);
        console.log("Admin check error:", adminCheckError);
        
        if (adminCheckError) {
          console.error("Admin check error:", adminCheckError);
          toast.error('Error checking admin privileges');
          navigate('/');
          return;
        }
        
        if (adminCheckData === true) {
          setIsAdmin(true);
          // Don't fetch orders here - we'll do it after loading is complete
        } else {
          toast.error('You do not have admin privileges');
          navigate('/');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        navigate('/admin-login');
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin-login');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch orders when loading is complete and isAdmin is true
  useEffect(() => {
    if (!loading && isAdmin) {
      fetchOrders();
    }
  }, [loading, isAdmin]);

  // Fetch orders from the database using RPC function to avoid policy conflicts
  const fetchOrders = async () => {
    try {
      // Use a function to fetch orders instead of direct table access
      const { data, error } = await supabase
        .rpc('get_all_orders');
      
      if (error) {
        console.error('Error fetching orders with RPC:', error);
        
        // Fallback to direct query with specific columns to avoid potential policy issues
        const { data: directData, error: directError } = await supabase
          .from('orders')
          .select(`
            id, 
            order_id, 
            created_at, 
            customer_name, 
            customer_email, 
            customer_phone,
            address, 
            city, 
            state, 
            pincode, 
            total_amount, 
            payment_method, 
            status, 
            tracking_number,
            items
          `)
          .order('created_at', { ascending: false });
        
        if (directError) {
          throw directError;
        }
        
        setOrders(directData || []);
        setFilteredOrders(directData || []);
        return;
      }
      
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  // Handle order click
  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setTrackingNumber(order.tracking_number || '');
    setIsDialogOpen(true);
  };

  // Handle order update
  const handleUpdateOrder = async () => {
    try {
      setIsUpdating(true);
      
      // Use an RPC function to update the order to avoid policy conflicts
      const { error } = await supabase
        .rpc('update_order', {
          order_id_param: selectedOrder.id,
          status_param: status,
          tracking_number_param: trackingNumber.trim() || null
        });
      
      if (error) {
        // Fallback to direct update if RPC fails
        const { error: directError } = await supabase
          .from('orders')
          .update({
            status,
            tracking_number: trackingNumber.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedOrder.id);
        
        if (directError) {
          throw directError;
        }
      }
      
      toast.success('Order updated successfully');
      setIsDialogOpen(false);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.message || 'Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(order => 
      order.order_id?.toLowerCase().includes(lowerSearchTerm) ||
      order.customer_name?.toLowerCase().includes(lowerSearchTerm) ||
      order.customer_email?.toLowerCase().includes(lowerSearchTerm) ||
      order.customer_phone?.includes(searchTerm)
    );
    
    setFilteredOrders(filtered);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get status color
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
            Admin Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Orders Overview</CardTitle>
          <CardDescription>
            Manage customer orders, update status and add tracking information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex gap-2 flex-grow">
              <Input
                placeholder="Search by order ID, customer name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-grow"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No orders found matching your search' : 'No orders found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleOrderClick(order)}>
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <div>
                          <div>{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>₹{Number(order.total_amount || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`text-xs py-1 px-2 rounded-full ${getStatusColor(order.status)}`}>
                          {(order.status || '').charAt(0).toUpperCase() + (order.status || '').slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{order.tracking_number || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.order_id}</DialogTitle>
            <DialogDescription>
              View and update order information
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer_phone}</p>
                  </div>
                  
                  <h3 className="font-medium mb-2 mt-4">Shipping Address</h3>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.address}</p>
                    <p>{selectedOrder.city}, {selectedOrder.state}</p>
                    <p>PIN: {selectedOrder.pincode}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.created_at)}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{Number(selectedOrder.total_amount || 0).toFixed(2)}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="space-y-1">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tracking"
                          placeholder="Enter India Post tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedOrder.items || []).map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.title || 'Print'}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
