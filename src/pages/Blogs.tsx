
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBlogs } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { BookOpen } from 'lucide-react';

const Blogs = () => {
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  });
  
  const hasBlogs = blogs.length > 0;
  
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
      
      {/* Content Section */}
      <section className="py-20 px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-destructive">Failed to load blog posts</h3>
              <p className="text-muted-foreground">
                There was an error loading the blogs. Please try again later.
              </p>
            </div>
          )}
          
          {!isLoading && !error && !hasBlogs && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl md:text-3xl font-serif mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                The blog section is currently under development. Check back soon for stories, photography tips, 
                and behind-the-scenes insights from my photography journeys.
              </p>
            </div>
          )}
          
          {hasBlogs && (
            <div className="space-y-12">
              {blogs.map(blog => (
                <div key={blog.id} className="border-b pb-12 last:border-b-0">
                  {blog.cover_image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={blog.cover_image} 
                        alt={blog.title} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  
                  <h2 className="text-2xl md:text-3xl font-serif mb-3">{blog.title}</h2>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span>{blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {blog.summary && (
                    <p className="mb-4">{blog.summary}</p>
                  )}
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button className="text-primary font-medium hover:underline">
                    Read more
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blogs;
