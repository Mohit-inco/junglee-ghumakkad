import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BlogProps {
  coverImage: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
  galleryImages: Array<{src: string, alt: string}>;
}

export default function PhotographyExpeditionBlog({
  coverImage,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  galleryImages = []
}: BlogProps) {
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
      {/* Cover Section with Parallax */}
      <section className="relative h-screen overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${coverImage}')`,
              filter: "saturate(0.9) brightness(0.85)"
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-20 px-8 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-center mb-6 tracking-tight">
            Discovering Untold Stories
          </h1>
          <div className="w-16 h-[1px] bg-white mb-6" />
          <p className="max-w-2xl text-center text-lg md:text-xl opacity-90">
            A photographic expedition to Nelapattu Bird Sanctuary and Pulicat Lake
          </p>
        </div>
      </section>
      
      {/* Section 1 */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row">
        <div className="md:w-1/3 flex flex-col">
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src={image1} 
              alt="Nelapattu Bird Sanctuary Panoramic View"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src={image2} 
              alt="Birds in Flight at Nelapattu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:w-2/3 p-8 md:p-16 lg:p-24 flex items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              The Hidden Sanctuaries of South India
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              Our journey to Nelapattu Bird Sanctuary and Pulicat Lake was filled with anticipation. 
              These hidden gems of biodiversity in South India are often overlooked by travelers, yet 
              they host some of the most spectacular avian gatherings in the country.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              The pre-dawn departure from Chennai set the tone for our expedition - patience and 
              perseverance would be our companions. As wildlife photographers, we've learned that 
              the most breathtaking moments in nature require both preparation and patience.
            </p>
            <p className="text-lg leading-relaxed">
              Arriving at Nelapattu just as the first light painted the sky in hues of amber and 
              gold, we were immediately greeted by the distant calls of birds awakening to a new day.
            </p>
          </div>
        </div>
      </section>
      
      {/* Section 2 */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 md:p-16 lg:p-24 flex items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              The Symphony of Wings
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              Nelapattu Bird Sanctuary is relatively small at just 4.58 square kilometers, but 
              what it lacks in size, it more than makes up for in biodiversity. The sanctuary is 
              home to over 189 bird species, many of which migrate from distant lands.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              The Painted Storks were perhaps the most photogenic subjects, their distinctive 
              pink plumage and curved yellow bills creating striking silhouettes against the 
              morning sky. We watched in awe as they performed their ritualistic dances and 
              feeding techniques in the shallow waters.
            </p>
            <p className="text-lg leading-relaxed">
              Equally captivating were the Spot-billed Pelicans, gracefully gliding across the 
              water surface before dramatically plunging to catch fish. Their synchronized 
              movements created a ballet that seemed choreographed specifically for our cameras.
            </p>
          </div>
        </div>
        <div className="md:w-1/2 relative overflow-hidden">
          <motion.div 
            style={{ y: y2 }}
            className="w-full h-full md:h-[120%]"
          >
            <img 
              src={image3} 
              alt="Bird Colony at Nelapattu"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Section 3 */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row">
        <div className="md:w-1/2 relative overflow-hidden">
          <img 
            src={image4} 
            alt="Pulicat Lake Landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8 md:p-16 lg:p-24 flex items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              Pulicat Lake: Where Sky Meets Water
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              Our expedition continued to Pulicat Lake, India's second-largest brackish water lagoon. 
              Spanning across 759 square kilometers, Pulicat is a wetland of international importance, 
              recognized under the Ramsar Convention.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              The vastness of Pulicat presented different photographic challenges compared to Nelapattu. 
              Here, the compositions were more about capturing the relationship between the birds and 
              their expansive environment. The endless horizon where sky meets water became a recurring 
              theme in our photographs.
            </p>
            <p className="text-lg leading-relaxed">
              Greater Flamingos, with their iconic pink plumage, created stunning reflections on the 
              still waters of the lake. We spent hours following their movements, waiting for that 
              perfect moment when light, subject, and environment aligned in harmony.
            </p>
          </div>
        </div>
      </section>
      
      {/* Full Width Image */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 h-[80vh] relative overflow-hidden">
        <img 
          src={image5} 
          alt="Panoramic View of Birds at Pulicat Lake"
          className="w-full h-full object-cover"
        />
      </section>
      
      {/* Section 4 */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row">
        <div className="md:w-2/3 p-8 md:p-16 lg:p-24 flex items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              The Art of Patience in Wildlife Photography
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              Wildlife photography, especially bird photography, is as much about patience as it is 
              about technical skill. Throughout our expedition, we were reminded of this fundamental 
              truth. Hours would pass with no significant activity, and then, in a split second, 
              magic would unfold before our lenses.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              One such moment occurred at Pulicat as the sun began to set. A flock of Black-tailed 
              Godwits that had been feeding quietly suddenly took flight, creating a mesmerizing 
              pattern against the golden sky. Those who had packed up early missed the spectacle – 
              a reminder that in wildlife photography, perseverance often makes the difference.
            </p>
            <p className="text-lg leading-relaxed">
              We also learned the importance of understanding bird behavior. By observing patterns 
              and anticipating movements, we could position ourselves for optimal shots. This 
              knowledge helped us capture intimate moments of birds feeding, courting, and interacting 
              with their environment.
            </p>
          </div>
        </div>
        <div className="md:w-1/3 relative overflow-hidden">
          <img 
            src={image6} 
            alt="Sunset Over Pulicat Lake with Birds in Flight"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      
      {/* Favorite Clicks Section */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 bg-[#2d3e33] text-white py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-16 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
            Favorite Clicks From Our Journey
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                className="overflow-hidden rounded-md shadow-lg aspect-[4/3] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
              >
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Conclusion */}
      <section className="reveal-section opacity-0 transition-opacity duration-1000 py-24 px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 relative pb-4 inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
            The Journey Continues
          </h2>
          <p className="text-lg mb-8 leading-relaxed">
            Our expedition to Nelapattu and Pulicat was more than just a photography trip; it was 
            a reminder of the incredible biodiversity that exists in our world and the importance 
            of preserving these habitats for future generations.
          </p>
          <p className="text-lg mb-12 leading-relaxed">
            Every photograph we captured tells a story – of patience, of perfect timing, of the 
            delicate balance of nature. We hope these images inspire others to explore these 
            lesser-known sanctuaries and to develop a deeper appreciation for the winged wonders 
            that inhabit our planet.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-[#2d3e33] text-white rounded-full hover:bg-[#3d5244] transition-colors">
              Share This Journey
            </button>
            <button className="px-6 py-3 border border-[#2d3e33] text-[#2d3e33] rounded-full hover:bg-[#f0ede6] transition-colors">
              Explore More Blogs
            </button>
          </div>
        </div>
      </section>
      
      <style>{`
        .reveal-section.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
