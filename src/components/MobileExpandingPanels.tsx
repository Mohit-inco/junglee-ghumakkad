
import React, { useState } from 'react';
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
    image: "/lovable-uploads/0e2ba0f0-296e-4549-92bf-6460d3329b27.png",
    link: "/print",
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 2,
    title: "Blogs",
    image: "/lovable-uploads/78c195fe-7a73-4a8a-9544-b17bff810417.png",
    link: "/blogs",
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 3,
    title: "About me",
    image: "/lovable-uploads/About.jpg", 
    link: "/about",
    icon: <Instagram className="w-5 h-5" />
  },
  {
    id: 4,
    title: "Street pallete",
    image: "/lovable-uploads/DSC_9460-2.jpg",
    link: "/gallery",
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 5,
    title: "Instagram",
    image: "/lovable-uploads/b49a2f95-d89f-4124-a032-f2a4b78eeac6.png",
    link: "https://www.instagram.com/junglee_ghumakkad/",
    icon: <Camera className="w-5 h-5" />
  }
];

const MobileExpandingPanels: React.FC = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);

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
              ${isActive ? 'h-[40vh]' : 'h-[12vh]'}`}
            onClick={() => handlePanelClick(panel.id)}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out"
              style={{ 
                backgroundImage: `url(${panel.image})`,
                transform: isActive ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 ease-in-out"
                 style={{ opacity: isActive ? 0.2 : 0.5 }} />
            
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white">
              <div className={`panel-content transition-all duration-700 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}>
                <h3 className={`text-xl font-bold text-center transition-all duration-500 
                  ${isActive ? 'opacity-100 mb-4' : 'opacity-80'}`}>
                  {panel.title}
                </h3>
                
                {isActive && (
                  <div className="flex flex-col items-center mt-4 opacity-0 animate-fade-in">
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
                        <span className="ml-2 text-sm font-medium">EXPLORE</span>
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
