
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadPanel from '@/components/admin/ImageUploadPanel';
import BlogManagementPanel from '@/components/admin/BlogManagementPanel';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import SectionsGuide from '@/components/SectionsGuide';

const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/admin-login');
        return;
      }
      
      setUser(data.session.user);
      setSession(data.session);
      setLoading(false);
      
      // Set the session in Supabase client
      supabase.auth.setSession(data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin-login');
      } else if (session) {
        setUser(session.user);
        setSession(session);
        supabase.auth.setSession(session);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" />;
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Logged in as {user.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
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
          <BlogManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
