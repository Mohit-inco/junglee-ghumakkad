
/// <reference types="vite/client" />

import { getImageSrc } from '@/lib/data';

declare global {
  interface Window {
    getImageSrc: typeof getImageSrc;
  }
}
