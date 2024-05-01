'use strict';
const EventEmitter = require('node:events');
const Events = require('../util/Events.js'); //<-- Import Events --
const postConstructor = require('./postManeger.js');

/**
 * The client that instantiated this DraftManeger
 * @type {Client}
 * @readonly
 * @name DraftManeger#client
 */
class DraftManager extends EventEmitter {

  constructor(Client) {
    super();
    this.client = Client;

    // //initalise Post Manager and instently disolve it
    // const init = new postConstructor.post({ driver: this.client.driver, client: this.client });
  }

}

/**
 * composes a new tweet and keepes a url of the tweet for reading events later on.
 * @param {Array} Data - The data to be sent
 * @returns {Promise<string>} Promise that will be resolveon success or rejected
 * @private {this.url} The url used to accses the tweet.
 */
class send {

  constructor(Data = []) {
    this.data = Data;
    this.client = DraftManager.client;
    this.url;

    this.client.emit(Events.Debug, `Composing New Tweet...`);
    this.client.driver.get("https://twitter.com/compose/tweet").then(() => {

    this.client.driver.wait(until.elementLocated(By.xpath("(//div[@class='public-DraftStyleDefault-block public-DraftStyleDefault-ltr'])[1]"))).then(() => {

      console.log('boop');
      for(let i = 0; i < this.Data.length; i++){
        let compleat = false;

          console.log(i);
          var cData = this.data[i];
          console.log(cData);

          if(i > 0){ //check to see if we have to add a thread to this post.
            // add to thread
            this.client.driver.findElement(By.xpath("(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-1ceczpf r-lp5zef r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[1]")).click();
          }

          if(cData.txt){

            this.client.driver.wait(until.elementLocated(By.xpath(`(//div[@role='textbox'])[${i + 1}]`))).then((element) => {
        
              if(this.client.options.driver == "chrome"){ // <-- chrome dose not support emojies
                var regex =  /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g; // <-- serches for emojies and removes them
                var result = data.content.replace(regex, ' ');
                element.sendKeys(result);
              }
              else{
                element.sendKeys(cData.txt);
              }

            });

          }

          if(Data[i].media){
            this.client.driver.findElement(By.xpath(`(//input[@type='file'])[1]`))
            .then((element) => {
              element.sendKeys(Data[i].media);
            });
          }
            
          if(i == Data.length){ // finaly send the message.
            console.log('booperer erer');
            return new Promise((resolve, reject) => {
          
              this.client.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Post']")))
                .then((element) => {
                    
                  this.client.emit(Events.Debug, `Waiting for the tweet to be ready...`);
        
                    for(let i = 0; i <= this.client.options.MaxloopTterations; i++) {

                        setInterval(() => {
        
                          element.getAttribute("aria-disabled").then(() => {
        
                            this.client.emit(Events.Debug, `Sending Tweet...`); element.click();
                            
                            this.client.driver.getCurrentUrl().then((url) => { this.url = url; }); // get the curent url for latter use
                            resolve(); 
        
                          });
        
                        }, this.client.options.loopDelayLength);

                    }
        
                });
        
              // Alredy Sent!
              this.client.driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Whoops! You already said that.']"))).then((element) => {
                this.client.emit(Events.Warn, "You already said that")
                });
            });


          }




      }

    });
    
    });

  }

  /**
   * Sets a custome identifier for the message sent if you want to 
   * @param {*} options 
   * @returns 
   */
  SetCustomeId(options = {}) {
    this.Identifer = options.ID;
    this.store = this.client.posts;
    this.link = this.client.driver.getCurrentUrl();

    this.identifier = this.identifier.replace(/[!@#$%^&*()]/g, ' ');

    this.store.push( { id: this.identifier, Link: this.link } );

    return this.store;
  }

  /**
   * Gets the url of the tweet sent
   * @returns {string} The url of the tweet sent
   */
  GetUrl() {
    return this.client.driver.getCurrentUrl();
  }

  /**
   * opens up a past tweet you made and returns the amount of likes from that post. 
   */
  GetLikes(){
    this.client.driver.get(this.GetUrl);

  }

}

class tweetData{
  
  constructor(options = {}){
    
    this.txt = options.txt;
    this.media = options.media;


    return {txt: this.txt, media: this.media};
  }
}

// Making and object baced system below this for Nicer looking code. so far this system will be only for a beast computer and requiers a lot of cleen up after a post is sent!

module.exports = 
{
    Data: tweetData,
    Send: send,
    DraftManager: DraftManager,
    // Optinal stuff below
}
