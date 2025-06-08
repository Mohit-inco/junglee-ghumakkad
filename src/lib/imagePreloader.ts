import { preloadImage } from './imageUtils';

interface ImagePreloaderOptions {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  priorityImages?: string[]; // Images that should be loaded first
}

class ImagePreloader {
  private images: string[] = [];
  private priorityImages: string[] = [];
  private loadedImages: number = 0;
  private options: ImagePreloaderOptions;
  private isBackgroundLoading: boolean = false;

  constructor(options: ImagePreloaderOptions = {}) {
    this.options = options;
    this.priorityImages = options.priorityImages || [];
  }

  public addImages(imageUrls: string[]): void {
    this.images = [...this.images, ...imageUrls];
  }

  public setPriorityImages(imageUrls: string[]): void {
    this.priorityImages = imageUrls;
  }

  public async preload(): Promise<void> {
    // First load priority images
    if (this.priorityImages.length > 0) {
      const priorityPromises = this.priorityImages.map((url) => this.loadImage(url));
      try {
        await Promise.all(priorityPromises);
        // Start background loading of remaining images
        this.loadRemainingImages();
      } catch (error) {
        this.options.onError?.(error as Error);
      }
    } else {
      // If no priority images, load all images
      await this.loadAllImages();
    }
  }

  private async loadAllImages(): Promise<void> {
    const promises = this.images.map((url) => this.loadImage(url));
    try {
      await Promise.all(promises);
      this.options.onComplete?.();
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  private async loadRemainingImages(): Promise<void> {
    if (this.isBackgroundLoading) return;
    this.isBackgroundLoading = true;

    const remainingImages = this.images.filter(url => !this.priorityImages.includes(url));
    const promises = remainingImages.map((url) => this.loadImage(url));
    
    try {
      await Promise.all(promises);
      this.options.onComplete?.();
    } catch (error) {
      this.options.onError?.(error as Error);
    } finally {
      this.isBackgroundLoading = false;
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