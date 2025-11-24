// Client-side cache management

interface CacheConfig {
  maxAge: number; // milliseconds
  maxSize: number; // number of items
}

class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxAge: config.maxAge || 5 * 60 * 1000, // 5 minutes default
      maxSize: config.maxSize || 100,
    };
  }

  set(key: string, data: any): void {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if cache is expired
    const age = Date.now() - item.timestamp;
    if (age > this.config.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instances for different data types
export const apiCache = new CacheManager({ maxAge: 5 * 60 * 1000, maxSize: 50 });
export const imageCache = new CacheManager({ maxAge: 60 * 60 * 1000, maxSize: 100 });
export const userCache = new CacheManager({ maxAge: 10 * 60 * 1000, maxSize: 20 });

// Auto cleanup every 5 minutes
setInterval(() => {
  apiCache.cleanup();
  imageCache.cleanup();
  userCache.cleanup();
}, 5 * 60 * 1000);

export default CacheManager;
