import React, { useState, useEffect } from 'react';
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
    // Fixed image URL - replace with an actual direct image URL
    image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4511.jpg", // Replace with your actual image path
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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Set initially
    checkIfMobile();
    
    // Update on resize
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handlePanelClick = (id: number) => {
    if (activePanel === id) {
      setActivePanel(null);
    } else {
      setActivePanel(id);
    }
  };

  return (
    <section className="flex flex-col w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden">
      {panels.map((panel) => {
        const isActive = activePanel === panel.id;
        
        return (
          <div
            key={panel.id}
            className={`relative overflow-hidden transition-all duration-700 ease-in-out cursor-pointer 
              ${isActive ? (isMobile ? 'h-48' : 'h-96') : (isMobile ? 'h-24' : 'h-32')}`}
            onClick={() => handlePanelClick(panel.id)}
          >
            {/* Use an img element instead of background-image for better loading control */}
            <img 
              src={panel.image}
              alt={panel.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
              style={{ 
                transform: isActive ? 'scale(1.05)' : 'scale(1)'
              }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `/api/placeholder/800/600?text=${panel.title}`;
              }}
            />
            
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 ease-in-out"
                 style={{ opacity: isActive ? 0.2 : 0.5 }} />
            
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white">
              <div className={`panel-content transition-all duration-700 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}>
                <h3 className={`text-lg font-light text-center transition-all duration-500 
                  ${isActive ? 'opacity-100 mb-4' : 'opacity-80'}`}>
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
