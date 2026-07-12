/**
 * Logger Utility
 * Centralized logging with environment awareness
 * Functional implementation using closures
 */

import { CONFIG } from '../config.js';

/**
 * Create a logger instance
 * @returns {Object} Logger API
 */
const createLogger = () => {
  const isDebugMode = CONFIG.debug || false;

  /**
   * Log info messages
   * @param {string} message - Message to log
   * @param {*} data - Additional data
   */
  const info = (message, data = null) => {
    if (isDebugMode) {
      console.log(`[INFO] ${message}`, data || '');
    }
  };

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {*} data - Additional data
   */
  const warn = (message, data = null) => {
    console.warn(`[WARN] ${message}`, data || '');
  };

  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  const error = (message, error = null) => {
    console.error(`[ERROR] ${message}`, error || '');
  };

  /**
   * Group related logs
   * @param {string} label - Group label
   */
  const group = (label) => {
    if (isDebugMode) {
      console.group(label);
    }
  };

  /**
   * End log group
   */
  const groupEnd = () => {
    if (isDebugMode) {
      console.groupEnd();
    }
  };

  return { info, warn, error, group, groupEnd };
};

export const logger = createLogger();
