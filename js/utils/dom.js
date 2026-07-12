/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

import { logger } from './logger.js';

/**
 * Safely query selector
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    logger.error(`Invalid selector: ${selector}`, error);
    return null;
  }
}

/**
 * Safely query selector all
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element
 * @returns {NodeList}
 */
export function $$(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (error) {
    logger.error(`Invalid selector: ${selector}`, error);
    return [];
  }
}

/**
 * Create element with attributes and children
 * @param {string} tag - HTML tag
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text
 * @returns {Element}
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('aria-') || key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });

  // Append children
  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Sanitize HTML string to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
export function addEvent(element, event, handler, options = {}) {
  if (!element || !event || !handler) {
    logger.warn('Invalid event listener parameters');
    return () => {};
  }

  element.addEventListener(event, handler, options);

  return () => {
    element.removeEventListener(event, handler, options);
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Target element
 * @param {number} offset - Offset in pixels
 * @returns {boolean}
 */
export function isInViewport(element, offset = 0) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}
