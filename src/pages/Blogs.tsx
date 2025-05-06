
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogDataMapping } from '@/data/BlogData';

const Blogs = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const heroRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  
  const {
    data: dynamicBlogs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  });
  
  // Control navbar visibility on scroll
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        // Scrolling up or at top - show navbar
        setShowNavbar(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', controlNavbar);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  const handleBlogClick = (id: string) => {
    navigate(`/blogs/${id}`);
  };

  // Combine static and dynamic blogs
  const staticBlogs = Object.entries(blogDataMapping).map(([id, blog]) => ({
    id,
    title: blog.title,
    subtitle: blog.subtitle,
    coverImage: blog.coverImage,
    date: blog.date,
    author: blog.author || "Junglee Ghumakkad",
    isStatic: true
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Navbar with AnimatePresence for smooth appearance/disappearance */}
      <AnimatePresence>
        {showNavbar && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-40"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NavBar />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="pt-32 pb-16 px-6 bg-muted"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Blogs
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Stories, insights, and adventures from behind the lens.
          </motion.p>
        </div>
      </motion.section>
      
      {/* Static Blogs - Now as bars instead of cards */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-serif mb-8">Featured Stories</h2>
          <div className="space-y-4">
            {staticBlogs.map((blog, index) => (
              <motion.div 
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
                className="group bg-background border shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors duration-300">{blog.title}</h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4">{blog.subtitle}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{blog.date ? new Date(blog.date).toLocaleDateString() : 'Date not available'}</span>
                        <span className="mx-2">•</span>
                        <span>By {blog.author}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Dynamic Blogs from Supabase - Also as bars */}
      <section className="py-8 px-6 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-serif mb-8">Recent Posts</h2>
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Failed to load blog posts. Please try again later.
              </p>
            </div>
          ) : dynamicBlogs.length > 0 ? (
            <div className="space-y-4">
              {dynamicBlogs.map((blog, index) => (
                <motion.div 
                  key={blog.id}
                  onClick={() => handleBlogClick(blog.id)}
                  className="group bg-background border shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {blog.cover_image && (
                      <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={blog.cover_image} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 md:w-3/4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors duration-300">{blog.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-4">{blog.summary || ''}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>By {blog.author}</span>
                        </div>
                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4">
                          {blog.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No blog posts available yet.</p>
            </div>
          )}
        </div>
      </section>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Blogs;
