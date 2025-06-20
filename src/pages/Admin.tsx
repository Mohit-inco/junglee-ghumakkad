
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadPanel from '@/components/admin/ImageUploadPanel';
import BlogManagementPanel from '@/components/admin/BlogManagementPanel';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, Package } from 'lucide-react';
import { toast } from 'sonner';
import SectionsGuide from '@/components/SectionsGuide';

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminPhone, setAdminPhone] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check both regular authentication and SMS-based authentication
    const checkAuth = async () => {
      try {
        // Check for SMS-based admin session
        const adminSession = localStorage.getItem('admin_session');
        const storedAdminPhone = localStorage.getItem('admin_phone');
        
        if (adminSession && storedAdminPhone) {
          setAdminPhone(storedAdminPhone);
          setLoading(false);
          return;
        }

        // Check regular Supabase authentication
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate('/admin-sms-login');
          return;
        }
        
        setUser(data.session.user);
        setSession(data.session);
        setLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        navigate('/admin-sms-login');
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear SMS session as well
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_phone');
        navigate('/admin-sms-login');
      } else if (session) {
        setUser(session.user);
        setSession(session);
        setAdminPhone(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    // Sign out from both regular auth and SMS auth
    if (adminPhone) {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_phone');
      navigate('/admin-sms-login');
    } else {
      await supabase.auth.signOut();
    }
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication - either regular user or SMS-based admin
  if (!user && !adminPhone) {
    return <Navigate to="/admin-sms-login" />;
  }

  const displayEmail = user?.email || `SMS: ${adminPhone}`;

  return (
    <div className="container mx-auto p-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Logged in as {displayEmail}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2">
          <Package className="h-4 w-4" /> Manage Orders
        </Button>
      </div>
      
      <div className="mb-6">
        <SectionsGuide />
      </div>
      
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">Image Management</TabsTrigger>
          <TabsTrigger value="blogs">Blog Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <ImageUploadPanel session={session} />
        </TabsContent>
        
        <TabsContent value="blogs">
          <BlogManagementPanel session={session} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
