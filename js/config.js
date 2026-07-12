/**
 * Application Configuration
 * Central configuration for the USM Church website
 */

export const CONFIG = {
  // YouTube API Configuration
  youtube: {
    apiKey: 'AIzaSyCNJY3B-JMZLGkIysS1GBES3XE216A5Jk8', // Replace with your actual API key
    channelUsername: 'usmchurch',
    maxResults: 8,
    cacheTimeout: 300000, // 5 minutes in milliseconds
  },

  // API endpoints
  api: {
    youtube: {
      channels: 'https://www.googleapis.com/youtube/v3/channels',
      search: 'https://www.googleapis.com/youtube/v3/search',
    },
  },

  // UI Configuration
  ui: {
    dateFormat: {
      locale: 'en-US',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    },
    errorMessages: {
      networkError: 'Unable to connect. Please check your internet connection.',
      apiError: 'Unable to load videos. Please try again later.',
      channelNotFound: 'Channel not found. Please verify the channel username.',
      noVideos: 'No videos available at the moment.',
      generic: 'Something went wrong. Please try again.',
    },
    loadingStates: {
      loading: 'Loading videos...',
      retrying: 'Retrying...',
    },
  },

  // Performance Configuration
  performance: {
    debounceDelay: 300,
    maxRetries: 3,
    retryDelay: 1000,
  },

  // Accessibility
  a11y: {
    skipToContentId: 'main-content',
    ariaLiveRegion: 'polite',
  },
};

// Environment-based configuration override
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  CONFIG.debug = true;
}
