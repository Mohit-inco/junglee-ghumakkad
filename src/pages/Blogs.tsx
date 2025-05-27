import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Search, Filter, ChevronDown, X } from 'lucide-react';

// Static blog data for the photography expedition
const photographyBlog = {
  id: 'nelapattu-pulicat-expedition',
  title: 'An Expedition to Nellapattu and Pulicat Bird Sanctuaries',
  subtitle: 'A thrilling photography adventure into the heart of avian life and conservation',
  coverImage: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC06581.jpg",
  date: new Date().toISOString(),
  author: "Junglee Ghumakkad",
  isStatic: true,
  tags: ['Photography', 'Wildlife', 'Nature', 'Birds']
};

const Blogs = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [activeCategory, setActiveCategory] = useState('all');
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const filterRef = useRef(null);
  
  // Handle clicking outside the filter menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setShowNavbar(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  const handleBlogClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  // Combine static and dynamic blogs
  const allBlogs = [photographyBlog, ...dynamicBlogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    subtitle: blog.summary || '',
    coverImage: blog.cover_image,
    date: blog.published_at || blog.created_at,
    author: blog.author || "Junglee Ghumakkad",
    isStatic: false,
    tags: blog.tags || []
  }))];

  // Get unique categories from all blogs
  const categories = ['all', ...new Set(allBlogs.flatMap(blog => blog.tags))].filter(Boolean);

  // Filter and sort blogs
  const filteredBlogs = allBlogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           blog.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || (blog.tags && blog.tags.includes(activeCategory));
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Navbar with AnimatePresence */}
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
      
      {/* Hero Section - Simplified and more impactful */}
      <section className="relative pt-32 pb-16 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="relative z-10">Explore Our Stories</span>
            <span className="absolute -z-10 bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-primary/20 rounded-full"></span>
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Adventures, insights, and moments captured through our lens
          </motion.p>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="sticky top-0 z-30 py-4 px-6 bg-background border-b shadow-sm backdrop-blur-md bg-background/90">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="w-full md:w-2/3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filter and Sort Controls */}
            <div className="flex gap-3 self-end md:self-auto">
              {/* Sort Order Toggle */}
              <button 
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                className="px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 hover:bg-muted transition-colors"
              >
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {/* Category Filter */}
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 hover:bg-muted transition-colors"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {activeCategory === 'all' ? 'All Categories' : activeCategory}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-background rounded-lg shadow-lg border z-20">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${activeCategory === category ? 'text-primary font-medium' : ''}`}
                        onClick={() => {
                          setActiveCategory(category);
                          setIsFilterMenuOpen(false);
                        }}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Blog Content - Unified Layout */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Results Count and Summary */}
          <div className="mb-6 text-sm text-muted-foreground">
            <p>
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'} found
              {searchTerm && ` matching "${searchTerm}"`}
              {activeCategory !== 'all' && ` in "${activeCategory}"`}
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading stories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Failed to load blog posts. Please try again later.
              </p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="space-y-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div 
                  key={blog.id}
                  onClick={() => handleBlogClick(blog.id)}
                  className="group bg-background border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {blog.coverImage && (
                      <div className="md:w-1/3 lg:w-1/4 h-56 md:h-44 overflow-hidden relative">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className={`p-6 ${blog.coverImage ? 'md:w-2/3 lg:w-3/4' : 'w-full'} flex flex-col justify-between`}>
                      <div>
                        {/* Date as a featured element */}
                        <div className="text-sm text-primary mb-2 font-medium">
                          {formatDate(blog.date)}
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-serif mb-3 group-hover:text-primary transition-colors duration-300">
                          {blog.title}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {blog.subtitle}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center text-sm">
                          <span className="text-muted-foreground">By {blog.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm mt-2 md:mt-0">
                          <span className="text-primary font-medium">Read more</span>
                          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4">
                          {blog.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag} 
                              className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                              +{blog.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed rounded-lg">
              <p className="text-xl text-muted-foreground mb-2">No stories found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for
              </p>
              {(searchTerm || activeCategory !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Pagination - Optional */}
      {filteredBlogs.length > 10 && (
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto flex justify-center">
            <nav className="flex items-center gap-1">
              <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50">
                &laquo;
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-md border bg-primary text-primary-foreground">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-muted">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-muted">3</button>
              <span className="w-10 h-10 flex items-center justify-center">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-muted">10</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-muted">
                &raquo;
              </button>
            </nav>
          </div>
        </section>
      )}
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Blogs;
