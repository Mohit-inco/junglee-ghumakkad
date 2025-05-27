import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, BookOpen, FileText, Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanelProps {
  id: number;
  title: string;
  image: string;
  link: string;
  icon?: React.ReactNode;
}

const panels: PanelProps[] = [
  {
    id: 1,
    title: "Print",
    image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4511.jpg",
    link: "/print",
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 2,
    title: "Blogs",
    image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//Print.png",
    link: "/blogs",
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 3,
    title: "About me",
    image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//About.jpg",
    link: "/about",
    icon: <Instagram className="w-5 h-5" />
  },
  {
    id: 4,
    title: "Street pallete",
    image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC_2451.jpg",
    link: "/gallery",
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 5,
    title: "Instagram",
    image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC_0319%20(3).png",
    link: "https://www.instagram.com/junglee_ghumakkad/",
    icon: <Camera className="w-5 h-5" />
  }
];

const MobileExpandingPanels: React.FC = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const rafId = useRef<number>();
  const resizeTimeout = useRef<NodeJS.Timeout>();

  // Memoized panel click handler
  const handlePanelClick = useCallback((id: number) => {
    if (activePanel === id) {
      setActivePanel(null);
    } else {
      setActivePanel(id);
    }
  }, [activePanel]);

  // Handle image load
  const handleImageLoad = useCallback((id: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  }, []);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }
    resizeTimeout.current = setTimeout(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 100);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleResize]);

  // Preload images
  useEffect(() => {
    panels.forEach(panel => {
      const img = new Image();
      img.src = panel.image;
      img.onload = () => handleImageLoad(panel.id);
      img.onerror = () => {
        console.error(`Failed to load image: ${panel.image}`);
        handleImageLoad(panel.id); // Mark as loaded even on error to show fallback
      };
    });
  }, [handleImageLoad]);

  return (
    <section className="flex flex-col w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden">
      {panels.map(panel => {
        const isActive = activePanel === panel.id;
        const isLoaded = loadedImages[panel.id];
        
        return (
          <div
            key={panel.id}
            className={`relative overflow-hidden transition-all duration-700 ease-in-out cursor-pointer 
              ${isActive ? (isMobile ? 'h-48' : 'h-96') : (isMobile ? 'h-24' : 'h-32')}`}
            onClick={() => handlePanelClick(panel.id)}
            style={{ willChange: 'height' }}
          >
            {/* Loading placeholder */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-900 animate-pulse" />
            )}

            {/* Image */}
            <img 
              src={panel.image}
              alt={panel.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
              style={{ 
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                willChange: 'transform',
                opacity: isLoaded ? 1 : 0
              }}
              loading="lazy"
              decoding="async"
            />
            
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/40 transition-opacity duration-500 ease-in-out"
              style={{ 
                opacity: isActive ? 0.2 : 0.5,
                willChange: 'opacity'
              }}
            />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white">
              <div 
                className={`panel-content transition-all duration-700 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}
                style={{ willChange: 'transform' }}
              >
                <h3 
                  className={`text-lg font-light text-center transition-all duration-500 
                    ${isActive ? 'opacity-100 mb-4' : 'opacity-80'}`}
                >
                  {panel.title}
                </h3>
                
                {isActive && (
                  <div className="flex flex-col items-center mt-4 animate-fade-in">
                    <Button 
                      variant="outline"
                      className="bg-black/60 hover:bg-black/80 text-white border-white/30 hover:border-white/50"
                      asChild
                    >
                      <Link 
                        to={panel.link}
                        className="flex items-center space-x-2"
                        target={panel.title === "Instagram" ? "_blank" : undefined}
                        rel={panel.title === "Instagram" ? "noopener noreferrer" : undefined}
                      >
                        {panel.icon}
                        <span className="ml-2 text-xs tracking-wide">EXPLORE</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default MobileExpandingPanels;
