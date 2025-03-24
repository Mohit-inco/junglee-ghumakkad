
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import ImageGrid from '@/components/ImageGrid';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { images } from '@/lib/data';

const Index = () => {
  // Select a subset of images for the homepage - using images 1, 10, 13 for variety
  const featuredImages = [images[0], images[9], images[12]]; 
  
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
            <ImageGrid images={featuredImages} columns={3} />
          </div>
        </div>
      </section>
      
      {/* About Section Preview */}
      <section className="bg-muted py-20 px-6">
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
              <img 
                src={images[15].src} 
                alt="Junglee Ghumakkad - Photographer" 
                className="w-full h-auto"
              />
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
