'use strict';

const { version } = require('../../package.json');

/**
 * Options for a client.
 * @typeof {Object} clientOptions
 * @property {browser} [browser=''] The browser used on creation of driver.
 */

class Options extends null {
    static userAgentAppendix = `Quill.js/${version}`;

    static createDefault() {
        return {
            driver: 'ie',
            Headless: true,
            ProxyClnt: 'null',

            loopDelayLength: 200,
            MaxloopTterations: 100,
        }
    }
}

module.exports = Options;