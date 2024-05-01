'use strict';
const EventEmitter = require('node:events');
const {By, Builder, Capabilities, Key, until, promise} = require('selenium-webdriver'); //<-- Selenium Webdriver
const { QuillJsTypeError, ErrorCodes, QuillJsError } = require('../errors/index'); //<-- Import Error System --
const BaseClient = require('../client/BaseClient.js'); //<-- import the bace driver creation --
const Events = require('../util/Events.js'); //<-- Import Events --

class AccountManager extends EventEmitter {

  /**
     * Composes a new tweet(xeet).
     *     this will only open the compose tweet page and will not add anything to the tweet
     * @returns {Promise<string>} Promise that will be resolveon success or rejected
     * @example
     * draft = new client.draft();
     */
  constructor(Client) {
    super();

    /**
     * The client that instantiated this DraftManeger
     * @type {Client}
     * @readonly
     * @name DraftManeger#client
     */
    this.client = Client; // Store a reference to the Client instance

  }

  // Get Followers_num function

  // Get Following_num function

  // Get Posts_num function

  // Get Media_num function

  // Get Profile_link function

  // change Location function

  // Change Profile Picture function

  // Change Profile Banner function

  // Change Profile Name function

  // Change Profile Bio function

}

module.exports = 
{
    Account: AccountManager,
}
