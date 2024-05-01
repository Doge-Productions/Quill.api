'use strict';

const EventEmitter = require('node:events');
const Options = require('../util/options');
const { QuillJsTypeError, ErrorCodes } = require('../errors');

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
    constructor(options = {}) {
      super({ captureRejections: true });
  
      if (typeof options !== 'object' || options === null) {
        throw new QuillJsTypeError(ErrorCodes.InvalidType, 'options', 'object', true);
      }
  
      const defaultOptions = Options.createDefault();
      /**
       * The options the client was instantiated with
       * @type {ClientOptions}
       */
      this.options = {
        ...defaultOptions,
        ...options,
      driver: typeof options.driver === 'object' ? { 
        ...defaultOptions.driver, 
        ...options.driver } : options.driver,
      Headless: typeof options.Headless === 'object' ? {
        ...defaultOptions.Headless,
        ...options.Headless } : options.Headless,
      ProxyClnt: typeof options.ProxyClnt === 'object' ? { 
        ...defaultOptions.ProxyClnt,
        ...options.ProxyClnt } : options.ProxyClnt,
      loopDelayLength: typeof options.loopDelayLength === 'object' ? { 
        ...defaultOptions.loopDelayLength,
        ...options.loopDelayLength } : options.loopDelayLength,
      MaxloopTterations: typeof options.MaxloopTterations === 'object' ? {
        ...defaultOptions.MaxloopTterations,
        ...options.MaxloopTterations } : options.MaxloopTterations,
      };
      
    }
}

module.exports = BaseClient;