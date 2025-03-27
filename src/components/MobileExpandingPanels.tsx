
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, BookOpen, FileText, Camera, MapPin } from 'lucide-react';

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
    title: "PRINTS",
    image: "/lovable-uploads/d44baf47-bd29-479f-a2b2-5d89b521d032.png",
    link: "/print",
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 2,
    title: "BLOGS",
    image: "/lovable-uploads/147b0bde-3442-427e-9887-b90b89dd512b.png",
    link: "/gallery",
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 3,
    title: "TIGER'S DIRECTORY",
    image: "/lovable-uploads/5585f3be-0c31-4a9d-8fb1-72d97dd2ba56.png", 
    link: "/about",
    icon: <Instagram className="w-5 h-5" />
  },
  {
    id: 4,
    title: "BOOK YOUR OWN TRIP",
    image: "/lovable-uploads/96658d4c-fd6e-4225-8d2b-7a0706abf2db.png",
    link: "/gallery",
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 5,
    title: "WORKSHOPS",
    image: "/lovable-uploads/4620b1a4-fff2-4ff5-9326-053c13f07bd5.png",
    link: "/gallery",
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
    <section className="flex flex-col w-full bg-black">
      {panels.map((panel) => {
        const isActive = activePanel === panel.id;
        
        return (
          <div
            key={panel.id}
            className={`relative overflow-hidden transition-all duration-700 ease-in-out cursor-pointer 
              ${isActive ? 'h-[40vh]' : 'h-[20vh]'}`}
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
                <h3 className={`text-2xl font-bold text-center transition-all duration-500 
                  ${isActive ? 'opacity-100 mb-4' : 'opacity-80'}`}>
                  {panel.title}
                </h3>
                
                {isActive && (
                  <div className="flex flex-col items-center mt-4 animate-fade-in">
                    <Link 
                      to={panel.link}
                      className="bg-black/60 hover:bg-black/80 text-white px-5 py-2 rounded-md 
                               flex items-center space-x-2 transition-all duration-300"
                    >
                      {panel.icon}
                      <span className="text-sm font-medium">EXPLORE</span>
                    </Link>
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
