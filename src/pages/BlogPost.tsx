
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlog, getBlogImages } from '@/integrations/supabase/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BlogTemplate from '@/components/BlogTemplate';
import { blogDataMapping } from '@/data/BlogData';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = React.useRef(0);
  
  // For static blog content (from BlogData.ts)
  const staticBlogContent = id ? blogDataMapping[id] : undefined;
  
  // For dynamic blog content (from Supabase)
  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id!),
    enabled: !!id && !staticBlogContent // Only fetch from DB if not in static mapping
  });

  const { data: blogImages = [] } = useQuery({
    queryKey: ['blog-images', id],
    queryFn: () => getBlogImages(id!),
    enabled: !!id && !staticBlogContent // Only fetch from DB if not in static mapping
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
  
  // Close blog and return to blogs page
  const closeBlog = () => {
    navigate('/blogs');
  };

  // Loading state
  if (!staticBlogContent && blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If static blog content is available, use it
  if (staticBlogContent) {
    return (
      <div className="min-h-screen flex flex-col">
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
        
        <motion.main 
          className="flex-grow pt-16"
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100vh", opacity: 0 }}
          transition={{ type: "tween", duration: 0.5 }}
        >
          <div className="relative">
            <button
              onClick={closeBlog}
              className="fixed top-20 right-6 z-30 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-secondary/10 transition-colors duration-200"
              aria-label="Close blog"
            >
              <X className="h-6 w-6" />
            </button>
            <BlogTemplate content={staticBlogContent} />
          </div>
        </motion.main>
      </div>
    );
  }

  // If dynamic blog content is available, use it
  if (blog) {
    // Format the blog data to match the BlogContent interface
    const dynamicBlogContent = {
      title: blog.title,
      subtitle: blog.summary || "", // Use summary as subtitle or empty string if not available
      coverImage: blog.cover_image || "",
      author: blog.author,
      date: blog.published_at || blog.created_at,
      sections: [
        {
          type: "text" as const,
          content: [blog.content] // Assuming content is HTML
        }
      ],
      galleryImages: blogImages.map(img => ({
        src: img.image_url,
        alt: img.caption || "Blog image"
      }))
    };

    return (
      <div className="min-h-screen flex flex-col">
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
        
        <motion.main 
          className="flex-grow pt-16"
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100vh", opacity: 0 }}
          transition={{ type: "tween", duration: 0.5 }}
        >
          {/* For blogs stored in Supabase, we're using a simpler layout */}
          <div className="relative">
            <button
              onClick={closeBlog}
              className="fixed top-20 right-6 z-30 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-secondary/10 transition-colors duration-200"
              aria-label="Close blog"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="max-w-4xl mx-auto pt-24 px-6">
              {blog.cover_image && (
                <img 
                  src={blog.cover_image} 
                  alt={blog.title} 
                  className="w-full h-[400px] object-cover rounded-lg mb-8"
                />
              )}
              
              <article>
                <h1 className="text-4xl font-serif mb-4">{blog.title}</h1>
                <div className="flex items-center text-muted-foreground mb-6">
                  <span>By {blog.author}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                </div>
                
                {/* Blog Images Gallery */}
                {blogImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {blogImages.map(image => (
                      <img 
                        key={image.id} 
                        src={image.image_url} 
                        alt={image.caption || 'Blog image'} 
                        className="w-full h-48 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                
                {/* Full Blog Content */}
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </motion.main>
      </div>
    );
  }

  // Not found state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Blog post not found</p>
    </div>
  );
};

export default BlogPost;
