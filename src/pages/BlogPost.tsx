import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NavBar from '@/components/NavBar';
import PhotographyExpeditionBlog from '@/components/PhotographyExpeditionBlog';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = React.useRef(0);
  
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

  // Special case for the photography expedition blog
  if (id === 'nelapattu-pulicat-expedition') {
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
          className="flex-grow"
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
            <PhotographyExpeditionBlog />
          </div>
        </motion.main>
      </div>
    );
  }

  // If no content is available, show error
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
        <p className="mb-4">The blog you're looking for doesn't exist.</p>
        <button
          onClick={closeBlog}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogPost;
