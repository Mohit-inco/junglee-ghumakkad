import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, BookOpen, FileText, Camera, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileExpandingPanels from './MobileExpandingPanels';
import { Button } from '@/components/ui/button';
interface PanelProps {
  id: number;
  title: string;
  image: string;
  link: string;
  icon?: React.ReactNode;
}
const panels: PanelProps[] = [{
  id: 1,
  title: "Print",
  image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4511.jpg",
  link: "/print",
  icon: <FileText className="w-6 h-6" />
}, {
  id: 2,
  title: "Blogs",
  image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//Print.png",
  link: "/blogs",
  icon: <BookOpen className="w-6 h-6" />
}, {
  id: 3,
  title: "About me",
  image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//About.jpg",
  link: "/about",
  icon: <Instagram className="w-6 h-6" />
}, {
  id: 4,
  title: "Street pallete",
  image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC_2451.jpg",
  link: "/gallery",
  icon: <MapPin className="w-6 h-6" />
}, {
  id: 5,
  title: "Instagram",
  image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//Insta.jpg",
  link: "https://www.instagram.com/junglee_ghumakkad/",
  icon: <Camera className="w-6 h-6" />
}];
const ExpandingPanels: React.FC = () => {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const handlePanelClick = (id: number) => {
    if (activePanel === id) {
      setActivePanel(null);
    } else {
      setActivePanel(id);
    }
  };
  const handlePanelHover = (id: number) => {
    if (!isMobile) {
      setActivePanel(id);
    }
  };

  // For touch events on mobile
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      // Handle touch interactions if needed
    };
    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);
  if (isMobile) {
    return <MobileExpandingPanels />;
  }
  return <section className="relative w-full h-[65vh] overflow-hidden bg-black max-w-6xl mx-auto rounded-lg">
      <div className="flex h-full">
        {panels.map(panel => {
        const isActive = activePanel === panel.id;
        const isPrevActive = activePanel !== null && activePanel < panel.id;
        return <div key={panel.id} className={`expanding-panel relative h-full overflow-hidden transition-all duration-700 ease-in-out cursor-pointer 
                ${isActive ? 'flex-[3]' : 'flex-1'} 
                ${isPrevActive ? 'translate-x-0' : 'translate-x-0'}`} onClick={() => handlePanelClick(panel.id)} onMouseEnter={() => handlePanelHover(panel.id)} onMouseLeave={() => setActivePanel(null)}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out" style={{
            backgroundImage: `url(${panel.image})`,
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          }} />
              
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 ease-in-out" style={{
            opacity: isActive ? 0.1 : 0.5
          }} />
              
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-white my-0 py-[19px] mx-[4px]">
                <div className={`panel-content transition-all duration-700 ease-in-out ${isActive ? 'scale-110' : 'scale-100'}`}>
                  <h3 className={`text-lg md:text-xl font-light text-center mb-4 transition-all duration-500 
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
                    {panel.title}
                  </h3>
                  
                  {isActive && <div className="flex flex-col items-center mt-6 opacity-0 animate-fade-in">
                      <Button variant="outline" className="bg-black/60 hover:bg-black/80 text-white border-white/30 hover:border-white/50 hover:scale-105" asChild>
                        <Link to={panel.link} className="flex items-center space-x-2" target={panel.title === "Instagram" ? "_blank" : undefined} rel={panel.title === "Instagram" ? "noopener noreferrer" : undefined}>
                          {panel.icon}
                          <span className="ml-2 text-xs tracking-wide">EXPLORE</span>
                        </Link>
                      </Button>
                    </div>}
                </div>
              </div>
            </div>;
      })}
      </div>
    </section>;
};
export default ExpandingPanels;
