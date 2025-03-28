
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { photographerInfo, images } from '@/lib/data';
import { Camera, Award, MapPin, Calendar, Mail, Instagram } from 'lucide-react';

const About = () => {
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
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-3 order-2 md:order-1 scroll-animate opacity-0">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">About the Photographer</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {photographerInfo.bio}
              </p>
              <div className="flex items-center space-x-6">
                <a 
                  href="mailto:mohit@jungleeghumakkad.com" 
                  className="flex items-center text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Me
                </a>
                <a 
                  href="https://instagram.com/jungleeghumakkad" 
                  className="flex items-center text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Follow on Instagram
                </a>
              </div>
            </div>
            <div className="md:col-span-2 order-1 md:order-2 flex flex-col space-y-4">
              <div className="rounded-lg overflow-hidden bg-muted shadow-md aspect-[4/5] photo-animate opacity-0">
                <img 
                  src="/lovable-uploads/d44baf47-bd29-479f-a2b2-5d89b521d032.png" 
                  alt={photographerInfo.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-muted shadow-md photo-animate opacity-0" style={{transitionDelay: '100ms'}}>
                <img 
                  src={images[15].src} 
                  alt={photographerInfo.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* My Story Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-serif mb-6 scroll-animate opacity-0">My Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                {photographerInfo.longBio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-6 leading-relaxed scroll-animate opacity-0" style={{transitionDelay: `${index * 100}ms`}}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="space-y-8">
                <div className="bg-card rounded-lg border p-6 shadow-sm scroll-animate opacity-0">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary/80" />
                    Awards & Recognition
                  </h3>
                  <ul className="space-y-3">
                    {photographerInfo.awards.map((award, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-card rounded-lg border p-6 shadow-sm scroll-animate opacity-0" style={{transitionDelay: '100ms'}}>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary/80" />
                    Exhibitions
                  </h3>
                  <ul className="space-y-3">
                    {photographerInfo.exhibitions.map((exhibition, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {exhibition}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Equipment Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-serif mb-6 scroll-animate opacity-0">My Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {name: "Canon EOS R5", desc: "Primary camera for wildlife photography"},
                {name: "Canon EF 600mm f/4L IS III USM", desc: "Primary super-telephoto lens"},
                {name: "Canon EF 100-400mm f/4.5-5.6L IS II", desc: "Versatile zoom lens for varied conditions"},
                {name: "Canon EF 24-70mm f/2.8L II USM", desc: "Standard zoom for environmental shots"},
                {name: "Gitzo GT5563GS Systematic Tripod", desc: "Carbon fiber tripod for stability"},
                {name: "Really Right Stuff BH-55 Ball Head", desc: "Professional ball head for precision"}
              ].map((item, index) => (
                <div key={index} className="bg-card rounded-lg border p-6 shadow-sm flex scroll-animate opacity-0" style={{transitionDelay: `${index * 50}ms`}}>
                  <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Locations Section */}
          <div>
            <h2 className="text-3xl font-serif mb-6 scroll-animate opacity-0">Where I've Worked</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                "Western Ghats, India",
                "Corbett National Park, India",
                "Himalayan Foothills, Uttarakhand",
                "Thar Desert, Rajasthan",
                "Sundarbans Delta, West Bengal",
                "Kaziranga National Park, Assam",
                "Andaman Islands",
                "IIT Roorkee Campus",
                "Urban Delhi",
                "Coastal Goa",
                "Backwaters, Kerala",
                "Ladakh Region"
              ].map((location, index) => (
                <div key={index} className="flex items-start scroll-animate opacity-0" style={{transitionDelay: `${index * 50}ms`}}>
                  <MapPin className="h-5 w-5 mr-2 text-primary/80 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
