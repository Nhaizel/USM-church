/**
 * Cache Utility
 * Simple in-memory cache with TTL support
 * Functional implementation using closures
 */

import { logger } from './logger.js';

/**
 * Create a cache instance
 * @returns {Object} Cache API
 */
const createCache = () => {
  const store = new Map();

  /**
   * Set cache entry with optional TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  const set = (key, value, ttl = null) => {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    store.set(key, entry);
    logger.info(`Cache set: ${key}`, { ttl });
  };

  /**
   * Get cache entry if valid
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  const get = (key) => {
    const entry = store.get(key);

    if (!entry) {
      logger.info(`Cache miss: ${key}`);
      return null;
    }

    // Check if expired
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      logger.info(`Cache expired: ${key}`);
      deleteKey(key);
      return null;
    }

    logger.info(`Cache hit: ${key}`);
    return entry.value;
  };

  /**
   * Delete cache entry
   * @param {string} key - Cache key
   */
  const deleteKey = (key) => {
    store.delete(key);
    logger.info(`Cache deleted: ${key}`);
  };

  /**
   * Clear all cache
   */
  const clear = () => {
    store.clear();
    logger.info('Cache cleared');
  };

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  const has = (key) => get(key) !== null;

  return { set, get, delete: deleteKey, clear, has };
};

export const cache = createCache();
