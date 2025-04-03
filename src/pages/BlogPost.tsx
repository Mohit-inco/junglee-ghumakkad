
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlog, getBlogImages } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch blog post details
  const { data: blog, isLoading: blogLoading, error: blogError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id || ''),
    enabled: !!id
  });
  
  // Fetch blog images
  const { data: blogImages = [], isLoading: imagesLoading } = useQuery({
    queryKey: ['blog-images', id],
    queryFn: () => getBlogImages(id || ''),
    enabled: !!id
  });
  
  if (!id) {
    navigate('/blogs');
    return null;
  }
  
  const isLoading = blogLoading || imagesLoading;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="pt-24 pb-16 px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-sm font-medium mb-8 hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to all blogs
          </Link>
          
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading blog post...</p>
            </div>
          )}
          
          {blogError && (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-destructive">Blog post not found</h3>
              <p className="text-muted-foreground">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
            </div>
          )}
          
          {!isLoading && !blogError && blog && (
            <article className="prose prose-lg max-w-none">
              {blog.cover_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={blog.cover_image} 
                    alt={blog.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">{blog.title}</h1>
              
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <span>{blog.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
              </div>
              
              {blog.summary && (
                <div className="bg-muted p-4 rounded-lg mb-8 italic">
                  {blog.summary}
                </div>
              )}
              
              <div className="mb-8">
                {/* Render the content with proper line breaks */}
                {blog.content.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                ))}
              </div>
              
              {/* Blog images */}
              {blogImages.length > 0 && (
                <div className="my-12">
                  <h2 className="text-2xl font-serif mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogImages.map((image) => (
                      <div key={image.id} className="rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={image.image_url} 
                          alt={image.caption || ''} 
                          className="w-full h-auto object-cover"
                        />
                        {image.caption && (
                          <p className="p-3 text-sm text-muted-foreground">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
