
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { BookOpen } from 'lucide-react';

const Blogs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">Blogs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stories, insights, and adventures from behind the lens.
          </p>
        </div>
      </section>
      
      {/* Content Section - Coming Soon */}
      <section className="py-20 px-6 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl md:text-3xl font-serif mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            The blog section is currently under development. Check back soon for stories, photography tips, 
            and behind-the-scenes insights from my photography journeys.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blogs;
