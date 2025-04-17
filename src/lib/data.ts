
export interface Image {
  id: string;
  src: string;
  title: string;
  description: string;
  location: string;
  date: string;
  alt: string;
  categories: string[];
  photographerNote: string;
  width?: number;
  height?: number;
}

// Add export for PrintOption interface
export interface PrintOption {
  id: string;
  size: string;
  price: number;
  inStock: boolean;
  printType: string;
}

export function getImageSrc(src: string): string {
  return src;
}

// Mock data for Hero component and About page
export const images = [
  {
    id: "1",
    src: "/lovable-uploads/0107ed8a-5098-4509-924e-9cd60c8ce934.png",
    title: "Tiger in Forest",
    description: "Royal Bengal Tiger walking through dense forest",
    location: "Corbett National Park, India",
    date: "2022-03-15",
    alt: "Tiger in Forest",
    categories: ["Wildlife", "Big Cats"],
    photographerNote: "Captured during morning safari",
    width: 1200,
    height: 800
  },
  {
    id: "2",
    src: "/lovable-uploads/0e2ba0f0-296e-4549-92bf-6460d3329b27.png",
    title: "Elephant Family",
    description: "Family of elephants crossing a river",
    location: "Kaziranga National Park, India",
    date: "2022-05-20",
    alt: "Elephant Family",
    categories: ["Wildlife", "Mammals"],
    photographerNote: "Shot during monsoon season",
    width: 1200,
    height: 800
  },
  {
    id: "3",
    src: "/lovable-uploads/0f8fd122-54f5-40c6-bc1a-42b844709c07.png",
    title: "Himalayan Landscape",
    description: "Beautiful mountain range at sunset",
    location: "Uttarakhand, India",
    date: "2022-06-10",
    alt: "Himalayan Landscape",
    categories: ["Landscape", "Mountains"],
    photographerNote: "Golden hour shot from 4000m elevation",
    width: 1200,
    height: 800
  },
  {
    id: "4",
    src: "/lovable-uploads/1d80cd32-061c-407d-9078-7a72fe1e1f2d.png",
    title: "Kingfisher Diving",
    description: "Common Kingfisher diving for fish",
    location: "Kerala backwaters, India",
    date: "2022-07-05",
    alt: "Kingfisher Diving",
    categories: ["Wildlife", "Birds"],
    photographerNote: "1/2000 sec to freeze the action",
    width: 1200,
    height: 800
  },
  {
    id: "5",
    src: "/lovable-uploads/1d80cd32-061c-407d-9078-7a72fe1e1f2d.png",
    title: "IIT Roorkee Campus",
    description: "Historic buildings of IIT Roorkee",
    location: "Roorkee, India",
    date: "2022-08-12",
    alt: "IIT Roorkee Campus",
    categories: ["Architecture", "Campus"],
    photographerNote: "Morning light on the main building",
    width: 1200,
    height: 800
  },
  {
    id: "6",
    src: "/lovable-uploads/24663f0b-a8e6-49dc-b1c1-15ab70519306.png",
    title: "Leopard in Tree",
    description: "Leopard resting on a tree branch",
    location: "Bandipur National Park, India",
    date: "2022-09-25",
    alt: "Leopard in Tree",
    categories: ["Wildlife", "Big Cats"],
    photographerNote: "Spotted during evening safari",
    width: 1200,
    height: 800
  },
  {
    id: "7",
    src: "/lovable-uploads/3e101c4e-19d2-45b8-b24c-0cde4bb503a3.png",
    title: "Milky Way Over Desert",
    description: "Night sky over Thar Desert",
    location: "Rajasthan, India",
    date: "2022-10-15",
    alt: "Milky Way Over Desert",
    categories: ["Astro", "Night Sky"],
    photographerNote: "30-second exposure at ISO 3200",
    width: 1200,
    height: 800
  }
];

// Add photographerInfo for About page
export const photographerInfo = {
  name: "Junglee Ghumakkad",
  fullName: "Mohit Kumar",
  bio: "Junglee Ghumakkad (aka Mohit Kumar), a final-year B.Tech student in Electrical Engineering, has been capturing the world through his lens for the past five years. An aspiring wildlife photographer, he's equally drawn to event, astro, street, and architectural photography.",
  email: "mohit@jungleeghumakkad.com",
  instagram: "jungleeghumakkad",
  longBio: "Born and raised in the foothills of the Himalayas, I've always had a deep connection with nature. My journey in photography began five years ago when I borrowed my friend's DSLR for a college trek. That single experience changed everything - I was captivated by the ability to freeze moments in time.\n\nAs an electrical engineering student at IIT Roorkee, my technical background has influenced my methodical approach to photography. I'm fascinated by the intersection of technology and art, often experimenting with new techniques and equipment to push my creative boundaries.\n\nWildlife photography has become my greatest passion. There's something magical about those unpredictable moments in nature - a tiger emerging from the mist, a bird diving for prey, or the golden light hitting a landscape just right. These fleeting instances keep me returning to national parks and wilderness areas across India.\n\nWhen I'm not tracking wildlife, you might find me shooting nightscapes under starlit skies, documenting the vibrant energy of cultural events, or exploring the architectural heritage of India's diverse cities.\n\nEvery photograph tells a story, and I hope my images inspire others to appreciate and protect our natural world.",
  awards: [
    "Winner, Young Wildlife Photographer category, Nature InFocus 2023",
    "Finalist, National Geographic Student Photography Competition 2022",
    "1st Place, All India Engineering Colleges Photography Contest 2021",
    "Featured Photographer, Indian Wildlife Magazine, March 2022 issue"
  ],
  exhibitions: [
    "Solo Exhibition: 'Wild Encounters', IIT Roorkee Campus, October 2023",
    "Group Show: 'Emerging Indian Photographers', Delhi Photography Festival, 2022",
    "Digital Exhibition: 'Future Conservation Leaders', WWF India Online Gallery, 2023"
  ],
  equipment: [
    "Canon EOS R5",
    "Canon EF 600mm f/4L IS III USM",
    "Canon EF 100-400mm f/4.5-5.6L IS II",
    "Canon EF 24-70mm f/2.8L II USM",
    "Gitzo GT5563GS Systematic Tripod",
    "Really Right Stuff BH-55 Ball Head"
  ]
};
