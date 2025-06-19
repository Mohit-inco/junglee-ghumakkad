
import React, { useEffect, useState } from 'react';
import { ImagePreloader } from './ImagePreloader';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, BlogImage } from '@/integrations/supabase/api';

// Only preload essential local images
const localImagesToPreload = [
  '/lovable-uploads/79dc3092-5eaf-49f0-9fbb-5445cafebe74.png',
  '/lovable-uploads/0f8fd122-54f5-40c6-bc1a-42b844709c07.png',
];

interface AppPreloaderProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ children, onComplete }) => {
  const [essentialImages, setEssentialImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Skip preloading on mobile for faster initial load
    if (isMobile) {
      setIsLoading(false);
      onComplete?.();
      return;
    }

    const fetchEssentialImages = async () => {
      try {
        // Only fetch featured/hero images for initial preload
        const { data: featuredImages, error: featuredError } = await supabase
          .from('gallery_images')
          .select('image_url')
          .eq('section', 'featured')
          .limit(6) // Only preload first 6 featured images
          .order('created_at', { ascending: false });

        if (featuredError) throw featuredError;

        const processImageUrl = (url: string) => {
          if (!url) return null;
          
          try {
            if (url.includes('supabase.co/storage/v1/object/public/images/')) {
              return url;
            }

            if (url.includes('supabase.com/dashboard')) {
              console.warn('Invalid dashboard URL detected:', url);
              return null;
            }

            const { data } = supabase.storage
              .from('images')
              .getPublicUrl(url);

            return data?.publicUrl || null;
          } catch (error) {
            console.error('Error processing image URL:', error);
            return null;
          }
        };

        // Combine local images with essential remote images
        const allEssentialImages = [
          ...localImagesToPreload,
          ...(featuredImages?.map(img => processImageUrl(img.image_url)) || [])
        ].filter((url): url is string => url !== null);

        // Remove duplicates and validate URLs
        const uniqueImages = [...new Set(allEssentialImages)].filter(url => {
          try {
            new URL(url);
            return true;
          } catch {
            console.warn('Invalid URL detected:', url);
            return false;
          }
        });

        console.log('Essential images to preload:', uniqueImages.length);
        setEssentialImages(uniqueImages);
      } catch (error) {
        console.error('Error fetching essential images:', error);
        // Continue without preloading if fetch fails
        setEssentialImages(localImagesToPreload);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEssentialImages();
  }, [isMobile, onComplete]);

  // Skip preloader on mobile
  if (isMobile) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-300">Preparing gallery...</div>
      </div>
    );
  }

  return (
    <ImagePreloader
      images={essentialImages}
      onComplete={onComplete}
      onError={(error) => console.error('Error preloading essential images:', error)}
      priorityCount={4} // Load first 4 images with high priority
    >
      {children}
    </ImagePreloader>
  );
};
