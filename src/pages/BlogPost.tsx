
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlog, getBlogImages } from '@/integrations/supabase/api';
import BlogTemplate from '@/components/BlogTemplate';
import { BlogContent } from '@/lib/data';
import { blog1 } from '@/data/BlogData';

interface ImageData {
  src: string;
  alt: string;
}

interface BlogSection {
  type: 'text';
  content: string[];
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blogContent, setBlogContent] = useState<any>(null);
  const [blogImages, setBlogImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error("Blog ID is missing");
        }

        // Check if this is the static blog
        if (id === 'nelapattu-pulicat-expedition') {
          setBlogContent(blog1);
          setBlogImages([]);
          setLoading(false);
          return;
        }

        const blog = await getBlog(id);
        if (blog) {
          setBlogContent(blog);
          const images = await getBlogImages(id);
          setBlogImages(images);
        } else {
          setError(new Error("Blog post not found"));
        }
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error("Failed to load blog post"));
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blogContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <button
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // If this is the static blog, use it directly
  if (id === 'nelapattu-pulicat-expedition') {
    return <BlogTemplate content={blogContent} />;
  }

  // Create a properly typed BlogContent object for dynamic blogs
  const formattedBlogContent: BlogContent = {
    title: blogContent.title,
    subtitle: blogContent.summary || '',
    coverImage: {
      src: blogContent.cover_image || '/placeholder.svg',
      alt: blogContent.title
    },
    author: blogContent.author,
    date: blogContent.published_at ? new Date(blogContent.published_at).toLocaleDateString() : '',
    sections: [
      {
        type: 'text' as const,
        content: [blogContent.content]
      }
    ],
    galleryImages: blogImages.map(img => ({
      src: img.image_url,
      alt: img.caption || blogContent.title
    }))
  };

  return <BlogTemplate content={formattedBlogContent} />;
};

export default BlogPost;
