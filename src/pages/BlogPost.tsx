
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlog, getBlogImages } from '@/integrations/supabase/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id!),
    enabled: !!id
  });

  const { data: blogImages = [] } = useQuery({
    queryKey: ['blog-images', id],
    queryFn: () => getBlogImages(id!),
    enabled: !!id
  });

  if (blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6 max-w-4xl mx-auto">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
