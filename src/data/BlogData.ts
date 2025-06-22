import { BlogContent } from '@/lib/data';

export interface ImageData {
  src: string;
  alt: string;
}

export interface GalleryImageData {
  src: string;
  alt: string;
}

export interface BlogSection {
  type: 'text' | 'image';
  content: string[];
}

export const blog1: BlogContent = {
  title: "Nelapattu & Pulicat Expedition",
  subtitle: "A bird photography expedition to Nelapattu and Pulicat",
  coverImage: {
    src: "/images/blogs/blog1/cover.jpeg",
    alt: "Nelapattu & Pulicat Expedition Cover",
  },
  author: "Naveen Kumar",
  date: "2024-01-27",
  sections: [
    {
      type: "text",
      content: [
        "Embarking on a bird photography expedition to Nelapattu and Pulicat was an experience filled with anticipation and excitement. As a passionate photographer, the opportunity to capture the avian wonders of these unique ecosystems was a dream come true.",
        "Nelapattu Bird Sanctuary, located in Andhra Pradesh, is a haven for migratory birds. During the winter months, it becomes a bustling hub for various species, including pelicans, painted storks, and flamingos. The sheer number of birds that flock to this sanctuary is a sight to behold.",
        "Pulicat Lake, on the other hand, is a brackish water lagoon that stretches across Andhra Pradesh and Tamil Nadu. It's a crucial habitat for migratory birds and offers a different perspective on avian life. The lake's serene beauty and diverse ecosystem make it an ideal location for bird photography.",
        "The journey began with meticulous planning and preparation. I researched the best time to visit, the species to expect, and the equipment needed. Armed with my camera, lenses, and a sense of adventure, I set off to explore these avian paradises.",
      ],
    },
    {
      type: "text",
      content: [
        "Nelapattu Bird Sanctuary welcomed me with open wings. The air was filled with the cacophony of bird calls, and the trees were adorned with nests. Pelicans gracefully soared through the sky, while painted storks elegantly waded in the water. It was a photographer's dream come true.",
        "I spent hours observing and capturing these magnificent creatures. The challenge was to freeze their fleeting moments in time. Whether it was a pelican diving for fish or a stork preening its feathers, each shot told a story of survival and adaptation.",
        "Pulicat Lake offered a different set of challenges. The vast expanse of water required patience and a keen eye. Flamingos gracefully danced on the horizon, creating a mesmerizing spectacle. I experimented with different angles and compositions to capture their ethereal beauty.",
        "The local communities around Nelapattu and Pulicat have a deep connection with these birds. They understand the importance of conservation and work tirelessly to protect their habitats. Their knowledge and insights were invaluable in understanding the behavior of these birds.",
      ],
    },
    {
      type: "text",
      content: [
        "As the expedition drew to a close, I reflected on the incredible experiences and the lessons learned. Bird photography is not just about capturing images; it's about understanding and appreciating the natural world. It's about raising awareness and inspiring others to protect these fragile ecosystems.",
        "The bird photography expedition to Nelapattu and Pulicat was a journey of discovery and inspiration. It reinforced my commitment to conservation and ignited a passion to continue exploring the avian wonders of our planet. The memories and images from this expedition will forever be etched in my heart.",
      ],
    },
  ],
  galleryImages: [
    {
      src: "/images/blogs/blog1/gallery/1.jpeg",
      alt: "Nelapattu & Pulicat Expedition Image 1",
    },
    {
      src: "/images/blogs/blog1/gallery/2.jpeg",
      alt: "Nelapattu & Pulicat Expedition Image 2",
    },
    {
      src: "/images/blogs/blog1/gallery/3.jpeg",
      alt: "Nelapattu & Pulicat Expedition Image 3",
    },
    {
      src: "/images/blogs/blog1/gallery/4.jpeg",
      alt: "Nelapattu & Pulicat Expedition Image 4",
    },
    {
      src: "/images/blogs/blog1/gallery/5.jpeg",
      alt: "Nelapattu & Pulicat Expedition Image 5",
    },
    {
      src: "/images/blogs/blog1/gallery/6.jpeg",
      alt: "Nelapattu & Pulicat Expedition Image 6",
    },
  ],
};
