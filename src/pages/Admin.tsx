
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGallery from '@/components/admin/AdminGallery';
import AdminBlogs from '@/components/admin/AdminBlogs';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseClient, useAuth } from '@/lib/supabase';

const Admin = () => {
  const [email, setEmail] = useState<string>('incognito0bc@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const { isAuthenticated, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Authenticated successfully",
        description: "Welcome to the admin dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  useEffect(() => {
    const checkRLSAccess = async () => {
      if (isAuthenticated) {
        try {
          const { error } = await supabase.from('print_options').select('*').limit(1);
          
          if (error) {
            console.error("RLS permission error:", error);
            toast({
              title: "Access Issue Detected",
              description: "You may need to update RLS policies in Supabase. Check the console for more details.",
              variant: "destructive",
            });
          }
          
          // Check if the images bucket exists
          const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
          const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
          
          if (!imagesBucketExists) {
            console.log("Images storage bucket not found. Creating it...");
            const { error: createError } = await supabase.storage.createBucket('images', {
              public: true,
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
              fileSizeLimit: 10485760 // 10MB
            });
            
            if (createError) {
              console.error("Error creating images bucket:", createError);
              toast({
                title: "Storage Initialization Error",
                description: "Could not create the images storage bucket. Some functionality may be limited.",
                variant: "destructive",
              });
            } else {
              console.log("Images bucket created successfully");
            }
          }
        } catch (err) {
          console.error("Error checking RLS access:", err);
        }
      }
    };
    
    checkRLSAccess();
  }, [isAuthenticated, supabase, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center pt-24 px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center pt-24 px-6">
          <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
            <div className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Admin Access</h2>
              <p className="text-muted-foreground mt-2">Enter your password to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="mb-3"
                  required
                  disabled
                />
                
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginLoading}
              >
                {loginLoading ? "Authenticating..." : "Log In"}
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your website content</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Log Out
            </Button>
          </div>

          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery" className="mt-4">
              <AdminGallery />
            </TabsContent>
            <TabsContent value="blogs" className="mt-4">
              <AdminBlogs />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
