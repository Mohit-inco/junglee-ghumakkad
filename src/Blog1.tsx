import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PhotographyExpeditionBlog() {
  // Refs for parallax sections
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  // Set up parallax effects using framer-motion
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [500, 1500], [0, 150]);
  const y3 = useTransform(scrollY, [1000, 2000], [0, 200]);

  // Handle reveal animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.reveal-section');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
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
              backgroundImage: "url('https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg')",
              filter: "saturate(0.9) brightness(0.85)"
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 max-w-3xl opacity-60">
            Our Photography Expedition to Nelapattu and Pulicat
          </h1>
          <p className="text-xl opacity-60">May 3, 2025</p>
        </div>
      </section>
      
      {/* Section 1: Images Left (1/3), Content Right (2/3) */}
      <section 
        ref={el => sectionRefs.current[0] = el}
        className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row"
      >
        {/* Images Stack - 1/3 width */}
        <div className="md:w-1/3 flex flex-col">
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src="https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg" 
              alt="Nelapattu Bird Sanctuary Panoramic View"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src="/api/placeholder/800/500" 
              alt="Birds in Flight at Nelapattu"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content - 2/3 width */}
        <div className="md:w-2/3 bg-[#f6f4ef] p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#2d3e33] relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#5e7e64]">
            Nelapattu Bird Sanctuary: A Panoramic Prelude
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-[#384944]">
            Our adventure began at the Nelapattu Bird Sanctuary, a haven particularly famous for its large nesting colony of Spot-billed Pelicans. The moment we ascended the sanctuary's watchtower, we were greeted by a breathtaking panorama. Below us unfolded an expansive tapestry of wetlands and dense foliage, alive with activity.
          </p>
          <p className="text-lg leading-relaxed text-[#384944]">
            This elevated vantage point offered an unparalleled view, allowing us to witness a myriad of bird species engaged in the rhythms of their daily lives – from meticulously building nests to diligently foraging for food. It was from here that we truly appreciated the scale of the sanctuary and its importance as a breeding ground. We focused our lenses on the star residents, capturing remarkable shots of pelicans soaring gracefully against the vast sky.
          </p>
        </div>
      </section>
      
      {/* Section 2: Content Left (2/3), Image Right (1/3) */}
      <section 
        ref={el => sectionRefs.current[1] = el}
        className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row"
      >
        {/* Content - 2/3 width */}
        <div className="md:w-2/3 bg-[#f6f4ef] p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#2d3e33] relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#5e7e64]">
            Pulicat Bird Sanctuary: The Quest for the Pink Tide
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-[#384944]">
            Energized by the wonders of Nelapattu, we set our sights on Pulicat Bird Sanctuary, renowned as a crucial wintering ground, particularly famous for its influx of Greater Flamingos. Anticipation built as we envisioned the iconic sight of these elegant birds painting the brackish waters pink.
          </p>
          <p className="text-lg leading-relaxed text-[#384944]">
            However, nature often holds surprises. Upon arrival, we learned that the flamingos had shifted their primary nesting areas. While the exact reasons can be complex, local information suggested increased human presence, perhaps related to the recent Flamingo Festival, might have influenced their relocation within the vast sanctuary area.
          </p>
        </div>
        
        {/* Image - 1/3 width */}
        <div className="md:w-1/3 h-[60vh] md:h-auto relative overflow-hidden order-1 md:order-2">
          <motion.div style={{ y: y2 }} className="h-[120%] w-full">
            <img 
              src="/api/placeholder/800/1200" 
              alt="Pulicat Lake Landscape"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Section 3: Images Left (1/3), Content Right (2/3) */}
      <section 
        ref={el => sectionRefs.current[2] = el}
        className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row"
      >
        {/* Images Stack - 1/3 width */}
        <div className="md:w-1/3 flex flex-col">
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src="/api/placeholder/800/500" 
              alt="Painted Storks at Pulicat"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src="/api/placeholder/800/500" 
              alt="Seagulls and Pelicans"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content - 2/3 width */}
        <div className="md:w-2/3 bg-[#f6f4ef] p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#2d3e33] relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#5e7e64]">
            Beyond the Pink: Discovering Pulicat's Other Treasures
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-[#384944]">
            Despite the unexpected absence of the large flamingo flocks in the most accessible areas, our spirits remained high. Pulicat is far more than just flamingos, and the sanctuary quickly unveiled a plethora of other avian wonders that held us spellbound:
          </p>
          <div className="mb-6 pl-4 border-l-2 border-[#5e7e64]/30">
            <p className="text-lg leading-relaxed mb-4 text-[#384944]">
              <span className="font-medium text-[#3d5d43]">Painted Storks:</span> We observed these majestic birds wading with purpose through the shallow backwaters, their vibrant plumage standing out as they patiently searched for their next meal.
            </p>
            <p className="text-lg leading-relaxed text-[#384944]">
              <span className="font-medium text-[#3d5d43]">Seagulls and Pelicans:</span> Flocks of seagulls crisscrossed the sky, while familiar pelicans glided across the water's surface – a constant reminder of the sanctuary's role as a vital habitat supporting diverse species.
            </p>
          </div>
          <p className="text-lg leading-relaxed text-[#384944]">
            The landscape itself was a picture of tranquility and natural beauty – vast stretches of shallow water interspersed with patches of lush, verdant vegetation, creating a peaceful backdrop for our observations.
          </p>
        </div>
      </section>
      
      {/* Section 4: Content Left (2/3), Image Right (1/3) */}
      <section 
        ref={el => sectionRefs.current[3] = el}
        className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row"
      >
        {/* Content - 2/3 width */}
        <div className="md:w-2/3 bg-[#f6f4ef] p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#2d3e33] relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#5e7e64]">
            Reflections on Nature's Ingenuity: Evolution in Action
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-[#384944]">
            Our time observing these incredible creatures prompted profound reflections on the marvels of evolution and adaptation. The distinctive features of various bird species are not mere aesthetic traits, but perfect examples of nature's ingenious problem-solving:
          </p>
          <div className="mb-6 pl-4 border-l-2 border-[#5e7e64]/30">
            <p className="text-lg leading-relaxed mb-4 text-[#384944]">
              <span className="font-medium text-[#3d5d43]">Spoonbills:</span> Their uniquely flattened, spoon-shaped bills are perfectly designed tools, ideal for sweeping through mudflats and shallow water to filter out small prey.
            </p>
            <p className="text-lg leading-relaxed mb-4 text-[#384944]">
              <span className="font-medium text-[#3d5d43]">Pelicans:</span> The famous expansive throat pouches aren't just for show; they are incredibly efficient mechanisms for scooping up water and fish, before the water is expertly drained away.
            </p>
            <p className="text-lg leading-relaxed text-[#384944]">
              <span className="font-medium text-[#3d5d43]">Ibises:</span> Their slender, downward-curving beaks are specialized probes, perfect for digging into soft soil or mud to extract insects and invertebrates hidden beneath the surface.
            </p>
          </div>
        </div>
        
        {/* Image - 1/3 width */}
        <div className="md:w-1/3 h-[60vh] md:h-auto relative overflow-hidden order-1 md:order-2">
          <motion.div style={{ y: y3 }} className="h-[120%] w-full">
            <img 
              src="/api/placeholder/800/1200" 
              alt="Close-up of Bird Features"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Section 5: Final Images Left (1/3), Content Right (2/3) */}
      <section 
        ref={el => sectionRefs.current[4] = el}
        className="reveal-section opacity-0 transition-opacity duration-1000 min-h-screen flex flex-col md:flex-row"
      >
        {/* Images Stack - 1/3 width */}
        <div className="md:w-1/3 flex flex-col">
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src="/api/placeholder/800/500" 
              alt="Nelapattu Landscape"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[50vh] md:h-1/2 relative overflow-hidden">
            <img 
              src="/api/placeholder/800/500" 
              alt="Bird Watching at Pulicat"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content - 2/3 width */}
        <div className="md:w-2/3 bg-[#f6f4ef] p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-[#2d3e33] relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#5e7e64]">
            Concluding Thoughts: An Unforgettable Encounter
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-[#384944]">
            Our expedition through the Nelapattu and Pulicat Bird Sanctuaries, though it held an unexpected twist at Pulicat, was a truly profound journey into the heart of nature's splendor. It enriched our understanding of avian life, its incredible adaptations, and the critical importance of preserving these natural sanctuaries.
          </p>
          <p className="text-lg leading-relaxed mb-6 text-[#384944]">
            For anyone passionate about birdwatching, nature photography, or simply experiencing the wild beauty of India's ecosystems, these sanctuaries offer invaluable insights and unforgettable encounters with our feathered friends.
          </p>
          <p className="text-lg leading-relaxed text-[#384944]">
            <span className="font-medium">A Note for Future Visitors:</span> While spontaneity is great, a little planning goes a long way. Checking local guidelines, seasonal bird migrations, and festival schedules before your visit can help optimize your experience and ensure minimal disturbance to the incredible wildlife that calls these places home.
          </p>
        </div>
      </section>
      
      {/* Favorite Clicks Section */}
      <section 
        ref={el => sectionRefs.current[5] = el}
        className="reveal-section opacity-0 transition-opacity duration-1000 bg-[#2d3e33] text-white py-24 px-8"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-16 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
            Favorite Clicks From Our Journey
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: "/api/placeholder/600/400", alt: "Pelican in Flight" },
              { src: "/api/placeholder/600/400", alt: "Painted Stork" },
              { src: "/api/placeholder/600/400", alt: "Nelapattu Panorama" },
              { src: "/api/placeholder/600/400", alt: "Ibis Feeding" },
              { src: "/api/placeholder/600/400", alt: "Pulicat Lake Sunset" },
              { src: "/api/placeholder/600/400", alt: "Bird in Natural Habitat" }
            ].map((img, i) => (
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
      
      <footer className="bg-[#2d3e33] text-white/80 text-center py-8 px-4 text-sm border-t border-white/10">
        <p>© 2025 Photography Expedition Blog | All images by Pankaj Adhikary and Team</p>
      </footer>
      
      <style jsx global>{`
        .reveal-section.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
