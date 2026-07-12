/**
 * Main Application Entry Point
 * Initializes all components and services
 * Functional implementation using closures
 */

import { navigation } from './components/Navigation.js';
import { createYouTubeGallery } from './components/YouTubeGallery.js';
import { youtubeService } from './services/youtubeService.js';
import { logger } from './utils/logger.js';
import { addEvent, $, throttle } from './utils/dom.js';

/**
 * Create application instance
 * @returns {Object} Application API
 */
const createApp = () => {
  let youtubeGallery = null;
  const cleanupFunctions = [];

  /**
   * Initialize YouTube video gallery
   */
  const initYouTubeGallery = () => {
    const container = $('.yt');
    if (!container) {
      logger.warn('YouTube container not found');
      return;
    }

    youtubeGallery = createYouTubeGallery('.yt');

    // Load videos
    youtubeGallery.load(() => youtubeService.getVideos());

    // Refresh on visibility change (when user returns to tab)
    const cleanup = addEvent(document, 'visibilitychange', () => {
      if (!document.hidden && youtubeGallery) {
        // Optionally refresh videos when tab becomes visible
        // youtubeGallery.refresh(() => youtubeService.getVideos());
      }
    });

    cleanupFunctions.push(cleanup);
  };

  /**
   * Setup smooth scrolling for anchor links
   */
  const setupSmoothScrolling = () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      const cleanup = addEvent(link, 'click', (e) => {
        const href = link.getAttribute('href');

        if (href === '#' || href === '#!') {
          e.preventDefault();
          return;
        }

        const target = $(href);
        if (target) {
          e.preventDefault();

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL without scrolling
          history.pushState(null, '', href);

          // Set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });

      cleanupFunctions.push(cleanup);
    });

    logger.info('Smooth scrolling enabled');
  };

  /**
   * Setup accessibility features
   */
  const setupAccessibility = () => {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Mark main content area
    const homeSection = $('#home');
    if (homeSection) {
      homeSection.id = 'main-content';
      homeSection.setAttribute('role', 'main');
    }

    // Announce page changes for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    logger.info('Accessibility features initialized');
  };

  /**
   * Setup performance monitoring
   */
  const setupPerformanceMonitoring = () => {
    // Monitor scroll performance
    let lastScrollTime = Date.now();

    const scrollHandler = throttle(() => {
      const now = Date.now();
      const scrollDuration = now - lastScrollTime;

      if (scrollDuration > 16.67) {
        // More than 60fps
        logger.warn('Slow scroll detected', { duration: scrollDuration });
      }

      lastScrollTime = now;
    }, 100);

    const cleanup = addEvent(window, 'scroll', scrollHandler, { passive: true });
    cleanupFunctions.push(cleanup);

    // Log load time with modern Performance API
    if (window.performance?.getEntriesByType) {
      window.addEventListener('load', () => {
        const perfData = window.performance.getEntriesByType('navigation')[0];
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.fetchStart;
          logger.info('Page load time', { duration: `${Math.round(loadTime)}ms` });
        }
      });
    }
  };

  /**
   * Initialize application
   */
  const init = async () => {
    logger.info('Initializing USM Church Website');

    try {
      // Initialize navigation
      navigation.init();

      // Initialize YouTube gallery
      initYouTubeGallery();

      // Setup smooth scrolling
      setupSmoothScrolling();

      // Setup accessibility features
      setupAccessibility();

      // Setup performance monitoring
      setupPerformanceMonitoring();

      logger.info('Application initialized successfully');
    } catch (error) {
      logger.error('Application initialization failed', error);
    }
  };

  /**
   * Cleanup application
   */
  const destroy = () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions.length = 0;
    navigation.destroy();
    logger.info('Application destroyed');
  };

  return { init, destroy };
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = createApp();
    app.init();

    // Make app available globally for debugging
    window.usmApp = app;
  });
} else {
  const app = createApp();
  app.init();
  window.usmApp = app;
}
