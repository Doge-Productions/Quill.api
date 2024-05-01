'use strict';

/**
 * @typedef {Object} Events
 * @property {string} ClientReady ready
 * @property {string} Debug debug
 * @property {string} Warn warn
 * @property {string} Error error
 */

// JSDoc for IntelliSense purposes vv
/**
 * @type {Events}
 * @ignore
 */
module.exports = {
  ClientReady: 'ready',
  ClientBuilt: 'built', // <-- Deprecated

  DraftReady: 'dfready',

  TaskDone: 'taskDone',

  Debug: 'debug',
  Warn: 'warn',
  Error: 'error',
};