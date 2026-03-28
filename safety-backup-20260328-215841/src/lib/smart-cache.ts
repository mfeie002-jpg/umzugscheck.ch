/**
 * Smart Caching System
 * Intelligent caching with TTL, LRU eviction, and prefetching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
  tags?: string[];
}

interface CacheOptions {
  ttl?: number; // Time to live in ms
  tags?: string[];
  priority?: 'low' | 'normal' | 'high';
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

class SmartCache {
  private cache = new Map<string, CacheEntry<any>>();
  private accessQueue: string[] = [];

  // Get item from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access stats
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.updateAccessQueue(key);
    
    return entry.data as T;
  }

  // Set item in cache
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const { ttl = DEFAULT_TTL, tags, priority = 'normal' } = options;
    
    // Evict if necessary
    if (this.cache.size >= MAX_CACHE_SIZE) {
      this.evict();
    }
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: priority === 'high' ? ttl * 2 : priority === 'low' ? ttl / 2 : ttl,
      accessCount: 1,
      lastAccess: Date.now(),
      tags
    };
    
    this.cache.set(key, entry);
    this.updateAccessQueue(key);
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Invalidate by key
  invalidate(key: string): void {
    this.cache.delete(key);
    this.accessQueue = this.accessQueue.filter(k => k !== key);
  }

  // Invalidate by tag
  invalidateByTag(tag: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.tags?.includes(tag)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.invalidate(key));
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.accessQueue = [];
  }

  // Get cache stats
  getStats() {
    let validEntries = 0;
    let expiredEntries = 0;
    const now = Date.now();
    
    this.cache.forEach(entry => {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: this.calculateHitRate()
    };
  }

  private updateAccessQueue(key: string): void {
    this.accessQueue = this.accessQueue.filter(k => k !== key);
    this.accessQueue.push(key);
  }

  private evict(): void {
    // LRU eviction - remove least recently used
    const keyToEvict = this.accessQueue.shift();
    if (keyToEvict) {
      this.cache.delete(keyToEvict);
    }
  }

  private hitRate = { hits: 0, misses: 0 };
  
  private calculateHitRate(): number {
    const total = this.hitRate.hits + this.hitRate.misses;
    return total > 0 ? this.hitRate.hits / total : 0;
  }
}

// Singleton instance
export const smartCache = new SmartCache();

// React hook for cached data
import { useState, useEffect, useCallback } from 'react';

interface UseCachedDataOptions<T> extends CacheOptions {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  staleWhileRevalidate?: boolean;
}

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCachedDataOptions<T> = {}
) {
  const { 
    enabled = true, 
    ttl, 
    tags, 
    priority,
    onSuccess,
    onError,
    staleWhileRevalidate = false
  } = options;

  const [data, setData] = useState<T | null>(() => smartCache.get<T>(key));
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = useCallback(async (background = false) => {
    if (!background) setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      smartCache.set(key, result, { ttl, tags, priority });
      setData(result);
      setIsStale(false);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Fetch failed');
      setError(error);
      onError?.(error);
    } finally {
      if (!background) setIsLoading(false);
    }
  }, [key, fetcher, ttl, tags, priority, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    const cached = smartCache.get<T>(key);
    
    if (cached) {
      setData(cached);
      setIsLoading(false);
      
      if (staleWhileRevalidate) {
        setIsStale(true);
        fetchData(true);
      }
    } else {
      fetchData();
    }
  }, [key, enabled, staleWhileRevalidate, fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);
  
  const invalidate = useCallback(() => {
    smartCache.invalidate(key);
    setData(null);
  }, [key]);

  return { data, isLoading, error, isStale, refetch, invalidate };
}

// Prefetch helper
export async function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<void> {
  if (smartCache.has(key)) return;
  
  try {
    const data = await fetcher();
    smartCache.set(key, data, options);
  } catch (error) {
    console.warn(`Prefetch failed for ${key}:`, error);
  }
}

// Cache key generators
export const cacheKeys = {
  companies: (region?: string) => `companies:${region || 'all'}`,
  estimate: (params: string) => `estimate:${params}`,
  user: (id: string) => `user:${id}`,
  reviews: (companyId: string) => `reviews:${companyId}`,
  postalCode: (plz: string) => `plz:${plz}`,
  pricing: (from: string, to: string) => `pricing:${from}-${to}`
};

// Session storage cache (persists across page reloads)
export const sessionCache = {
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(`cache:${key}`);
      if (!item) return null;
      
      const { data, expiry } = JSON.parse(item);
      if (expiry && Date.now() > expiry) {
        sessionStorage.removeItem(`cache:${key}`);
        return null;
      }
      
      return data as T;
    } catch {
      return null;
    }
  },
  
  set<T>(key: string, data: T, ttl?: number): void {
    try {
      const expiry = ttl ? Date.now() + ttl : null;
      sessionStorage.setItem(`cache:${key}`, JSON.stringify({ data, expiry }));
    } catch {
      // Storage full or unavailable
    }
  },
  
  remove(key: string): void {
    sessionStorage.removeItem(`cache:${key}`);
  },
  
  clear(): void {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith('cache:'))
      .forEach(key => sessionStorage.removeItem(key));
  }
};
