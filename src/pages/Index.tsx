
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGalleryImages } from '@/integrations/supabase/api';
import Hero from '@/components/Hero';
import ImageGrid from '@/components/ImageGrid';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import ExpandingPanels from '@/components/ExpandingPanels';
import { Image } from '@/lib/data';

const Index = () => {
  // Fetch featured images from the database
  const { data: featuredImages = [] } = useQuery({
    queryKey: ['featured-images'],
    queryFn: () => getGalleryImages('featured')
  });

  // Format the images for the ImageGrid component
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
      
      {/* Featured Work Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 scroll-animate opacity-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif">Featured Work</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                A selection of my most celebrated photographs from around the world.
              </p>
            </div>
          </div>
          
          <div className="scroll-animate opacity-0">
            {formattedFeaturedImages.length > 0 ? (
              <ImageGrid images={formattedFeaturedImages} columns={3} />
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                Featured images will appear here soon.
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Expanding Panels Section */}
      <ExpandingPanels />
      
      {/* About Section Preview */}
      <section className="bg-muted px-6 py-[62px] my-[80px]">
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
            <div className="rounded-lg overflow-hidden bg-muted shadow-md scroll-animate opacity-0">
              {featuredImages.length > 0 ? (
                <img src={featuredImages[0].image_url} alt="Junglee Ghumakkad - Photographer" className="w-full h-auto" />
              ) : (
                <img src="/lovable-uploads/f6997cd3-02ac-462c-96c5-2e39d303511d.png" alt="Junglee Ghumakkad - Photographer" className="w-full h-auto" />
              )}
            </div>
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
