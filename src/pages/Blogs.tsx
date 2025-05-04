import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Blog1 from '@/Blog1'; // Import your Blog1 component

const Blogs = () => {
  const [showBlog1, setShowBlog1] = useState(false);
  const {
    data: blogs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  });
  const toggleBlog1 = () => {
    setShowBlog1(prevState => !prevState);
  };
  return <div className="min-h-screen flex flex-col bg-background">
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
      
      {/* Featured Blog Bar */}
      <section className="py-6 bg-primary cursor-pointer hover:bg-primary/90 transition-colors" onClick={toggleBlog1}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-primary-foreground text-lg md:text-xl font-medium">
                Our Photography Expedition to Nelapattu and Pulicat
              </span>
            </div>
            <div className="text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showBlog1 ? 'rotate-90' : ''}`}>
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog1 Content - Only shown when toggle is active */}
      {showBlog1 && <section className="py-100 px-6">
          <div className="max-w-4xl mx-auto">
            {isLoading ? <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading blog content...</p>
              </div> : error ? <div className="text-center py-10">
                <h3 className="text-xl font-medium mb-2 text-destructive">Failed to load blog content</h3>
                <p className="text-muted-foreground">
                  There was an error loading the blog. Please try again later.
                </p>
              </div> : <Blog1 />}
          </div>
        </section>}
      
      <div className="flex-grow"></div>
      <Footer />
    </div>;
};
export default Blogs;