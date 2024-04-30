# QuickStart

we will teach you how to get your first bot up and running. this tutorial will guide you making a bot that makes a single message. you will have to make the message generation.

## Installation

- Stable

```bash
 Not Available Yet
```

- experimental

```bash
  npm i quill.api-test
```

---

## Getting Started

1) First, we will need to create a new account on Twitter.
Make sure you remember the username and password for the bot, as we will need to use it in the future.

2) We will then create a new Quill Client instance. Lets also import the node:path to make it easier to reed the cookies file letter on.

```javascript
'use strict';
const { Client, DraftManager } = require("quill.api-test");
const path = require('node:path');
```

3) Now that that's done, we will create a new Quill Client instance with the setting you want.

```javascript
const client = new Client({
    driver: "firefox",
    Headless: true,
});
```

4) This is where you will put in your login information for the bot account. This is also where the `node:path` comes into play.

- You do not need to already have a `cookies.json` file. When you first log in, it will create one for you and automatically fill out the required information.

```javascript
client.login({ username: 'DISPLAY NAME', password: 'PWD', cookies: path.join(__dirname , 'cookies.json') });
```

5) Let's put an event listener anywhere above the login function so we can wait tell the client is connected and ready to go.

```javascript
client.on('ready', () => {
    console.log(`Client is ready!`);
}); 
```

6) Then inside of the event listener, we will create a new message and send it.

- Note: When you add multiple draft data's, it will create each one as a new thread. This means that you can only have as much data as the max thread length is.

```javascript
    const Data1 = new DraftManager.Data({ Text: 'QuillWork', media: path.join(__dirname, './TestImg.png') });
    client.draft.send(Data1);
```

7) Here is a peek at the completed code.

```javascript
const { Client, DraftManager }= require("../SRC");
const path = require('node:path');
  
const client = new Client({
    driver: "firefox",
    Headless: true,
});
  
client.on('ready', () => {
    console.log("ready");
});
  
client.login({ username: 'DISPLAY NAME', password: 'PWD', cookies: path.join(__dirname , 'cookies.json') });
```

---

## Making your first bot

To make your first bot we will show you how to properly interact with quill.js and make it work properly

1) Lets start by using the code from above as a base for our bot.

```javascript
const { Client, DraftManager }= require("../SRC");
const path = require('node:path');
  
const client = new Client({
    driver: "firefox",
    Headless: true,
});
  
client.on('ready', () => {
    console.log("ready");
});
  
client.login({ username: 'DISPLAY NAME', password: 'PWD', cookies: path.join(__dirname , 'cookies.json') });
```

2) Now let's create a GenerateMessage function to randomly pick a quote from an array of strings and send that. We will also create the quotes array as well.

```javascript
    const quotes = ['Quote1', 'Quote2', 'Quote3', 'Quote4'];

    function GenMSG() {
        let quote = quotes[Math.floor(Math.random() * (quotes.length - 0) + 0)]; // this will select a random quote from the list.
    }
```

3) Now let's Add a system to help avoid sending something we already said.

- add a new array called sent we will leave it blank for now.
- then check to see if the message is in the array and if not we will add it to the array and send the message

```javascript
var sent = [];
  
if(sent.includes(quote)){
    console.log('oops already sent that one lets regenarate the messege.');
    GneMSG(); 
} else {
    sent.push(quote);
    const Data1 = new DraftManager.Data({ Text: quote });
    client.draft.send(Data1);
}
```

4) Now, let's put it all together and add an delay so the bot doesn't crash, and that should be it you should be able to put as many quotes as you would like to into the array and the bot will send all of them with a set delay.

```javascript
    const { Client, DraftManager }= require("../SRC");
    const path = require('node:path');
    
    const client = new Client({
        driver: "firefox",
        Headless: true,
    });
    
    client.on('ready', () => {
        console.log("ready");
        for(let i=0; i <= quotes.length; i++) {
            setTimeout(() =>{ // adds a delay
                GenMSG();
            }, 5000);
        }
        
    });
    
    client.login({ username: 'DISPLAY NAME', password: 'PWD', cookies: path.join(__dirname , 'cookies.json') });

    const quotes = ['Quote1', 'Quote2', 'Quote3', 'Quote4'];
    var sent = [];
  
    function GenMSG() {
        let quote = quotes[Math.floor(Math.random() * (quotes.length - 0) + 0)]; // this will select a random quote from the list.
  
        if(sent.includes(quote)){
            console.log('oops already sent that one lets regenarate the messege.');
            GneMSG(); 
        } else {
            sent.push(quote);
            const Data1 = new DraftManager.Data({ Text: quote });
            client.draft.send(Data1);
        }
    }
```

---

## Running The bot

If you're a beginner with Node.js, follow these steps below:

1) Open a command line in your project folder that has the main JavaScript file you're using.
2) Type the following into the command line, replacing "app.js" with whatever you named your file:

```powershell
node app.js
```

3) It should just work

---

## Using the Debugger

It's really simple to use the debugger in Quill.Api. just copy the code below and put it into our project

```javascript
const log = (...args) => console.log(process.uptime().toFixed(3), ...args);
client.on('debug', log);
```

---
© 2023 DogeProductions. All rights reserved.
