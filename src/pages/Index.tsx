
import React from 'react';
import Hero from '@/components/Hero';
import ImageGrid from '@/components/ImageGrid';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { images, getImageSrc } from '@/lib/data';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Select a subset of images for the homepage
  const featuredImages = images.slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Work Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif">Featured Work</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                A selection of my most celebrated wildlife photographs from around the world.
              </p>
            </div>
          </div>
          
          <ImageGrid images={featuredImages} columns={3} />
        </div>
      </section>
      
      {/* About Section Preview */}
      <section className="bg-muted py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">About the Photographer</h2>
              <p className="text-muted-foreground mb-6">
                With over 15 years of experience capturing wildlife in their natural habitats, 
                I've dedicated my career to showcasing the beauty and fragility of the natural world.
              </p>
              <p className="text-muted-foreground mb-6">
                My work has been featured in National Geographic, BBC Wildlife Magazine, and numerous 
                international exhibitions, earning recognition for its intimacy and emotional impact.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center mt-2 font-medium hover:text-primary/80 transition-colors"
              >
                Read my story
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden bg-muted shadow-md">
              <img 
                src={images[1] ? getImageSrc(images[1].src) : "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1425&q=80"} 
                alt="Photographer in the field" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Print Section Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Own a Piece of the Wild</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            All photographs are available as museum-quality prints, produced using archival inks and premium papers.
          </p>
          <Link 
            to="/print" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Explore Print Options
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
