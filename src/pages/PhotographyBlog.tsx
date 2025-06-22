import PhotographyExpeditionBlog from '../components/PhotographyExpeditionBlog';

export default function PhotographyBlog() {
  const blogData = {
    coverImage: '/images/nelapattu-cover.jpg',
    image1: '/images/nelapattu-1.jpg',
    image2: '/images/nelapattu-2.jpg',
    image3: '/images/nelapattu-3.jpg',
    image4: '/images/nelapattu-4.jpg',
    image5: '/images/nelapattu-5.jpg',
    image6: '/images/nelapattu-6.jpg',
    title: "Discovering Untold Stories",
    subtitle: "A photographic expedition to Nelapattu Bird Sanctuary and Pulicat Lake",
    sections: [
      {
        title: "The Hidden Sanctuaries of South India",
        content: [
          "Our journey to Nelapattu Bird Sanctuary and Pulicat Lake was filled with anticipation. These hidden gems of biodiversity in South India are often overlooked by travelers, yet they host some of the most spectacular avian gatherings in the country.",
          "The pre-dawn departure from Chennai set the tone for our expedition - patience and perseverance would be our companions. As wildlife photographers, we've learned that the most breathtaking moments in nature require both preparation and patience.",
          "Arriving at Nelapattu just as the first light painted the sky in hues of amber and gold, we were immediately greeted by the distant calls of birds awakening to a new day."
        ],
        image: '/images/nelapattu-1.jpg',
        imagePosition: 'left' as const
      },
      {
        title: "The Symphony of Wings",
        content: [
          "Nelapattu Bird Sanctuary is relatively small at just 4.58 square kilometers, but what it lacks in size, it more than makes up for in biodiversity. The sanctuary is home to over 189 bird species, many of which migrate from distant lands.",
          "The Painted Storks were perhaps the most photogenic subjects, their distinctive pink plumage and curved yellow bills creating striking silhouettes against the morning sky. We watched in awe as they performed their ritualistic dances and feeding techniques in the shallow waters.",
          "Equally captivating were the Spot-billed Pelicans, gracefully gliding across the water surface before dramatically plunging to catch fish. Their synchronized movements created a ballet that seemed choreographed specifically for our cameras."
        ],
        image: '/images/nelapattu-3.jpg',
        imagePosition: 'right' as const
      },
      {
        title: "Pulicat Lake: Where Sky Meets Water",
        content: [
          "Our expedition continued to Pulicat Lake, India's second-largest brackish water lagoon. Spanning across 759 square kilometers, Pulicat is a wetland of international importance, recognized under the Ramsar Convention.",
          "The vastness of Pulicat presented different photographic challenges compared to Nelapattu. Here, the compositions were more about capturing the relationship between the birds and their expansive environment. The endless horizon where sky meets water became a recurring theme in our photographs.",
          "Greater Flamingos, with their iconic pink plumage, created stunning reflections on the still waters of the lake. We spent hours following their movements, waiting for that perfect moment when light, subject, and environment aligned in harmony."
        ],
        image: '/images/nelapattu-4.jpg',
        imagePosition: 'left' as const
      }
    ],
    galleryImages: [
      { src: '/images/gallery-1.jpg', alt: 'Flamingos at Pulicat Lake' },
      { src: '/images/gallery-2.jpg', alt: 'Painted Storks in Flight' },
      { src: '/images/gallery-3.jpg', alt: 'Sunset at Nelapattu' },
      { src: '/images/gallery-4.jpg', alt: 'Spot-billed Pelicans' },
      { src: '/images/gallery-5.jpg', alt: 'Bird Colony' },
      { src: '/images/gallery-6.jpg', alt: 'Morning Light at Pulicat' }
    ],
    conclusion: {
      title: "The Journey Continues",
      content: [
        "Our expedition to Nelapattu and Pulicat was more than just a photography trip; it was a reminder of the incredible biodiversity that exists in our world and the importance of preserving these habitats for future generations.",
        "Every photograph we captured tells a story – of patience, of perfect timing, of the delicate balance of nature. We hope these images inspire others to explore these lesser-known sanctuaries and to develop a deeper appreciation for the winged wonders that inhabit our planet."
      ]
    }
  };

  return <PhotographyExpeditionBlog {...blogData} />;
} 