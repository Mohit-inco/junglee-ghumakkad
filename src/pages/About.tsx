
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { photographerInfo } from '@/lib/data';
import { Camera, Award, MapPin, Calendar, Mail, Instagram } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-3 order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-serif mb-6">About the Photographer</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {photographerInfo.bio}
              </p>
              <div className="flex items-center space-x-6">
                <a 
                  href="mailto:alex@wildframephotography.com" 
                  className="flex items-center text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Me
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Follow on Instagram
                </a>
              </div>
            </div>
            <div className="md:col-span-2 order-1 md:order-2">
              <div className="rounded-lg overflow-hidden bg-muted shadow-md aspect-[4/5]">
                <img 
                  src={photographerInfo.profileImage} 
                  alt={photographerInfo.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* My Story Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-serif mb-6">My Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                {photographerInfo.longBio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="space-y-8">
                <div className="bg-card rounded-lg border p-6 shadow-sm">
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
                
                <div className="bg-card rounded-lg border p-6 shadow-sm">
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
            <h2 className="text-3xl font-serif mb-6">My Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border p-6 shadow-sm flex">
                <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Canon EOS R5</h3>
                  <p className="text-sm text-muted-foreground">Primary camera for wildlife photography</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm flex">
                <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Canon EF 600mm f/4L IS III USM</h3>
                  <p className="text-sm text-muted-foreground">Primary super-telephoto lens</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm flex">
                <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Canon EF 100-400mm f/4.5-5.6L IS II</h3>
                  <p className="text-sm text-muted-foreground">Versatile zoom lens for varied conditions</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm flex">
                <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Canon EF 24-70mm f/2.8L II USM</h3>
                  <p className="text-sm text-muted-foreground">Standard zoom for environmental shots</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm flex">
                <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Gitzo GT5563GS Systematic Tripod</h3>
                  <p className="text-sm text-muted-foreground">Carbon fiber tripod for stability</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6 shadow-sm flex">
                <Camera className="h-6 w-6 mr-4 text-primary/80 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Really Right Stuff BH-55 Ball Head</h3>
                  <p className="text-sm text-muted-foreground">Professional ball head for precision</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Locations Section */}
          <div>
            <h2 className="text-3xl font-serif mb-6">Where I've Worked</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                "Serengeti National Park, Tanzania",
                "Masai Mara, Kenya",
                "Okavango Delta, Botswana",
                "Svalbard, Norway",
                "Yellowstone National Park, USA",
                "Pantanal, Brazil",
                "Borneo Rainforest, Malaysia",
                "Great Barrier Reef, Australia",
                "Antarctic Peninsula",
                "Arctic National Wildlife Refuge, Alaska",
                "Galapagos Islands, Ecuador",
                "Costa Rican Cloud Forests"
              ].map((location, index) => (
                <div key={index} className="flex items-start">
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
