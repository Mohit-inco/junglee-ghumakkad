
import { preloadImageProgressive, loadImagesBatch } from './imageUtils';

interface SmartPreloaderOptions {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  priorityCount?: number; // Number of images to load with high priority
  batchSize?: number; // Size of each loading batch
}

class SmartImagePreloader {
  private images: string[] = [];
  private loadedImages: number = 0;
  private options: SmartPreloaderOptions;
  private abortController: AbortController;

  constructor(options: SmartPreloaderOptions = {}) {
    this.options = {
      priorityCount: 6, // Load first 6 images immediately
      batchSize: 3,
      ...options
    };
    this.abortController = new AbortController();
  }

  public addImages(imageUrls: string[]): void {
    this.images = [...imageUrls];
  }

  public async preload(): Promise<void> {
    if (this.images.length === 0) {
      this.options.onComplete?.();
      return;
    }

    try {
      // Split images into priority and regular batches
      const priorityImages = this.images.slice(0, this.options.priorityCount);
      const regularImages = this.images.slice(this.options.priorityCount);

      // Load priority images first (for hero, featured content)
      await this.loadPriorityImages(priorityImages);

      // Load remaining images in batches
      await this.loadRegularImages(regularImages);

      this.options.onComplete?.();
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  private async loadPriorityImages(urls: string[]): Promise<void> {
    // Load priority images with smaller batches for faster initial load
    await loadImagesBatch(urls, 2);
    this.updateProgress(urls.length);
  }

  private async loadRegularImages(urls: string[]): Promise<void> {
    const batchSize = this.options.batchSize || 3;
    
    for (let i = 0; i < urls.length; i += batchSize) {
      if (this.abortController.signal.aborted) break;
      
      const batch = urls.slice(i, i + batchSize);
      
      try {
        await Promise.allSettled(
          batch.map(url => preloadImageProgressive(url))
        );
        this.updateProgress(batch.length);
        
        // Longer delay for regular images to not block UI
        if (i + batchSize < urls.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn('Batch loading failed:', error);
        this.updateProgress(batch.length);
      }
    }
  }

  private updateProgress(loadedCount: number): void {
    this.loadedImages += loadedCount;
    const progress = (this.loadedImages / this.images.length) * 100;
    this.options.onProgress?.(Math.min(progress, 100));
  }

  public abort(): void {
    this.abortController.abort();
  }
}

export default SmartImagePreloader;
