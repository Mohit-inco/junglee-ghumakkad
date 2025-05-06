import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface BlogContent {
  title: string;
  subtitle: string;
  coverImage: string;
  sections: BlogSection[];
  galleryImages: Array<{src: string, alt: string}>;
  author?: string;
  date?: string;
}

export interface BlogSection {
  type: 'text' | 'image' | 'image-text' | 'text-image' | 'full-width-image' | 'gallery' | 'conclusion';
  title?: string;
  content?: string[];
  image?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  layout?: 'one-third-two-thirds' | 'two-thirds-one-third' | 'half-half' | 'full';
  galleryImages?: Array<{src: string, alt: string}>;
}

interface BlogTemplateProps {
  content: BlogContent;
}

export default function BlogTemplate({ content }: BlogTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Parallax effect values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.1
    });
    
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-x-hidden bg-[#f6f4ef] text-[#2d3e33] font-sans">
      {/* Close button that matches the bg color */}
      <button className="fixed top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f4ef] text-[#2d3e33] shadow-md hover:bg-[#e8e5df] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Cover Section with Parallax - Now touches the top */}
      <section className="relative h-screen overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${content.coverImage}')`,
              filter: "saturate(0.9) brightness(0.85)"
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-20 px-8 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-center mb-6 tracking-tight">
            {content.title}
          </h1>
          <div className="w-16 h-[1px] bg-white mb-6" />
          <p className="max-w-2xl text-center text-lg md:text-xl opacity-90">
            {content.subtitle}
          </p>
        </div>
      </section>
      
      {/* Render dynamic sections based on content */}
      {content.sections.map((section, index) => {
        if (section.type === 'text') {
          return (
            <section key={index} className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex items-center py-16 px-8">
              <div className="max-w-4xl mx-auto">
                {section.title && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
                    {section.title}
                  </h2>
                )}
                {section.content && section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-lg mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          );
        }
        
        if (section.type === 'image-text') {
          // Create a unique scrollYProgress for each section
          const sectionRef = useRef<HTMLDivElement>(null);
          const { scrollYProgress: sectionScrollProgress } = useScroll({
            target: sectionRef,
            offset: ["start end", "end start"]
          });
          
          // Create parallax effect for this section
          const sectionParallax = useTransform(sectionScrollProgress, [0, 1], [0, 100]);

          return (
            <section ref={sectionRef} key={index} className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row">
              <div className={section.layout === 'one-third-two-thirds' ? 'md:w-1/3' : (section.layout === 'half-half' ? 'md:w-1/2' : 'md:w-2/3')}>
                {section.image && (
                  <div className="h-[50vh] md:h-full relative overflow-hidden">
                    <motion.div 
                      style={{ y: sectionParallax }}
                      className="w-full h-[120%]"
                    >
                      <img 
                        src={section.image} 
                        alt={section.imageAlt || ''} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                )}
              </div>
              <div className={section.layout === 'one-third-two-thirds' ? 'md:w-2/3' : (section.layout === 'half-half' ? 'md:w-1/2' : 'md:w-1/3')}>
                <div className="p-8 md:p-16 lg:p-24 flex items-center h-full">
                  <div>
                    {section.title && (
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
                        {section.title}
                      </h2>
                    )}
                    {section.content && section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-lg mb-6 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }
        
        if (section.type === 'text-image') {
          // Create a unique scrollYProgress for each section
          const sectionRef = useRef<HTMLDivElement>(null);
          const { scrollYProgress: sectionScrollProgress } = useScroll({
            target: sectionRef,
            offset: ["start end", "end start"]
          });
          
          // Create parallax effect for this section
          const sectionParallax = useTransform(sectionScrollProgress, [0, 1], [0, 100]);

          return (
            <section ref={sectionRef} key={index} className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row">
              <div className={section.layout === 'two-thirds-one-third' ? 'md:w-2/3' : (section.layout === 'half-half' ? 'md:w-1/2' : 'md:w-1/3')}>
                <div className="p-8 md:p-16 lg:p-24 flex items-center h-full">
                  <div>
                    {section.title && (
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
                        {section.title}
                      </h2>
                    )}
                    {section.content && section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-lg mb-6 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className={section.layout === 'two-thirds-one-third' ? 'md:w-1/3' : (section.layout === 'half-half' ? 'md:w-1/2' : 'md:w-2/3')}>
                {section.image && (
                  <div className="relative overflow-hidden h-[50vh] md:h-full">
                    <motion.div 
                      style={{ y: sectionParallax }}
                      className="w-full h-full md:h-[120%]"
                    >
                      <img 
                        src={section.image}
                        alt={section.imageAlt || ''}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            </section>
          );
        }
        
        if (section.type === 'full-width-image') {
          // Create a unique scrollYProgress for this section
          const fullWidthRef = useRef<HTMLDivElement>(null);
          const { scrollYProgress: fullWidthScrollProgress } = useScroll({
            target: fullWidthRef,
            offset: ["start end", "end start"]
          });
          
          // Create parallax effect for this section
          const fullWidthParallax = useTransform(fullWidthScrollProgress, [0, 1], [0, 150]);

          return (
            <section ref={fullWidthRef} key={index} className="reveal-section opacity-0 transition-opacity duration-1000 h-[80vh] relative overflow-hidden">
              {section.image && (
                <motion.div 
                  style={{ y: fullWidthParallax }}
                  className="absolute inset-0 w-full h-[120%]"
                >
                  <img 
                    src={section.image} 
                    alt={section.imageAlt || ''}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </section>
          );
        }
        
        if (section.type === 'gallery') {
          return (
            <section key={index} className="reveal-section opacity-0 transition-opacity duration-1000 bg-[#2d3e33] text-white py-24 px-8">
              <div className="max-w-6xl mx-auto">
                {section.title && (
                  <h2 className="text-3xl md:text-4xl font-light mb-16 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
                    {section.title}
                  </h2>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {content.galleryImages.map((img, i) => {
                    // Create individual parallax effects for gallery images
                    const galleryItemRef = useRef<HTMLDivElement>(null);
                    const { scrollYProgress: galleryItemProgress } = useScroll({
                      target: galleryItemRef,
                      offset: ["start end", "end start"]
                    });
                    
                    // Subtle hover effect to prevent too much movement
                    const galleryParallax = useTransform(galleryItemProgress, [0, 1], [0, 50]);

                    return (
                      <div 
                        ref={galleryItemRef}
                        key={i} 
                        className="overflow-hidden rounded-md shadow-lg aspect-[4/3] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                      >
                        <motion.div
                          style={{ y: galleryParallax }}
                          className="w-full h-[110%]"
                        >
                          <img 
                            src={img.src} 
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }
        
        if (section.type === 'conclusion') {
          return (
            <section key={index} className="reveal-section opacity-0 transition-opacity duration-1000 py-24 px-8 bg-white">
              <div className="max-w-3xl mx-auto text-center">
                {section.title && (
                  <h2 className="text-3xl md:text-4xl font-light mb-8 relative pb-4 inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
                    {section.title}
                  </h2>
                )}
                {section.content && section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-lg mb-8 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <button className="px-6 py-3 bg-[#2d3e33] text-white rounded-full hover:bg-[#3d5244] transition-colors">
                    Share This Journey
                  </button>
                  <button className="px-6 py-3 border border-[#2d3e33] text-[#2d3e33] rounded-full hover:bg-[#f0ede6] transition-colors">
                    Explore More Blogs
                  </button>
                </div>
              </div>
            </section>
          );
        }
        
        return null;
      })}
      
      <style>{`
        .reveal-section.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
