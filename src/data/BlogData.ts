
import { BlogContent } from "@/components/BlogTemplate";

// Blog 1: Photography Expedition to Nelapattu and Pulicat
export const blog1: BlogContent = {
  title: "Discovering Untold Stories",
  subtitle: "Wings and Waters: A Photographic Journey",
  coverImage: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
  author: "Junglee Ghumakkad",
  date: "2023-01-15",
  sections: [
    {
      type: "image-text",
      layout: "one-third-two-thirds",
      image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
      imageAlt: "Nelapattu Bird Sanctuary Panoramic View",
      title: "The Hidden Sanctuaries of South India",
      content: [
        "Our journey to Nelapattu Bird Sanctuary and Pulicat Lake was filled with anticipation. These hidden gems of biodiversity in South India are often overlooked by travelers, yet they host some of the most spectacular avian gatherings in the country.",
        "The pre-dawn departure from Chennai set the tone for our expedition - patience and perseverance would be our companions. As wildlife photographers, we've learned that the most breathtaking moments in nature require both preparation and patience.",
        "Arriving at Nelapattu just as the first light painted the sky in hues of amber and gold, we were immediately greeted by the distant calls of birds awakening to a new day."
      ]
    },
    {
      type: "text-image",
      layout: "half-half",
      image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
      imageAlt: "Bird Colony at Nelapattu",
      title: "The Symphony of Wings",
      content: [
        "Nelapattu Bird Sanctuary is relatively small at just 4.58 square kilometers, but what it lacks in size, it more than makes up for in biodiversity. The sanctuary is home to over 189 bird species, many of which migrate from distant lands.",
        "The Painted Storks were perhaps the most photogenic subjects, their distinctive pink plumage and curved yellow bills creating striking silhouettes against the morning sky. We watched in awe as they performed their ritualistic dances and feeding techniques in the shallow waters.",
        "Equally captivating were the Spot-billed Pelicans, gracefully gliding across the water surface before dramatically plunging to catch fish. Their synchronized movements created a ballet that seemed choreographed specifically for our cameras."
      ]
    },
    {
      type: "image-text",
      layout: "half-half",
      image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
      imageAlt: "Pulicat Lake Landscape",
      title: "Pulicat Lake: Where Sky Meets Water",
      content: [
        "Our expedition continued to Pulicat Lake, India's second-largest brackish water lagoon. Spanning across 759 square kilometers, Pulicat is a wetland of international importance, recognized under the Ramsar Convention.",
        "The vastness of Pulicat presented different photographic challenges compared to Nelapattu. Here, the compositions were more about capturing the relationship between the birds and their expansive environment. The endless horizon where sky meets water became a recurring theme in our photographs.",
        "Greater Flamingos, with their iconic pink plumage, created stunning reflections on the still waters of the lake. We spent hours following their movements, waiting for that perfect moment when light, subject, and environment aligned in harmony."
      ]
    },
    {
      type: "full-width-image",
      image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
      imageAlt: "Panoramic View of Birds at Pulicat Lake"
    },
    {
      type: "image-text",
      layout: "one-third-two-thirds",
      image: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg",
      imageAlt: "Sunset Over Pulicat Lake with Birds in Flight",
      title: "The Art of Patience in Wildlife Photography",
      content: [
        "Wildlife photography, especially bird photography, is as much about patience as it is about technical skill. Throughout our expedition, we were reminded of this fundamental truth. Hours would pass with no significant activity, and then, in a split second, magic would unfold before our lenses.",
        "One such moment occurred at Pulicat as the sun began to set. A flock of Black-tailed Godwits that had been feeding quietly suddenly took flight, creating a mesmerizing pattern against the golden sky. Those who had packed up early missed the spectacle – a reminder that in wildlife photography, perseverance often makes the difference.",
        "We also learned the importance of understanding bird behavior. By observing patterns and anticipating movements, we could position ourselves for optimal shots. This knowledge helped us capture intimate moments of birds feeding, courting, and interacting with their environment."
      ]
    },
    {
      type: "gallery",
      title: "Favorite Clicks From Our Journey"
    },
    {
      type: "conclusion",
      title: "The Journey Continues",
      content: [
        "Our expedition to Nelapattu and Pulicat was more than just a photography trip; it was a reminder of the incredible biodiversity that exists in our world and the importance of preserving these habitats for future generations.",
        "Every photograph we captured tells a story – of patience, of perfect timing, of the delicate balance of nature. We hope these images inspire others to explore these lesser-known sanctuaries and to develop a deeper appreciation for the winged wonders that inhabit our planet."
      ]
    }
  ],
  galleryImages: [
    { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Pelican in Flight" },
    { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Painted Stork" },
    { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Nelapattu Panorama" },
    { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Ibis Feeding" },
    { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Pulicat Lake Sunset" },
    { src: "https://umserxrsymmdtgehbcly.supabase.co/storage/v1/object/public/images//1000035613_enhanced%20(1).jpg", alt: "Bird in Natural Habitat" }
  ]
};

// Simple mapping to match blog IDs to content
export const blogDataMapping: Record<string, BlogContent> = {
  "nelapattu-pulicat-expedition": blog1,
  // Add more blogs here as they are created
};
