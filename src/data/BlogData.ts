
export interface ImageData {
  src: string;
  alt: string;
}

export interface BlogContent {
  title: string;
  subtitle: string;
  coverImage: ImageData;
  author: string;
  date: string;
  sections: {
    type: "text";
    content: string[];
  }[];
  galleryImages: ImageData[];
}

export const blogContent: BlogContent = {
  title: "Sample Blog Post",
  subtitle: "A sample blog post subtitle",
  coverImage: {
    src: "/placeholder.svg",
    alt: "Sample cover image"
  },
  author: "Sample Author",
  date: "2024-01-01",
  sections: [
    {
      type: "text",
      content: ["This is a sample blog post content."]
    }
  ],
  galleryImages: [
    {
      src: "/placeholder.svg",
      alt: "Sample gallery image"
    }
  ]
};
