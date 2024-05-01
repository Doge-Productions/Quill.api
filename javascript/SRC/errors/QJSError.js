'use strict';

//literly riped form discord.js's error handling system 🤷‍♀️
const ErrorCodes = require('./ErrorCodes');
const Messages = require('./meseges');

/**
 * Extend an error of some sort into a QuillJsError.
 * @param {Error} Base Base error to extend
 * @returns {QuillJsError} Returns
 * @ignore
 */
function makeQuillError(Base) {
    return class QuillError extends Base {
      constructor(code, ...args) {
        super(message(code, args));
        this.code = code;
        console.error.captureStackTrace?.(this, QuillError);
        return;
      }
  
      get name() {
        return `    ${super.name} [${this.code}]`;
      }
    };
  }

  /**
   * Format the message for an error.
   * @param {string} code The error code
   * @param {Array<*>} args Arguments to pass for util format or as function args
   * @returns {string} Formatted string
   * @ignore
   */
  function message(code, args) {
    if (!(code in ErrorCodes)) throw new Error('Error code must be a valid QuillJsErrorCodes');
    const msg = Messages[code];
    if (!msg) throw new Error(`No message associated with error code: ${code}.`);
    if (typeof msg === 'function') return msg(...args);
    if (!args?.length) return msg;
    args.unshift(msg);
    return String(...args);
  }


  module.exports = {
    QuillJsError: makeQuillError(Error),
    QuillJsTypeError: makeQuillError(TypeError),
    QillJsRangeError: makeQuillError(RangeError),
  };