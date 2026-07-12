/**
 * Navigation Component
 * Handles responsive navigation and sidebar
 * Functional implementation using closures
 */

import { $, addEvent } from '../utils/dom.js';
import { logger } from '../utils/logger.js';

/**
 * Create navigation instance
 * @returns {Object} Navigation API
 */
const createNavigation = () => {
  let sidebar = null;
  let menuBtn = null;
  let closeBtn = null;
  let isOpen = false;
  const cleanupFunctions = [];

  /**
   * Setup accessibility features
   */
  const setupAccessibility = () => {
    if (sidebar) {
      sidebar.setAttribute('role', 'navigation');
      sidebar.setAttribute('aria-label', 'Mobile navigation');
      sidebar.setAttribute('aria-hidden', 'true');
    }

    if (menuBtn) {
      menuBtn.setAttribute('aria-label', 'Open navigation menu');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  };

  /**
   * Trap focus within sidebar
   */
  const trapFocus = () => {
    if (!sidebar) return;

    const focusableElements = sidebar.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const cleanup = addEvent(sidebar, 'keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });

    cleanupFunctions.push(cleanup);
  };

  /**
   * Open sidebar
   */
  const open = () => {
    if (!sidebar) return;

    sidebar.style.display = 'flex';
    sidebar.setAttribute('aria-hidden', 'false');
    menuBtn?.setAttribute('aria-expanded', 'true');
    isOpen = true;

    trapFocus();
    logger.info('Sidebar opened');
  };

  /**
   * Close sidebar
   */
  const close = () => {
    if (!sidebar) return;

    sidebar.style.display = 'none';
    sidebar.setAttribute('aria-hidden', 'true');
    menuBtn?.setAttribute('aria-expanded', 'false');
    isOpen = false;

    logger.info('Sidebar closed');
  };

  /**
   * Bind event listeners
   */
  const bindEvents = () => {
    // Menu button click
    if (menuBtn) {
      const cleanup1 = addEvent(menuBtn, 'click', (e) => {
        e.preventDefault();
        open();
      });
      cleanupFunctions.push(cleanup1);
    }

    // Close button click
    if (closeBtn) {
      const cleanup2 = addEvent(closeBtn, 'click', (e) => {
        e.preventDefault();
        close();
      });
      cleanupFunctions.push(cleanup2);
    }

    // Close on outside click
    const cleanup3 = addEvent(document, 'click', (e) => {
      if (isOpen && sidebar && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        close();
      }
    });
    cleanupFunctions.push(cleanup3);

    // Close on escape key
    const cleanup4 = addEvent(document, 'keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    });
    cleanupFunctions.push(cleanup4);

    // Handle sidebar links
    const sidebarLinks = sidebar?.querySelectorAll('a[href^="#"]');
    sidebarLinks?.forEach((link) => {
      const cleanup = addEvent(link, 'click', () => {
        close();
      });
      cleanupFunctions.push(cleanup);
    });
  };

  /**
   * Initialize navigation
   */
  const init = () => {
    sidebar = $('.sidebar');
    menuBtn = $('.menu-btn');
    closeBtn = $('.sidebar .close-sidebar');

    if (!sidebar || !menuBtn) {
      logger.warn('Navigation elements not found');
      return;
    }

    bindEvents();
    setupAccessibility();
    logger.info('Navigation initialized');
  };

  /**
   * Cleanup event listeners
   */
  const destroy = () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions.length = 0;
    logger.info('Navigation destroyed');
  };

  return { init, open, close, destroy };
};

export const navigation = createNavigation();
