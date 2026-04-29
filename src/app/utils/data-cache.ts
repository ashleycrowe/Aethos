/**
 * Aethos Multi-Tier Cache (STD-DATA-001)
 * Manages transient data with strict TTL and tiering.
 */

import { DataSource } from '../types/aethos.types';

interface CacheEntry<T> {
  data: T;
  expiry: number;
  source: string;
}

export class AethosDataCache {
  private static memoryCache = new Map<string, CacheEntry<any>>();

  /**
   * Set data in cache with specific TTL
   */
  static set<T>(key: string, data: T, ttlSeconds: number, source: string = 'Graph'): void {
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
      source
    };

    // 1. Memory Tier
    this.memoryCache.set(key, entry);

    // 2. Session Tier (Transient Persistence)
    try {
      sessionStorage.setItem(`aethos_cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('[Aethos Cache] Session storage full or unavailable');
    }
  }

  /**
   * Retrieve data with expiry check
   */
  static get<T>(key: string): T | null {
    // 1. Check Memory
    let entry = this.memoryCache.get(key);

    // 2. Fallback to Session
    if (!entry) {
      const stored = sessionStorage.getItem(`aethos_cache_${key}`);
      if (stored) {
        try {
          entry = JSON.parse(stored);
          // Restore to memory for faster subsequent access
          if (entry) this.memoryCache.set(key, entry);
        } catch (e) {
          return null;
        }
      }
    }

    if (!entry) return null;

    // Check Expiry
    if (Date.now() > entry.expiry) {
      this.invalidate(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Remove specific key
   */
  static invalidate(key: string): void {
    this.memoryCache.delete(key);
    sessionStorage.removeItem(`aethos_cache_${key}`);
  }

  /**
   * Clear all Aethos related cache
   */
  static clearAll(): void {
    this.memoryCache.clear();
    Object.keys(sessionStorage)
      .filter(key => key.startsWith('aethos_cache_'))
      .forEach(key => sessionStorage.removeItem(key));
  }
}
