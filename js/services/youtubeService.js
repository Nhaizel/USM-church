/**
 * YouTube Service
 * Handles all YouTube API interactions with retry logic and caching
 * Functional implementation using closures
 */

import { CONFIG } from '../config.js';
import { logger } from '../utils/logger.js';
import { cache } from '../utils/cache.js';

/**
 * Create YouTube service instance
 * @returns {Object} YouTube service API
 */
const createYouTubeService = () => {
  const config = CONFIG.youtube;
  const apiEndpoints = CONFIG.api.youtube;
  const maxRetries = CONFIG.performance.maxRetries;

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Transform video data to application format
   * @param {Object} item - YouTube API video item
   * @returns {Object}
   */
  const transformVideoData = (item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: {
      default: item.snippet.thumbnails.default?.url,
      medium: item.snippet.thumbnails.medium?.url,
      high: item.snippet.thumbnails.high?.url,
    },
    publishedAt: new Date(item.snippet.publishedAt),
    channelTitle: item.snippet.channelTitle,
  });

  /**
   * Fetch with retry logic
   * @param {string} url - API URL
   * @param {number} retryAttempt - Current retry attempt
   * @returns {Promise<Object>}
   */
  const fetchWithRetry = async (url, retryAttempt = 0) => {
    try {
      logger.info(`Fetching: ${url}`, { attempt: retryAttempt + 1 });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }

      return data;
    } catch (error) {
      logger.error('Fetch error', error);

      // Retry logic
      if (retryAttempt < maxRetries) {
        const delayMs = CONFIG.performance.retryDelay * Math.pow(2, retryAttempt);
        logger.warn(`Retrying in ${delayMs}ms...`, { attempt: retryAttempt + 1 });

        await delay(delayMs);
        return fetchWithRetry(url, retryAttempt + 1);
      }

      throw error;
    }
  };

  /**
   * Get channel ID from username
   * @param {string} username - Channel username
   * @returns {Promise<string>}
   */
  const getChannelId = async (username) => {
    const cacheKey = `channelId_${username}`;

    // Check cache first
    const cachedId = cache.get(cacheKey);
    if (cachedId) {
      return cachedId;
    }

    try {
      // Try forUsername parameter
      const url = `${apiEndpoints.channels}?part=id&forUsername=${encodeURIComponent(username)}&key=${config.apiKey}`;
      const data = await fetchWithRetry(url);

      if (data.items && data.items.length > 0) {
        const channelId = data.items[0].id;
        cache.set(cacheKey, channelId, config.cacheTimeout);
        return channelId;
      }

      // Fallback: search for channel
      const searchUrl = `${apiEndpoints.search}?part=snippet&type=channel&q=${encodeURIComponent(username)}&key=${config.apiKey}`;
      const searchData = await fetchWithRetry(searchUrl);

      if (searchData.items && searchData.items.length > 0) {
        const channelId = searchData.items[0].id.channelId;
        cache.set(cacheKey, channelId, config.cacheTimeout);
        return channelId;
      }

      throw new Error(CONFIG.ui.errorMessages.channelNotFound);
    } catch (error) {
      logger.error('Error fetching channel ID', error);
      throw error;
    }
  };

  /**
   * Fetch latest videos from channel
   * @param {string} channelId - YouTube channel ID
   * @returns {Promise<Array>}
   */
  const getChannelVideos = async (channelId) => {
    const cacheKey = `videos_${channelId}`;

    // Check cache
    const cachedVideos = cache.get(cacheKey);
    if (cachedVideos) {
      return cachedVideos;
    }

    try {
      const url = `${apiEndpoints.search}?key=${config.apiKey}&channelId=${encodeURIComponent(channelId)}&part=snippet,id&order=date&maxResults=${config.maxResults}&type=video`;

      const data = await fetchWithRetry(url);

      if (!data.items || data.items.length === 0) {
        throw new Error(CONFIG.ui.errorMessages.noVideos);
      }

      // Transform data
      const videos = data.items.map(transformVideoData);

      // Cache results
      cache.set(cacheKey, videos, config.cacheTimeout);

      return videos;
    } catch (error) {
      logger.error('Error fetching videos', error);
      throw error;
    }
  };

  /**
   * Get videos for configured channel
   * @returns {Promise<Array>}
   */
  const getVideos = async () => {
    logger.group('YouTube Service: Get Videos');

    try {
      const channelId = await getChannelId(config.channelUsername);
      logger.info('Channel ID retrieved', channelId);

      const videos = await getChannelVideos(channelId);
      logger.info('Videos fetched', { count: videos.length });

      return videos;
    } catch (error) {
      logger.error('Failed to get videos', error);
      throw error;
    } finally {
      logger.groupEnd();
    }
  };

  return { getVideos };
};

export const youtubeService = createYouTubeService();
