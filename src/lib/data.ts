
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
    title: "Prowling Leopard",
    description: "A majestic leopard prowling through tall grass in the Serengeti at golden hour.",
    photographerNote: "I waited for hours to capture this perfect moment as the leopard moved through the golden grass.",
    location: "Serengeti National Park, Tanzania",
    date: "June 2023",
    src: "/leopard.jpg",
    alt: "Leopard prowling through tall grass",
    width: 1920,
    height: 1280,
    categories: ["Big Cats", "Predators", "Africa"],
  },
  {
    id: 2,
    title: "Elephant Family",
    description: "A family of elephants crossing the savanna during a dramatic sunset.",
    photographerNote: "The tender interaction between the mother and baby elephant moved me deeply.",
    location: "Amboseli National Park, Kenya",
    date: "March 2023",
    src: "/elephants.jpg",
    alt: "Elephant family crossing savanna at sunset",
    width: 1920,
    height: 1280,
    categories: ["Elephants", "Family", "Africa"],
  },
  {
    id: 3,
    title: "Arctic Fox",
    description: "An arctic fox in its pristine white winter coat against a snowy landscape.",
    photographerNote: "The pure white coat of this fox was almost invisible against the snow. I got lucky with the perfect lighting.",
    location: "Svalbard, Norway",
    date: "January 2023",
    src: "/arctic-fox.jpg",
    alt: "White arctic fox in snow",
    width: 1920,
    height: 1280,
    categories: ["Arctic", "Fox", "Winter"],
  },
  {
    id: 4,
    title: "Perching Eagle",
    description: "A bald eagle perched on a branch overlooking a misty valley.",
    photographerNote: "This eagle stayed in this position for nearly an hour, surveying its territory.",
    location: "Olympic National Park, USA",
    date: "May 2023",
    src: "/eagle.jpg",
    alt: "Bald eagle perched on branch",
    width: 1280,
    height: 1920,
    categories: ["Birds", "Raptors", "North America"],
  },
  {
    id: 5,
    title: "Leaping Salmon",
    description: "A wild salmon leaping up a waterfall during its spawning journey.",
    photographerNote: "It took hundreds of shots to capture this perfect moment of determination.",
    location: "Brooks Falls, Alaska",
    date: "July 2023",
    src: "/salmon.jpg",
    alt: "Salmon leaping up waterfall",
    width: 1920,
    height: 1280,
    categories: ["Fish", "Water", "North America"],
  },
  {
    id: 6,
    title: "Hunting Lion",
    description: "A male lion on the hunt during the early morning hours.",
    photographerNote: "The intensity in this lion's eyes tells the whole story of the predator-prey relationship.",
    location: "Masai Mara, Kenya",
    date: "August 2023",
    src: "/lion.jpg",
    alt: "Male lion hunting in morning light",
    width: 1920,
    height: 1280,
    categories: ["Big Cats", "Predators", "Africa"],
  },
  {
    id: 7,
    title: "Hummingbird Feeding",
    description: "A ruby-throated hummingbird feeding on a vibrant flower.",
    photographerNote: "The challenge of freezing the wings of these incredibly fast birds is always rewarding.",
    location: "Cloud Forest, Costa Rica",
    date: "April 2023",
    src: "/hummingbird.jpg",
    alt: "Hummingbird feeding on flower",
    width: 1280,
    height: 1920,
    categories: ["Birds", "Small Wildlife", "Central America"],
  },
  {
    id: 8,
    title: "Penguin Colony",
    description: "A colony of Emperor penguins huddled together in the Antarctic winter.",
    photographerNote: "The extreme conditions of -40°C tested both me and my equipment, but the results were worth it.",
    location: "Snow Hill Island, Antarctica",
    date: "September 2023",
    src: "/penguins.jpg",
    alt: "Emperor penguin colony in Antarctica",
    width: 1920,
    height: 1280,
    categories: ["Birds", "Antarctica", "Winter"],
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
  name: "Alex Morgan",
  bio: "I am a wildlife photographer with over 15 years of experience capturing the beauty and drama of the natural world. My work has been featured in National Geographic, BBC Wildlife, and numerous international exhibitions.",
  longBio: "My journey into wildlife photography began during a safari in Kenya in 2008. Witnessing the raw power and subtle interactions of wild animals ignited a passion that has driven me to explore some of the most remote corners of our planet.\n\nI specialize in creating intimate portraits of animals in their natural habitats, aiming to showcase not just their physical beauty but also their individual personalities and behaviors. My photography is driven by a deep respect for nature and a desire to highlight the urgent need for conservation.\n\nOver the years, I've had the privilege of documenting rare and endangered species across all seven continents. Each image represents hours—sometimes days—of patience, waiting for that perfect moment when light, subject, and emotion align.\n\nThrough my work, I hope to foster a connection between viewers and the natural world, inspiring a commitment to protecting these incredible creatures and their increasingly fragile ecosystems.",
  awards: [
    "Wildlife Photographer of the Year, Runner-up (2022)",
    "Nature's Best Photography, Winner - Endangered Species Category (2021)",
    "International Conservation Photography Awards, Gold Medal (2020)"
  ],
  exhibitions: [
    "Wild Moments - San Francisco Gallery of Natural History (2023)",
    "The Last Wilderness - Tokyo Photography Museum (2022)",
    "Earth's Treasures - Berlin International Gallery (2021)"
  ],
  profileImage: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
};
