
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGalleryImages } from '@/integrations/supabase/api';
import Hero from '@/components/Hero';
import FeaturedWorkGrid from '@/components/FeaturedWorkGrid';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import ExpandingPanels from '@/components/ExpandingPanels';
import { Image } from '@/lib/data';
import { motion, useScroll, useTransform } from 'framer-motion';

const Index = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);
  const x = useTransform(scrollYProgress, [0, 1], [100, 0]);

  // Fetch featured images from the database
  const { data: featuredImagesResponse = [] } = useQuery({
    queryKey: ['featured-images'],
    queryFn: () => getGalleryImages('featured')
  });

  // Ensure we have an array to work with
  const featuredImages = Array.isArray(featuredImagesResponse) ? featuredImagesResponse : [];

  // Format the images for our components
  const formattedFeaturedImages: Image[] = featuredImages.map(image => ({
    id: image.id,
    src: image.image_url,
    title: image.title,
    description: image.description || '',
    location: image.location || '',
    date: image.date || '',
    alt: image.title,
    categories: image.categories || [],
    photographerNote: image.photographers_note || '',
    width: 0,  // Add placeholder values
    height: 0
  }));

  // Add scroll animation effects
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight * 0.85) {
          element.classList.add('animate-fade-in');
          element.classList.remove('opacity-0');
        }
      });
    };

    // Run once on initial load
    setTimeout(animateOnScroll, 300);

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);

    // Clean up
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <NavBar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Add gap between Hero and Expanding Panels */}
      <div className="mt-16 md:mt-24" />
      
      {/* Featured Work Section - with Grid Layout */}
      {/* Removed Featured Work section as requested */}
      
      {/* Expanding Panels Section */}
      <ExpandingPanels />
      
      {/* About Section Preview */}
      <section ref={aboutRef} className="bg-muted px-6 py-[62px] my-[80px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0">
              <h2 className="text-3xl md:text-4xl font-serif mb-6">About the Photographer</h2>
              <p className="text-muted-foreground mb-6">
                Junglee Ghumakkad (aka Mohit Kumar), a final-year B.Tech student in Electrical Engineering, has been capturing the world through his lens for the past five years. An aspiring wildlife photographer, he's equally drawn to event, astro, street, and architectural photography.
              </p>
              <p className="text-muted-foreground mb-6">
                Whether it's tracking elusive wildlife, chasing the perfect night sky, or framing the chaos of city streets, he's always on the lookout for new perspectives and untold stories.
              </p>
            </div>
            <motion.div 
              className="rounded-lg overflow-hidden bg-muted shadow-md scroll-animate opacity-0"
              style={{ scale, opacity, x }}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img 
                src="https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//WhatsApp%20Image%202025-03-22%20at%2011%20(1).46" 
                alt="Junglee Ghumakkad - Photographer" 
                className="w-full h-auto object-cover max-h-[60vh] md:max-h-[60vh]"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Print Section Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center scroll-animate opacity-0">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Own a Piece of the Wild</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            All photographs are available as museum-quality prints, produced using archival inks and premium papers.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
