
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

export function getImageSrc(src: string): string {
  return src;
}
