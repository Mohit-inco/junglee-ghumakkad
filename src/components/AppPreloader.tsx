import React, { useEffect, useState } from 'react';
import { ImagePreloader } from './ImagePreloader';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, BlogImage } from '@/integrations/supabase/api';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
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

        // Determine priority images based on current route
        let priorityImages: string[] = [];
        if (location.pathname === '/') {
          // For home page, prioritize local images and first few gallery images
          priorityImages = [
            ...localImagesToPreload,
            ...(galleryImages?.slice(0, 4).map(img => processImageUrl(img.image_url)) || [])
          ].filter((url): url is string => url !== null);
        } else if (location.pathname.startsWith('/gallery')) {
          // For gallery page, prioritize gallery images
          priorityImages = galleryImages?.slice(0, 8).map(img => processImageUrl(img.image_url)) || [];
        } else if (location.pathname.startsWith('/blog')) {
          // For blog page, prioritize blog images
          priorityImages = blogImages?.slice(0, 4).map(img => processImageUrl(img.image_url)) || [];
        }

        console.log('Processed image URLs:', uniqueImages);
        console.log('Priority images:', priorityImages);
        setSupabaseImages(uniqueImages);

        // Create preloader with priority images
        const preloader = new ImagePreloader({
          priorityImages,
          onComplete,
          onError: (error) => console.error('Error preloading images:', error)
        });

        preloader.addImages(uniqueImages);
        preloader.preload();
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupabaseImages();
  }, [location.pathname, onComplete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading image list...</div>
      </div>
    );
  }

  return <>{children}</>;
}; 