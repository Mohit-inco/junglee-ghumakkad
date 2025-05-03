import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBlogs } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Blog1 from '@/Blog1'; // Import your Blog1 component

const Blogs = () => {
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">Blogs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stories, insights, and adventures from behind the lens.
          </p>
        </div>
      </section>
      
      {/* Content Section - Using Blog1 Component */}
      <section className="py-20 px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-destructive">Failed to load blog posts</h3>
              <p className="text-muted-foreground">
                There was an error loading the blogs. Please try again later.
              </p>
            </div>
          ) : (
            <Blog1 blogs={blogs} />
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blogs;
