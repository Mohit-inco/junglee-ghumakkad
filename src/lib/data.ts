
export interface Image {
  id: number;
  title: string;
  description: string;
  photographerNote: string;
  location: string;
  date: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  categories: string[];
}

export interface PrintOption {
  id: number;
  size: string;
  price: number;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  imageId: number;
  printOptionId: number;
  quantity: number;
}

// Sample images data
export const images: Image[] = [
  {
    id: 1,
    title: "Pelican Feeding",
    description: "A pelican with its mouth wide open feeding in the calm blue water.",
    photographerNote: "The symmetry of this feeding pelican created a perfect moment to capture.",
    location: "Coastal Waters, Pacific Ocean",
    date: "May 2023",
    src: "/lovable-uploads/5585f3be-0c31-4a9d-8fb1-72d97dd2ba56.png",
    alt: "Pelican feeding with open beak in blue water",
    width: 1920,
    height: 1280,
    categories: ["Birds", "Water", "Wildlife"],
  },
  {
    id: 2,
    title: "Flying Pelican",
    description: "A pelican flying over misty forests in the early morning fog.",
    photographerNote: "I waited for hours in the morning fog to capture this perfect flight.",
    location: "Mountain Forests, Asia",
    date: "June 2023",
    src: "/lovable-uploads/78c195fe-7a73-4a8a-9544-b17bff810417.png",
    alt: "Pelican flying over foggy forest",
    width: 1920,
    height: 1280,
    categories: ["Birds", "Flight", "Fog"],
  },
  {
    id: 3,
    title: "Misty Mountains",
    description: "Lush green mountains emerging through the morning mist.",
    photographerNote: "The early morning light created a magical atmosphere over these mountains.",
    location: "Western Ghats, India",
    date: "March 2023",
    src: "/lovable-uploads/4b557edc-218f-4fe4-84ab-4a45cc24b0bc.png",
    alt: "Misty mountains with lush green vegetation",
    width: 1920,
    height: 1280,
    categories: ["Landscapes", "Mountains", "Mist"],
  },
  {
    id: 4,
    title: "Monkey on Railing",
    description: "A small monkey sitting on a blue and yellow railing, looking into the distance.",
    photographerNote: "This curious little one sat still just long enough for this contemplative shot.",
    location: "National Park, Thailand",
    date: "July 2023",
    src: "/lovable-uploads/dab911fa-b1dd-42f4-87c2-ef0814ed2f40.png",
    alt: "Small monkey sitting on railing",
    width: 1280,
    height: 1920,
    categories: ["Primates", "Wildlife", "Asia"],
  },
  {
    id: 5,
    title: "Playful Monkey",
    description: "A playful monkey running along a railing with a mischievous grin.",
    photographerNote: "Capturing the personality of this monkey was a delightful challenge.",
    location: "Mountain Sanctuary, Nepal",
    date: "August 2023",
    src: "/lovable-uploads/f83db2d1-d2fa-40fa-860c-64f14c498fe8.png",
    alt: "Playful monkey running on railing",
    width: 1920,
    height: 1280,
    categories: ["Primates", "Wildlife", "Motion"],
  },
  {
    id: 6,
    title: "Misty Forest",
    description: "Sunlight streaming through a dense forest creating mystical light rays.",
    photographerNote: "The interplay of light and fog created this ethereal scene in the early morning.",
    location: "Ancient Forest, Indonesia",
    date: "April 2023",
    src: "/lovable-uploads/0e2ba0f0-296e-4549-92bf-6460d3329b27.png",
    alt: "Sunlight streaming through misty forest",
    width: 1920,
    height: 1280,
    categories: ["Forests", "Mist", "Sunlight"],
  },
  {
    id: 7,
    title: "Hanging Monkey",
    description: "A small monkey hanging from a tree branch, reaching for leaves.",
    photographerNote: "This little one was foraging for food, allowing me to capture this natural behavior.",
    location: "Rainforest Reserve, Malaysia",
    date: "September 2023",
    src: "/lovable-uploads/24663f0b-a8e6-49dc-b1c1-15ab70519306.png",
    alt: "Monkey hanging from tree branch",
    width: 1280,
    height: 1920,
    categories: ["Primates", "Wildlife", "Canopy"],
  },
  {
    id: 8,
    title: "Monkey Family",
    description: "A family of monkeys huddled together on a tree branch, showing their tight bond.",
    photographerNote: "Witnessing this family moment was special - they stayed close for warmth and protection.",
    location: "Wildlife Sanctuary, Vietnam",
    date: "October 2023",
    src: "/lovable-uploads/e7df1263-c76b-4b0e-ba39-5f579c155a2b.png",
    alt: "Family of monkeys huddled on tree branch",
    width: 1920,
    height: 1280,
    categories: ["Primates", "Family", "Wildlife"],
  },
  {
    id: 9,
    title: "Monkey Portrait",
    description: "Close-up portrait of a monkey with intense expression on the railing.",
    photographerNote: "The eye contact in this shot conveys so much emotion and intelligence.",
    location: "Conservation Area, Cambodia",
    date: "November 2023",
    src: "/lovable-uploads/4620b1a4-fff2-4ff5-9326-053c13f07bd5.png",
    alt: "Close-up portrait of monkey",
    width: 1920,
    height: 1280,
    categories: ["Primates", "Portrait", "Wildlife"],
  },
  {
    id: 10,
    title: "Forest Fire",
    description: "A nighttime view of a forest fire on a mountain, with stars visible in the sky.",
    photographerNote: "This haunting yet mesmerizing scene reminds us of nature's destructive power and beauty.",
    location: "Mountain Range, Northern India",
    date: "January 2024",
    src: "/lovable-uploads/f6997cd3-02ac-462c-96c5-2e39d303511d.png",
    alt: "Forest fire on mountainside at night",
    width: 1920,
    height: 1280,
    categories: ["Fire", "Night", "Mountains"],
  },
  {
    id: 11,
    title: "Hovering Kingfisher",
    description: "A kingfisher bird hovering in mid-air, wings spread against a bright sky.",
    photographerNote: "Capturing this kingfisher's perfect hover required patience and quick reflexes.",
    location: "River Bank, Central India",
    date: "February 2024",
    src: "/lovable-uploads/5e976d5f-0a22-405e-9a68-44088ba0865c.png",
    alt: "Kingfisher hovering in mid-air",
    width: 1920,
    height: 1280,
    categories: ["Birds", "Flight", "Wildlife"],
  },
  {
    id: 12,
    title: "Full Moon",
    description: "A brilliant full moon illuminating the night sky with a subtle glow around it.",
    photographerNote: "The perfect clarity of this full moon night allowed for this detailed lunar portrait.",
    location: "Clear Sky Observatory, India",
    date: "December 2023",
    src: "/lovable-uploads/89f39402-d53d-4e24-9380-a87509f10c44.png",
    alt: "Full moon with glowing halo",
    width: 1920,
    height: 1280,
    categories: ["Astro", "Night", "Moon"],
  },
  {
    id: 13,
    title: "Ocean Sunset",
    description: "A golden sunset over calm ocean waters creating a pathway of light.",
    photographerNote: "The serenity of this moment as the sun created a golden path across the water was breathtaking.",
    location: "Coastal Beach, Goa",
    date: "October 2023",
    src: "/lovable-uploads/895ec1fd-884a-4f8c-823a-e31962b7b5d2.png",
    alt: "Golden sunset over ocean",
    width: 1920,
    height: 1280,
    categories: ["Sunset", "Ocean", "Landscape"],
  },
  {
    id: 14,
    title: "Spider on Web",
    description: "A detailed macro shot of a spider at the center of its intricate web against a dark background.",
    photographerNote: "The precision of this spider's web construction fascinates me every time.",
    location: "Garden Study, Delhi",
    date: "November 2023",
    src: "/lovable-uploads/44dff5cd-424f-4047-adf0-5768c8018581.png",
    alt: "Spider on intricate web",
    width: 1920,
    height: 1280,
    categories: ["Macro", "Insects", "Wildlife"],
  },
  {
    id: 15,
    title: "Golden Web",
    description: "A spider's web illuminated by golden light, creating a mesmerizing pattern with the spider at center.",
    photographerNote: "The golden hour light transformed this ordinary web into something magical.",
    location: "Backyard, Home",
    date: "September 2023",
    src: "/lovable-uploads/1d80cd32-061c-407d-9078-7a72fe1e1f2d.png",
    alt: "Spider web illuminated by golden light",
    width: 1920,
    height: 1280,
    categories: ["Macro", "Insects", "Golden Hour"],
  },
  {
    id: 16,
    title: "The Photographer",
    description: "Mohit Kumar, the photographer behind the lens, smiling with his camera gear.",
    photographerNote: "A rare moment on the other side of the lens.",
    location: "Campus, IIT Roorkee",
    date: "March 2024",
    src: "/lovable-uploads/96658d4c-fd6e-4225-8d2b-7a0706abf2db.png",
    alt: "Portrait of photographer Mohit Kumar",
    width: 1280,
    height: 1920,
    categories: ["Portrait", "People"],
  }
];

// Print options
export const printOptions: PrintOption[] = [
  {
    id: 1,
    size: "8x10 inches",
    price: 24.99,
    inStock: true,
  },
  {
    id: 2,
    size: "11x14 inches",
    price: 39.99,
    inStock: true,
  },
  {
    id: 3,
    size: "16x20 inches",
    price: 59.99,
    inStock: true,
  },
  {
    id: 4,
    size: "20x30 inches",
    price: 89.99,
    inStock: true,
  },
  {
    id: 5,
    size: "24x36 inches",
    price: 129.99,
    inStock: false,
  },
];

// For placeholder images (since we don't have the actual images)
export const placeholderImages = {
  leopard: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80",
  elephants: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  arcticFox: "https://images.unsplash.com/photo-1517825607650-8878103e51c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  eagle: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  salmon: "https://images.unsplash.com/photo-1534251363625-8c1eb240e9c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  lion: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=786&q=80",
  hummingbird: "https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80",
  penguins: "https://images.unsplash.com/photo-1598439210625-358ffdcbeb08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80",
};

// Map the placeholder images to the image data
export const getImageSrc = (imageName: string): string => {
  // If the image path starts with "/lovable-uploads/", it's a real upload
  if (imageName.startsWith('/lovable-uploads/')) {
    return imageName;
  }
  
  const placeholderMap: Record<string, string> = {
    "/leopard.jpg": placeholderImages.leopard,
    "/elephants.jpg": placeholderImages.elephants,
    "/arctic-fox.jpg": placeholderImages.arcticFox,
    "/eagle.jpg": placeholderImages.eagle,
    "/salmon.jpg": placeholderImages.salmon,
    "/lion.jpg": placeholderImages.lion,
    "/hummingbird.jpg": placeholderImages.hummingbird,
    "/penguins.jpg": placeholderImages.penguins,
  };
  
  return placeholderMap[imageName] || imageName;
};

export const photographerInfo = {
  name: "Junglee Ghumakkad",
  realName: "Mohit Kumar",
  bio: "Junglee Ghumakkad (aka Mohit Kumar), a final-year B.Tech student in Electrical Engineering, has been capturing the world through his lens for the past five years. An aspiring wildlife photographer, he's equally drawn to event, astro, street, and architectural photography. Whether it's tracking elusive wildlife, chasing the perfect night sky, or framing the chaos of city streets, he's always on the lookout for new perspectives and untold stories.",
  longBio: "Junglee Ghumakkad (aka Mohit Kumar), a final-year B.Tech student in Electrical Engineering, has been capturing the world through his lens for the past five years. An aspiring wildlife photographer, he's equally drawn to event, astro, street, and architectural photography.\n\nWhether it's tracking elusive wildlife, chasing the perfect night sky, or framing the chaos of city streets, he's always on the lookout for new perspectives and untold stories. His journey began with a simple point-and-shoot camera but quickly evolved into a passion that has taken him across various landscapes of India.\n\nMohit finds particular joy in macro photography and capturing the intricate details often overlooked by the casual observer. His work with spiders, insects, and small creatures reveals a hidden world of complexity and beauty. His astrophotography captures the majesty of the night sky, reminding viewers of our place in the cosmos.\n\nThrough his photography, Mohit aims to share his unique perspective on the natural world and inspire others to look more closely at the beauty that surrounds us all.",
  awards: [
    "Campus Photography Competition, First Place (2023)",
    "National Geographic India Spotlight, Featured Artist (2022)",
    "Wildlife Conservation Society Photo Contest, Finalist (2022)"
  ],
  exhibitions: [
    "Glimpses of Nature - IIT Roorkee Campus Gallery (2023)",
    "Night Skies - Delhi Photography Club (2022)",
    "Wild India - Online Exhibition (2021)"
  ],
  profileImage: "/lovable-uploads/96658d4c-fd6e-4225-8d2b-7a0706abf2db.png"
};
