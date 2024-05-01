'use strict';
const EventEmitter = require('node:events'); // <-- Event Emitter
const Events = require('../util/Events.js'); //<-- Import Events
const {By, Builder, Capabilities, Key, until, promise, BrowsingContext} = require('selenium-webdriver'); //<-- Selenium Webdriver
const { QuillJsTypeError, ErrorCodes, QuillJsError } = require('../errors/index.js'); //<-- Import Error System --


/**
 * the post object used for creating a post!
 * > This is only for beast computers and is not ussfull unless you want live monetering of a post.
 * @extends EventEmitter
 * @returns {promise} Promise that will be resolveon success or rejected on a sucsessfull post!
 * @returns {TabUrl} The url of the tweet sent!
 */
class post extends EventEmitter{

    /** 
     * inits with the clients driver
     * @param {{}} [options={}] - The options for the post 
     */
    constructor(options = {}){
        super();
    
        return new Promise((resolve, reject) => {

            if(options.client || options.driver){
                // init the driver and client class
                G_client = options.client;
                G_driver = options.driver;
                // options.client.emit(Events.Debug, `INIT PostManager.`);
            } else {
                this.driver = G_driver;
                this.client = G_client;

                this.client.emit(Events.Debug, `[Post Manager] Opening new compose tab.`);
                // open new tab for tweet
                this.driver.get('https://twitter.com/compose/tweet').then(() => {
                    resolve();
                });
                
            }

        });
  
    }
  
    /**
     * Closes the Tiab that the current post is on
     * @returns {URL} the url that links to the post
     */
    dissolve(){
      this.url = this.post.getCurrentUrl();
      this.post.close();
      
      return this.url;
    }
  
    /**
     * Adds content to the tweet that is being composed.
     * ->  If you want to make the tweet a tread use the contentArray and add multiple content objects to the array.
     * @param {*} param0 
     * @returns {Promise<string>} Promise that will be resolveon success or rejected
     */
    addContnent(options = { contentArray: Array, text: string, media: string }){
  
      return new Promise((resolve, reject) => {
  
        if(!options.contentArray && !options.text || !options.contentArray && !options.media) return new QuillJsError("canot create content without any content");
  
          // use the contentArray as your data input. meaning that you can make this post a thread.
        if(options.contentArray) {
          //use content array.
          this.data = contentArray;
  
          for(let i = 0; i < this.Data.length; i++){
            var cData = this.data[i];
    
            if(i > 0){ //check to see if we have to make this post a tread.
              this.post.findElement(By.xpath("(//div[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-1ceczpf r-lp5zef r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l'])[1]")).click();
            }
    
            if(cData.txt){
    
              this.post.wait(until.elementLocated(By.xpath(`(//div[@role='textbox'])[${i + 1}]`))).then((element) => {
            
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
              this.post.findElement(By.xpath(`(//input[@type='file'])[1]`))
              .then((element) => {
              element.sendKeys(Data[i].media);
              });
            }
              
            resolve();
          }
          
        } else if(text) {
          //add text to post.
          this.client.driver.wait(until.elementLocated(By.xpath(`(//div[@role='textbox'])[${i + 1}]`))).then((element) => {
            
            if(this.client.options.driver == "chrome"){ // <-- chrome dose not support emojies
              var regex =  /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]/g; // <-- serches for emojies and removes them
              var result = text.content.replace(regex, ' ');
              element.sendKeys(result);
            }
            else{
              element.sendKeys(text);
            }
  
          });
  
        } else if(media) {
          //add media to post.
          this.client.driver.findElement(By.xpath(`(//input[@type='file'])[1]`))
            .then((element) => {
            element.sendKeys(media);
            });
  
        }
  
      });
    }
  
    /**
     * Send the draft you made to twitter
     * @returns {Promise<string>} Promise that will be resolveon success or rejected
     */
    send(){
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
  
    /**
     * Get the Number of veiwes the bots post has.
     * @returns {promises<string>} A promise that resolves or rejects with the total number of veiws on a post specified.
     */
    GetViews(){
      return new Promise((resolve, reject) => {
        this.client.driver.refresh().then((response) => {
          if (response === '404') return new QuillJsError(ErrorCodes.PageCode404, ' -Msg refresh failed | Call Stack: DraftManager.js > Class: Post() > FN: GetViews > FN: this.client.driver.refresh().then((response) => { |');
  
          this.client.wait(until.elementLocated(By.xpath("(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'])[25]"))).then((element) => {
            resolve (element.getText());
          });
  
        });
      });
    }
  
    /**
     * Gets the likes of the tweet that you sent
     * @returns {promises<string>} A promise that will resolve or reject with the total number of likes on a post specified.
     */
    GetLikes(){
      return new Promise((resolve, reject) => {
        this.client.driver.refresh().then((response) => {
          if (response === '404') return new QuillJsError(ErrorCodes.PageCode404, ' -Msg refresh failed | Call Stack: DraftManager.js > Class: Post() > FN: GetLikes > FN: this.client.driver.refresh().then((response) => { |');
  
          this.client.wait(until.elementLocated(By.xpath("(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'][normalize-space()='9'])[1]"))).then((element) => {
            resolve (element.getText());
          });
  
        });
      });
    }
  
    /**
     * Gets the number of retweets on the tweet that the bot sent
     * @returns {promises<string>} A promise that will resolve or reject with the total number of retweets on a post specified.
     */
    GetRetweetsNum(){
      return new promise((resolve, reject) => {
        this.client.driver.refresh().then((response) => {
          if (response === '404') return new QuillJsError(ErrorCodes.PageCode404, ' -Msg refresh failed | Call Stack: DraftManager.js > Class: Post() > FN: GetRetweetsNum > FN: this.client.driver.refresh().then((response) => { |');
  
          this.client.wait(until.elementLocated(By.xpath("(//span[@class='css-1qaijid r-bcqeeo r-qvutc0 r-poiln3'][normalize-space()='24'])[1]"))).then((element) => {
            resolve (element.getText());
          });
        });
      });
    }
  
    // get retweets_links [] function
  
    // get quotes_num finction
  
    // get quotes_links function
  
    // get replies_num function
  
    // get replies_links function
  
    // get bookmarks function
  
    // getcomments number function
  
    // get comments function
  
    // Pin post function

    // Delete post function
  
  }
  
  var G_client;
  var G_driver;

    module.exports = {
        post: post,
    };