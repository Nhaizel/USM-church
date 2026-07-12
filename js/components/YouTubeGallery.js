/**
 * YouTube Gallery Component
 * Displays YouTube videos in a responsive grid
 * Functional implementation using closures
 */

import { $, createElement, sanitizeHTML } from '../utils/dom.js';
import { logger } from '../utils/logger.js';
import { CONFIG } from '../config.js';

/**
 * Create YouTube gallery instance
 * @param {string} containerSelector - CSS selector for container
 * @returns {Object} Gallery API
 */
const createYouTubeGallery = (containerSelector) => {
  const container = $(containerSelector);

  /**
   * Create video card element
   * @param {Object} video - Video data
   * @returns {Element}
   */
  const createVideoCard = (video) => {
    const formattedDate = video.publishedAt.toLocaleDateString(
      CONFIG.ui.dateFormat.locale,
      CONFIG.ui.dateFormat.options
    );

    const videoLink = createElement(
      'a',
      {
        href: `https://www.youtube.com/watch?v=${video.id}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Watch ${sanitizeHTML(video.title)} on YouTube`,
      },
      [
        createElement('img', {
          src: video.thumbnail.medium || video.thumbnail.default,
          alt: sanitizeHTML(video.title),
          loading: 'lazy',
          width: '320',
          height: '180',
        }),
        createElement('div', { className: 'video-info' }, [
          createElement('h3', {}, sanitizeHTML(video.title)),
          createElement(
            'p',
            { className: 'video-date' },
            createElement('time', { datetime: video.publishedAt.toISOString() }, formattedDate)
          ),
        ]),
      ]
    );

    const card = createElement(
      'article',
      {
        className: 'video-card',
        dataset: { videoId: video.id },
      },
      [videoLink]
    );

    return card;
  };

  /**
   * Show loading state
   */
  const showLoading = () => {
    if (!container) return;

    container.innerHTML = '';

    const loadingElement = createElement(
      'div',
      {
        className: 'loading-state',
        'aria-live': CONFIG.a11y.ariaLiveRegion,
        'aria-busy': 'true',
      },
      [createElement('p', {}, CONFIG.ui.loadingStates.loading)]
    );

    container.appendChild(loadingElement);
  };

  /**
   * Show error state
   * @param {string} message - Error message
   */
  const showError = (message) => {
    if (!container) return;

    container.innerHTML = '';

    const errorElement = createElement(
      'div',
      {
        className: 'error-state',
        role: 'alert',
        'aria-live': CONFIG.a11y.ariaLiveRegion,
      },
      [createElement('p', { className: 'error-message' }, sanitizeHTML(message))]
    );

    container.appendChild(errorElement);
    logger.error('Gallery error displayed', message);
  };

  /**
   * Render videos
   * @param {Array} videoList - Array of video data
   */
  const render = (videoList) => {
    if (!container) {
      logger.error('Gallery container not found');
      return;
    }

    container.innerHTML = '';

    if (!videoList || videoList.length === 0) {
      showError(CONFIG.ui.errorMessages.noVideos);
      return;
    }

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    videoList.forEach((video) => {
      const card = createVideoCard(video);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
    container.setAttribute('aria-busy', 'false');

    logger.info('Videos rendered', { count: videoList.length });
  };

  /**
   * Load and display videos
   * @param {Function} fetchVideos - Function that returns Promise<Array>
   */
  const load = async (fetchVideos) => {
    try {
      showLoading();
      const fetchedVideos = await fetchVideos();
      render(fetchedVideos);
    } catch (error) {
      logger.error('Failed to load videos', error);

      let errorMessage = CONFIG.ui.errorMessages.generic;

      if (error.message.includes('Channel not found')) {
        errorMessage = CONFIG.ui.errorMessages.channelNotFound;
      } else if (error.message.includes('No videos')) {
        errorMessage = CONFIG.ui.errorMessages.noVideos;
      } else if (!navigator.onLine) {
        errorMessage = CONFIG.ui.errorMessages.networkError;
      } else {
        errorMessage = CONFIG.ui.errorMessages.apiError;
      }

      showError(errorMessage);
    }
  };

  /**
   * Refresh videos
   * @param {Function} fetchVideos - Function that returns Promise<Array>
   */
  const refresh = async (fetchVideos) => {
    logger.info('Refreshing videos');
    await load(fetchVideos);
  };

  return { showLoading, showError, render, load, refresh };
};

export { createYouTubeGallery };
