import React, { useEffect, useState } from 'react';
import { ImagePreloader } from './ImagePreloader';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, BlogImage } from '@/integrations/supabase/api';

// Local images that need to be preloaded
const localImagesToPreload = [
  // Add your local images here
  '/lovable-uploads/79dc3092-5eaf-49f0-9fbb-5445cafebe74.png',
  '/lovable-uploads/0f8fd122-54f5-40c6-bc1a-42b844709c07.png',
];

interface AppPreloaderProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ children, onComplete }) => {
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Skip preloading on mobile
    if (isMobile) {
      setIsLoading(false);
      onComplete?.();
      return;
    }

    const fetchSupabaseImages = async () => {
      try {
        // Fetch gallery images
        const { data: galleryImages, error: galleryError } = await supabase
          .from('gallery_images')
          .select('image_url')
          .order('created_at', { ascending: false });

        if (galleryError) throw galleryError;

        // Fetch blog images
        const { data: blogImages, error: blogError } = await supabase
          .from('blog_images')
          .select('image_url')
          .order('created_at', { ascending: false });

        if (blogError) throw blogError;

        // Process and validate image URLs
        const processImageUrl = (url: string) => {
          if (!url) return null;
          
          try {
            // If it's already a valid Supabase storage URL, return it
            if (url.includes('supabase.co/storage/v1/object/public/images/')) {
              return url;
            }

            // If it's a dashboard URL, return null
            if (url.includes('supabase.com/dashboard')) {
              console.warn('Invalid dashboard URL detected:', url);
              return null;
            }

            // If it's a relative path, get the public URL
            const { data } = supabase.storage
              .from('images')
              .getPublicUrl(url);

            if (!data?.publicUrl) {
              console.warn('No public URL generated for:', url);
              return null;
            }

            return data.publicUrl;
          } catch (error) {
            console.error('Error processing image URL:', error);
            return null;
          }
        };

        // Combine and process all image URLs
        const allImages = [
          ...localImagesToPreload,
          ...(galleryImages?.map(img => processImageUrl(img.image_url)) || []),
          ...(blogImages?.map(img => processImageUrl(img.image_url)) || [])
        ].filter((url): url is string => url !== null);

        // Remove duplicates and invalid URLs
        const uniqueImages = [...new Set(allImages)].filter(url => {
          try {
            new URL(url);
            return true;
          } catch {
            console.warn('Invalid URL detected:', url);
            return false;
          }
        });

        console.log('Processed image URLs:', uniqueImages);
        setSupabaseImages(uniqueImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupabaseImages();
  }, [isMobile, onComplete]);

  // Skip preloader on mobile
  if (isMobile) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* No text, only loader will be shown by ImagePreloader */}
      </div>
    );
  }

  return (
    <ImagePreloader
      images={supabaseImages}
      onComplete={onComplete}
      onError={(error) => console.error('Error preloading images:', error)}
    >
      {children}
    </ImagePreloader>
  );
}; 