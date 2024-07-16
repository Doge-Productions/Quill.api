"use strict";

const {By, Builder, Capabilities, Key, until, promise} = require('selenium-webdriver'); //<-- Selenium Webdriver
const { QuillJsTypeError, ErrorCodes, QuillJsError } = require('../errors/index.js'); //<-- Import Error System --
const BaseClient = require('./BaseClient.js'); //<-- import the bace driver creation --
const Options = require('../util/options.js'); //<-- Not used right now --
const fs = require('fs'); // <-- File System for cookies --
const { DraftManager } = require('../managers/DraftManager.js'); //<-- Import Draft Manager --
const proxy = require('selenium-webdriver/proxy'); //<-- Selenium Webdriver Proxy Support!
const validDrivers = require('../util/validDrivers.json'); //<-- Import All ValidDriver types --
const Events = require('../util/Events.js'); //<-- Import Events --
const CookieManeger = require('../managers/CookiesManeger.js'); //<-- Import Cookie Manager --
const postConstructor = require('../managers/postManeger.js');



// Import all supported Selenium drivers
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const safari = require('selenium-webdriver/safari');
const ie = require('selenium-webdriver/ie');
const { text } = require('stream/consumers');



/**
 * The base class for all clients. v
 * @extends BaseClient
 */
class Client extends BaseClient {
    /**
    * @param {ClientOptions} options Options for the client
    */
    constructor(options) {
        super(options);    
                    // const defaults = Options.createDefault(); < -- Not used 
        this.emit(Events.Debug, `[Client] Validationg options`);       
        this._validateOptions(options);
            let DRoptions;
        switch (options.driver) { //<-- Create options for the rite driver
                case "chrome":
                    DRoptions = new chrome.Options();
                    break;
                case "firefox":
                    DRoptions = new firefox.Options();
                    break;
                case "edge":
                    DRoptions = new edge.Options();
                    break;
                case "safari":
                    DRoptions = new safari.Options();
                    break;
                case "ie":
                    DRoptions = new ie.Options();
                    break;
                default:
                    throw new QuillJsTypeError(ErrorCodes.clientInvalidDriver, options.driver, validDrivers);
            }

       try
       {
          this.emit(Events.Debug, `[Client] Adding driver arguments`);   
            // alwayes added
            DRoptions.addArguments('--lang=en');

            // checks
            if (options.ProxyClnt) 
            {
              this.emit(Events.Debug, `[Client] initilising Proxy Client`);   
                // this.emit(Events.Debug, `Using Proxy Client with: ${options.ProxyClnt}`);
                // DRoptions.setProxy(proxy.manual(options.ProxyClnt));
                // /**
                // * Networking Manager of the client
                // * @type {NetworkManager}
                // */
                // this.network = new Network({ Client: this, cltOptions: options});   
                
            }
            if(options.Headless)
            {
                this.emit(Events.Debug, `[!] The Driver will be opend in hedless mode`);   
                DRoptions.addArguments('--headless');
            }
                
       } finally 
       {
        this.emit(Events.Debug, `[Client] Opening Driver Window`);
        switch (options.driver) {
            case "chrome":
                this.driver = new Builder().forBrowser(options.driver).setChromeOptions(DRoptions).build();
                break;
            case "firefox":
                    this.driver = new Builder().forBrowser(options.driver).setFirefoxOptions(DRoptions).build();
                break;
            case "edge":
                this.driver = new Builder().forBrowser(options.driver).setEdgeOptions(DRoptions).build();
                break;
            case "safari":
                this.driver = new Builder().forBrowser(options.driver).setSafariOptions(DRoptions).build();
                break;
            case "ie":
                this.driver = new Builder().forBrowser(options.driver).setIeOptions(DRoptions).build();
                break;
            default:
                throw new QuillJsTypeError(ErrorCodes.clientInvalidDriver, options.driver, validDrivers);
        }

        /**
        * Options for the driver return
        */
        this.driverOptions = DRoptions;
       }
       

        /**
        * Draft Manager Of the client
        * @type {DraftManager}
        */
        this.emit(Events.Debug, `[Client] Init Draft Manager`);   
        this.draft = new DraftManager(this);  
        this.emit(Events.Debug, `[!] Warning The Draft Maneger Has ben depricated`);   

        /**
        * init the post manager with created class for refrensing
        */
        this.emit(Events.Debug, `[Client] Init Post Manager`);
        const init = new postConstructor.post({ driver: this.driver, client: this });

        /**
         * global little guy to store id's of sent messages.
         */
        this.posts = [];
    }
  


    /**
        * Logs the client in, establishing a conection To twitter.
        * @param {string} [token=this.token] Login info of the account to log in with
        * @returns {Promise<string>} Token of the account used
        * @example
        * client.login(username:"Display Name", password:"Password", cookies: JSONpath);
    */
    login(options = {}) {
       
        // this.emit(Events.Debug, `Provided Info: Uname: ${options.username} | Pwrd: ${"*".repeat(options.password.length)}`);

        if (typeof options.username !== 'string') 
        {
            throw new QuillJsTypeError(ErrorCodes.InvalidType, options.username, "String");
        } 
        else if (typeof options.password !== 'string') 
        {
            throw new QuillJsTypeError(ErrorCodes.InvalidType, options.password, "String");
        } 
        else 
        {
            this.emit(Events.Debug, `[Client] Attempting login`);

            this.driver.get('https://x.com/i/flow/login', (err) => {
                if (err) 
                {
                    this.emit(Events.Debug, `    Driver Get Error: ${err}`);
                }
                else 
                {
                    this.emit(Events.Debug, `    Nav Sucsess`);
                }
            });

            this.driver.get('https://x.com/home', (err) => {
              if (err) {
                  this.emit(Events.Debug, `    Driver Get Error: ${err}`);
              } else {
                  this.emit(Events.Debug, `    Nav Sucsess`);
              }
            });   

            if(!options.cookies) { // Load without cookies
              this.driver.wait(until.elementLocated(By.xpath("(//input[@name='text'])[1]"))).then((element) => {
                this.emit(Events.Debug, `[Client] Going to Twitter home`);
                this.driver.get("https://x.com", (err) => {
                  if (err) {
                      this.emit(Events.Debug, `Driver Get Error: ${err}`);
                  } else {
                      this.emit(Events.Debug, ` Nav Sucsess`);
                  }

                  }).then(() => {
                    this.emit(Events.Debug, `[client] Refreshing`);
                      this.driver.get("https://x.com/home").then(() => {
                          this.driver.get("https://x.com/home").then(() => {
                              this.driver.get("https://x.com/home").then(() => {
                                  this.emit(Events.ClientReady)
                                });
                            });
                        });

                  });
                  
              });
            } else if(CookieManeger.objectExists(options.cookies, options.username)){

              this.emit(Events.Debug, `[Client] Using Cookies`);  
              CookieManeger.Load(options.cookies, options.username, this.driver).then((out) => {
                this.emit(Events.Debug, `[Client] Validationg Cookies`);   
                if (out == 7) {
                  this.emit(Events.Debug, `[DEV!!] X idk why I put this here but its debug thats for shure`);   
                    //wait for isername popup to appear
                  this.driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/label[1]/div[1]/div[2]/div[1]/input[1]"))).then((element) => {
                    throw new QuillJsError(ErrorCodes.LoginGatwayDetected, "Try again Using cookies or create the driver without --headless when constructing the client and manuly follow the steps!");
                  });

                    //check it account is valid
                  this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Sorry, we could not find your account.']"))).then((element) => {
                      throw new QuillJsError(ErrorCodes.LoginWrongUsername, options.username, "144");
                  });

                    //type in the password when it apperes
                  this.driver.wait(until.elementLocated(By.xpath("(//input[@name='password'])[1]"))).then((element) => {
                    this.emit(Events.Debug, `Sending Password! ${"*".repeat(options.password.length)}`);

                    element.sendKeys(options.password).then(() => {

                      element.sendKeys(Key.ENTER);
                      this.emit(Events.Debug, `NEXT!`);

                      for(let i = 0; i < this.options.loop; i++) {

                        element.sendKeys(Key.ENTER).then(() => {
                        });

                      }

                    }); 

                  });

                    //check for wrong password popup
                  this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Wrong password!']"))).then((element) => {
                      throw new QuillJsError(ErrorCodes.LoginWrongPassword, "*".repeat(options.password.length), "156");
                  });

                    //check for login gate way
                  this.driver.wait(until.elementLocated(By.xpath("(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'])[3]"))).then((element) => {
                    return new QuillJsError(ErrorCodes.LoginGatwayDetected, "loging in with cookies or login on difrent device");
                  });

                    //wait for login to be completed
                  this.driver.wait(until.urlIs("https://x.com/home")).then(() => {
                    this.emit(Events.Debug, `Saving Cookies...`);

                    this.driver.manage().getCookies().then((cookies) => {

                      CookieManeger.Save(cookies, options.cookies, options.username).then(() => {
                        this.emit(Events.ClientReady);
                      });
                      
                    });

                  });
                  
                } else {

                  this.emit(Events.Debug, `[Client] Reloading Page`);   

                  this.driver.get("https://x.com/home").then(() => {
                    this.driver.get("https://x.com/home").then(() => {
                      this.driver.get("https://x.com/home").then(() => {
                        this.driver.get("https://x.com/home").then(() => {

                          this.emit(Events.Debug, `[Client] Client Sucsefully Loaded with cookies!`);   
                          this.emit(Events.ClientReady);
                          
                        });
                      });
                    });
                  });

                }
              });

            } else if(!CookieManeger.objectExists(options.cookies, options.username) && options.cookies) { // check to see if the username is not in the file but the cookies peramiter is used.
              // Login to twitter and save cookies
              this.driver.wait(until.elementLocated(By.xpath("(//input[@name='text'])[1]"))).then((element) => {

                this.emit(Events.Debug, `Sending Username! ${options.username}`);

                element.sendKeys(options.username).then(() => { 

                  this.emit(Events.Debug, `NEXT!`);
                  element.sendKeys(Key.ENTER) // sends enter key to go to next page.

                });

              });
                    
                //wait for isername popup to appear
              this.driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[2]/label[1]/div[1]/div[2]/div[1]/input[1]"))).then((element) => {
                      throw new QuillJsError(ErrorCodes.LoginGatwayDetected, "Try again Using cookies or create the driver without --headless when constructing the client and manuly follow the steps!");
              });

                //check it account is valid
              this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Sorry, we could not find your account.']"))).then((element) => {
                  throw new QuillJsError(ErrorCodes.LoginWrongUsername, options.username, "144");
              });

                //type in the password when it apperes
              this.driver.wait(until.elementLocated(By.xpath("(//input[@name='password'])[1]"))).then((element) => {
                this.emit(Events.Debug, `Sending Password! ${"*".repeat(options.password.length)}`);

                element.sendKeys(options.password).then(() => {

                  element.sendKeys(Key.ENTER);
                  this.emit(Events.Debug, `NEXT!`);

                  for(let i = 0; i < this.options.loop; i++) {

                    element.sendKeys(Key.ENTER).then(() => {
                    });

                  }

                }); 

              });

                //check for wrong password popup
              this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Wrong password!']"))).then((element) => {
                  throw new QuillJsError(ErrorCodes.LoginWrongPassword, "*".repeat(options.password.length), "156");
              });

                //check for login gate way
              this.driver.wait(until.elementLocated(By.xpath("(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'])[3]"))).then((element) => {
                return new QuillJsError(ErrorCodes.LoginGatwayDetected, "loging in with cookies or login on difrent device");
              });

                //wait for login to be completed
              this.driver.wait(until.urlIs("https://x.com/home")).then(() => {
                this.emit(Events.Debug, `Saving Cookies...`);

                this.driver.manage().getCookies().then((cookies) => {

                  CookieManeger.Save(cookies, options.cookies, options.username).then(() => {
                    this.emit(Events.ClientReady);
                  });
                  
                });

              });

        
            }

        }
    }



    /**
     * Validates the options passed to the client.

     * @param {Object} options Options to validate
     * @returns {Promise<void>} Valid options
     * Used only For by the program. no need to use this.
    */
    _validateOptions(options = this.options) {
        return new Promise((resolve, reject) => {
                this.emit(Events.Debug, `Validating Options...`);
            if (!validDrivers.includes(options.driver)) {
                throw new QuillJsTypeError(ErrorCodes.clientInvalidDriver, options.driver, validDrivers);
            } else {
                resolve();
            }
        });
    }



    /**
     * Exits the client and destroys it.
     * @param {fullwipe} [fulwipe = options.fullwipe] - to Destroy evrything including cookies.json. ! DANGER ZONE !
     * @param {path} [path = options.path] - the path to the cookies.json file. ! only used for a full wipe !
     
     * @example client.Exit(options = { fullwipe: false });
     */
    Destroy(options)
    {
        if (options.fullwipe)
        {
            CookieManeger.wipeJSON(options.path);
        }
        this.driver.quit();
        super.destroy();
    }

    Send(Data = []) {    
        this.emit(Events.Debug, `Composing New Tweet...`);
        this.driver.get("https://x.com/compose/tweet").then(() => {

          for(let i = 0; i <= Data.length; i++){
    
            if(i > 0){
              // add to thread
              this.driver.findElement(By.xpath("//div[@aria-label='Add post']")).click();
            }
    
            if(Data[i].txt){
              this.driver.findElement(By.xpath(`(//div[@aria-label='Post text'])[${i + 1}]`)).then((element) => {
    
                if(this.driver.getType() == "chrome"){ // <-- chrome dose not support emojies
                  var regex =  /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g; // <-- serches for emojies and removes them
                  var result = data.content.replace(regex, ' ');
                  element.sendKeys(result);
                }
                else{
                  element.sendKeys(Data[i].txt);
                }
    
              });
            }
    
            if(Data[i].media){
              this.driver.findElement(By.xpath(`(//input[@aria-label='Add photos or video'])[${i + 1}]`))
              .then((element) => {
                element.sendKeys(Data[i].media);
              });
            }
              
            if(i == Data.length){
              return new Promise((resolve, reject) => {
            
                this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Post']")))
                  .then((element) => {
                      
                    this.emit(Events.Debug, `Waiting for the tweet to be ready...`);
          
                      for(let i = 0; i <= this.options.MaxloopTterations; i++) {
                          setInterval(() => {
          
                            element.getAttribute("aria-disabled").then(() => {
          
                              this.emit(Events.Debug, `Sending Tweet...`);
                              element.click();
                              resolve(); 
          
                            });
          
                          }, this.options.loopDelayLength);
                      }
          
                  });
          
                // Alredy Sent!
                CL.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Whoops! You already said that.']"))).then((element) => {
                    CL.emit(Events.Warn, "You already said that")
                  });
              });
            }
          }
    
        });
      }



//  \/ Depricated functions Might be removed in the future \/ 

    draft_Tweet() {
        return new Promise((resolve, reject) => {
            this.emit(Events.Debug, `Composing New Tweet...`);
            this.driver.get("https://x.com/compose/tweet").then(() => {
              resolve();
            });
          });
    }



    /**
   * Adds a bit of text to the draft you just created.
   * -    Make shure you make a new draft before you do this othorwise thigs will mess up
   * @param {string} [token=this.token] Login info of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login(username:"Display Name", numbmail:"Email / Phone Numb", password:"Password");
   */
  addText(text) {
    return new Promise((resolve, reject) => {
      this.driver
        .wait(
          until.elementLocated(By.xpath("(//div[@aria-label='Post text'])[1]"))
        )
        .then((element) => {
          this.emit(Events.Debug, `Adding Text: ${text}`);
          element.sendKeys(text).then(() => {
            resolve();
          });
        });
    });
  }



  /**
   * Adds an imige to the draft you created
   * -    Make shure you make a new draft before you do this othorwise thigs will mess up
   * @param {string} [token=this.token] Login info of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login(username:"Display Name", numbmail:"Email / Phone Numb", password:"Password");
   */
  addMedia(Path) {

    return new Promise((resolve, reject) => {

      this.driver.wait( until.elementLocated(By.xpath("//input[@type='file']")) ).then((element) => {
          this.emit(Events.Debug, `Adding Media: ${Path}`);
      
          element.sendKeys(Path).then(() => {
            resolve();
          });

        });

    });

  }



  /**
   * Sends the draft you just created.
   *
   */
  Send() {
    return new Promise((resolve, reject) => {
        
      this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Post']")))
        .then((element) => {
            
          this.emit(Events.Debug, `Waiting for the tweet to be ready...`);

            for(let i = 0; i <= this.options.MaxloopTterations; i++) {
                setInterval(() => {

                  element.getAttribute("aria-disabled").then(() => {

                    this.emit(Events.Debug, `Sending Tweet...`);
                    element.click();
                    resolve(); 

                  });

                }, this.options.loopDelayLength);
            }

        });

      // Alredy Sent!
      this.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Whoops! You already said that.']"))).then((element) => {
          this.emit(Events.Warn, "You already said that")
        });
    });
  }

}

  module.exports = { 
    Client,
  };

////////////////////////////////////////////////////
//  © 2023 DogeProductions. All rights reserved.  //
////////////////////////////////////////////////////

