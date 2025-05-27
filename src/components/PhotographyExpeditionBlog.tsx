import React from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface ImageData {
  src: string;
  alt: string;
  height: number;
  width: number;
  parallaxValue?: number;
}

const PhotographyExpeditionBlog = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const [isCopied, setIsCopied] = React.useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Parallax effect value for cover image
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 400]);

  // Blog data with single images per section
  const blogData = {
    coverImage: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC06581.jpg",
      alt: "Cover image of Nellapattu Bird Sanctuary",
      height: 1080,
      width: 1920,
      parallaxValue: 0.5
    },
    // Section 1 images
    image1: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4506.jpg",
      alt: "Nellapattu Bird Sanctuary - Main View",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    image2: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_3338.jpg",
      alt: "Nellapattu Bird Sanctuary - Bird Colony",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    // Section 2 images
    image3: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4355-2.jpg",
      alt: "Nellapattu Bird Sanctuary - Watchtower View",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    image4: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_3326(1).jpg",
      alt: "Nellapattu Bird Sanctuary - Bird Activity",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    // Section 3 images
    image5: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC06666-3.jpg",
      alt: "Pulicat Bird Sanctuary - Sunset View",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    image6: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced.jpg.png",
      alt: "Pulicat Bird Sanctuary - Local Life",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    // Section 4 images
    image7: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4511.jpg",
      alt: "Bird Sanctuary - Portrait View",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    image8: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4456.jpg",
      alt: "Bird Sanctuary - Landscape View 1",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    image9: {
      src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4617.jpg",
      alt: "Bird Sanctuary - Landscape View 2",
      height: 1080,
      width: 1920,
      parallaxValue: 0.3
    },
    galleryImages: [
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4506.jpg",
        alt: "Gallery image 1",
        height: 1080,
        width: 1920
      },
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_3338.jpg",
        alt: "Gallery image 2",
        height: 1080,
        width: 1920
      },
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4355-2.jpg",
        alt: "Gallery image 3",
        height: 1080,
        width: 1920
      },
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC06581.jpg",
        alt: "Gallery image 3",
        height: 1080,
        width: 1920
      },
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_4484.jpg",
        alt: "Gallery image 3",
        height: 1080,
        width: 1920
      },
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//IMG_3363.jpg",
        alt: "Gallery image 3",
        height: 1080,
        width: 1920
      },
      {
        src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//DSC06298.jpg",
        alt: "Gallery image 3",
        height: 1080,
        width: 1920
      }
    ]
  };

  const [currentImage, setCurrentImage] = React.useState(0);

  return (
    <div ref={containerRef} className="overflow-x-hidden bg-[#f6f4ef] text-[#2d3e33] font-sans">
      {/* Cover Section with Parallax */}
      <section className="relative mb-10 h-screen overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${blogData.coverImage.src}')`,
              filter: "saturate(0.9) brightness(0.85)"
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-20 px-8 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-center mb-6 tracking-tight">
            An Expedition to Nellapattu and Pulicat Bird Sanctuaries
          </h1>
          <div className="w-16 h-[1px] bg-white mb-6" />
          <p className="max-w-2xl text-center text-lg md:text-xl opacity-90">
            A thrilling photography adventure into the heart of avian life and conservation
          </p>
        </div>
      </section>

      {/* Section 1 */}
      <motion.section 
        className="h-screen mb-10 flex flex-col md:flex-row overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="md:w-[40%] flex flex-col h-full">
          <div className="h-1/2 relative overflow-hidden">
            <motion.img 
              src={blogData.image1.src} 
              alt={blogData.image1.alt}
              style={{ height: '100%', width: '100%' }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="h-1/2 relative overflow-hidden">
            <motion.img 
              src={blogData.image2.src} 
              alt={blogData.image2.alt}
              style={{ height: '100%', width: '100%' }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="md:w-[60%] p-8 md:p-12 lg:p-16 flex items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              The Journey Begins
            </h2>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              My expedition to the Nellapattu Bird Sanctuary was a mesmerizing journey into the heart of avian life. The morning bus ride from Tirupati to Nellapattu filled me with anticipation, and upon arrival, I was greeted by a breathtaking spectacle of thousands of birds living harmoniously in their natural habitat.
            </p>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              The nesting colony of Spot-billed Pelicans was a sight to behold, with Pelicans, Egrets, Ibis, Asian Openbill Storks, and spoonbills gracefully going about their daily activities.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              My photography partner, Pankaj Adhikary, who is well-versed in biodiversity, enhanced our expedition by sharing valuable insights on the various bird species we encountered.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Section 2 */}
      <motion.section 
        className="h-screen mb-10 flex flex-col md:flex-row overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="md:w-[60%] p-8 md:p-12 lg:p-16 flex items-center order-2 md:order-1">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              Nellapattu Bird Sanctuary
            </h2>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              As we ascended the sanctuary's watchtower, a panoramic view of wetlands and vibrant foliage unfolded before us, teeming with avian life. From this elevated perch, we meticulously studied the flight patterns and behaviors of the pelicans, capturing awe-inspiring shots that showcased the magnificence of these creatures.
            </p>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              The experience of witnessing the pelicans soar through the air was truly captivating, and I eagerly immortalized these moments through my camera lens.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              The diversity of species was remarkable - from elegant Egrets to distinctive Asian Openbill Storks with their unique beaks.
            </p>
          </div>
        </div>
        <div className="md:w-[40%] flex flex-col h-full order-1 md:order-2">
          <div className="h-1/2 relative overflow-hidden">
            <motion.img 
              src={blogData.image3.src} 
              alt={blogData.image3.alt}
              style={{ height: '100%', width: '100%' }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="h-1/2 relative overflow-hidden">
            <motion.img 
              src={blogData.image2.src} 
              alt={blogData.image2.alt}
              style={{ height: '100%', width: '100%' }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 3 */}
      <motion.section 
        className="h-screen mb-10 flex flex-col md:flex-row overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="md:w-[60%] p-8 md:p-12 lg:p-16 flex items-center order-2 md:order-2">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              Pulicat Bird Sanctuary
            </h2>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              Our journey continued to the Pulicat Bird Sanctuary, where the excitement of the ongoing Flamingo Festival permeated the air. However, our anticipation shifted to curiosity upon learning that the nesting spots of the Greater Flamingos had relocated within the sanctuary, potentially due to increased human presence attracted by the festival.
            </p>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              Despite this unforeseen development, the sanctuary revealed a diverse tapestry of bird species that left us spellbound. Wading through the shallow backwaters, I found myself in awe of the pelicans' formidable paws and the diligent foraging of the charming Sanderlings.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Observing these creatures up close underscored the intricate beauty and adaptive features that define avian life.
            </p>
          </div>
        </div>
        <div className="md:w-[40%] flex flex-col h-full order-1 md:order-1">
          <div className="h-1/2 relative overflow-hidden">
            <motion.img 
              src={blogData.image5.src} 
              alt={blogData.image5.alt}
              style={{ height: '100%', width: '100%' }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="h-1/2 relative overflow-hidden">
            <motion.img 
              src={blogData.image6.src} 
              alt={blogData.image6.alt}
              style={{ height: '100%', width: '100%' }}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Section 4 */}
      <motion.section 
        className="h-screen mb-10 flex flex-col md:flex-row overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="md:w-[40%] p-8 md:p-12 lg:p-16 flex items-center order-2 md:order-1">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
              Nature's Ingenious Designs
            </h2>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              The intricacies of bird species' specialized features, from the flattened bills of Spoonbills to the expansive pouches of Pelicans and the slender beaks of Ibises, served as a testament to nature's remarkable problem-solving abilities.
            </p>
            <p className="text-base md:text-lg mb-4 leading-relaxed">
              Each adaptation showcased the ingenuity and elegance of evolution in creating perfectly suited tools for survival in the avian world.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Through my lens, I captured not just their beauty, but the remarkable engineering that allows them to thrive in their natural habitat.
            </p>
          </div>
        </div>
        <div className="md:w-[60%] flex flex-col h-full order-1 md:order-2">
          <div className="flex h-full">
            {/* Portrait image on the left */}
            <div className="w-1/2 h-full relative overflow-hidden">
              <motion.img 
                src={blogData.image7.src} 
                alt={blogData.image7.alt}
                style={{ height: '100%', width: '100%' }}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {/* Two landscape images stacked on the right */}
            <div className="w-1/2 flex flex-col">
              <div className="h-1/2 relative overflow-hidden">
                <motion.img 
                  src={blogData.image8.src} 
                  alt={blogData.image8.alt}
                  style={{ height: '100%', width: '100%' }}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="h-1/2 relative overflow-hidden">
                <motion.img 
                  src={blogData.image9.src} 
                  alt={blogData.image9.alt}
                  style={{ height: '100%', width: '100%' }}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section 
        className="h-screen mb-10 p-3 bg-[#2d3e33] text-white overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
            Visual Journey Into Nature's Heart
          </h2>
          
          <div className="relative flex-grow flex items-center justify-center">
            <motion.div 
              className="w-[80%] h-[80%] relative mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {blogData.galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ 
                    opacity: currentImage === i ? 1 : 0, 
                    x: currentImage === i ? 0 : 100,
                    transition: { duration: 0.5 }
                  }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <img 
                    src={img.src} 
                    alt={img.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {blogData.galleryImages.map((_, i) => (
                <button
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/50 hover:bg-white transition-colors"
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
              onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : blogData.galleryImages.length - 1))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
              onClick={() => setCurrentImage((prev) => (prev < blogData.galleryImages.length - 1 ? prev + 1 : 0))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </motion.section>

      {/* Conclusion */}
      <motion.section 
        className="h-screen pb-[25px] bg-white overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-[#a3c6a9]">
            Embracing the Experience
          </h2>
          <p className="text-base md:text-lg mb-6 leading-relaxed text-center">
            While the absence of the iconic flamingo flocks in accessible areas at the Pulicat Bird Sanctuary was unexpected, the entirety of the expedition was a captivating exploration into the wonders of avian life. It deepened my appreciation for the splendor of nature and reinforced the critical importance of preserving these sanctuaries as havens for diverse wildlife.
          </p>
          <p className="text-base md:text-lg mb-8 leading-relaxed text-center">
            In conclusion, this enriching journey served as a poignant reminder of the necessity of conservation efforts in safeguarding our precious ecosystems. For all enthusiasts of birdwatching, nature photography, or those seeking an immersion in India's wild beauty, Nellapattu and Pulicat Bird Sanctuaries offer unparalleled opportunities for unforgettable encounters with our feathered friends. May this visual voyage inspire others to cherish and protect the natural world that surrounds us.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleShare}
              className="px-6 py-3 bg-[#2d3e33] text-white rounded-full hover:bg-[#3d5244] transition-colors flex items-center space-x-2"
            >
              <span>{isCopied ? 'Copied!' : 'Share This Journey'}</span>
              {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              )}
            </button>
            <button className="px-6 py-3 border border-[#2d3e33] text-[#2d3e33] rounded-full hover:bg-[#f0ede6] transition-colors">
              Explore More Sanctuaries
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PhotographyExpeditionBlog;