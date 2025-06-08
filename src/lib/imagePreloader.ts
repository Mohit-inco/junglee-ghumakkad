import { preloadImage } from './imageUtils';

interface ImagePreloaderOptions {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

class ImagePreloader {
  private images: string[] = [];
  private loadedImages: number = 0;
  private options: ImagePreloaderOptions;

  constructor(options: ImagePreloaderOptions = {}) {
    this.options = options;
  }

  public addImages(imageUrls: string[]): void {
    this.images = [...this.images, ...imageUrls];
  }

  public async preload(): Promise<void> {
    const promises = this.images.map((url) => this.loadImage(url));
    
    try {
      await Promise.all(promises);
      this.options.onComplete?.();
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  private loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      preloadImage(url)
        .then(() => {
          this.loadedImages++;
          const progress = (this.loadedImages / this.images.length) * 100;
          this.options.onProgress?.(progress);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default ImagePreloader; 