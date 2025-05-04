import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Blog1 from '@/Blog1'; 
import { motion, AnimatePresence } from 'framer-motion';

const Blogs = () => {
  const [showBlog1, setShowBlog1] = useState(false);
  const heroRef = useRef(null);
  
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
    
    // Scroll to top when opening blog
    if (!showBlog1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sample blog images (you can store these in your database or as constants)
  const blog1Images = {
    coverImage: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
    image1: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
    image2: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", 
    image3: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
    image4: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
    image5: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
    image6: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
    galleryImages: [
      { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Pelican in Flight" },
      { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Painted Stork" },
      { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Nelapattu Panorama" },
      { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Ibis Feeding" },
      { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Pulicat Lake Sunset" },
      { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Bird in Natural Habitat" }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      {/* Hero Section - with AnimatePresence for smooth exit */}
      <AnimatePresence>
        {!showBlog1 && (
          <motion.section 
            ref={heroRef}
            className="pt-32 pb-16 px-6 bg-muted"
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                Blogs
              </motion.h1>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Stories, insights, and adventures from behind the lens.
              </motion.p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* Blog Card - Styled as a wider card with transition effects */}
      <motion.section 
        className={`py-6 px-6 ${showBlog1 ? 'bg-background' : 'bg-primary cursor-pointer hover:bg-primary/90'} transition-colors`}
        onClick={!showBlog1 ? toggleBlog1 : undefined}
        layout
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className={`flex items-center justify-between p-4 rounded-lg ${showBlog1 ? 'border border-border' : ''}`}
            layout
          >
            <div className="flex items-center">
              <span className={`text-lg md:text-xl font-medium ${showBlog1 ? 'text-foreground' : 'text-primary-foreground'}`}>
                Our Photography Expedition to Nelapattu and Pulicat
              </span>
            </div>
            {!showBlog1 && (
              <div className="text-primary-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            )}
            {showBlog1 && (
              <motion.button
                className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBlog1();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Blog1 Content - With smooth entrance animation */}
      <AnimatePresence>
        {showBlog1 && (
          <motion.section 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full mx-auto">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading blog content...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium mb-2 text-destructive">Failed to load blog content</h3>
                  <p className="text-muted-foreground">
                    There was an error loading the blog. Please try again later.
                  </p>
                </div>
              ) : (
                <Blog1 {...blog1Images} />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Blogs;
