
![Logo](https://i.ibb.co/ZfXcrjJ/Quill-logo.png)




![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/Quill_Api?style=flat-square&logo=twitter&logoColor=white&labelColor=%231DA1F2&color=%230000)

## Quill_Api
  Quill.api is a replacement for the tradininal twitter api that is trying to make it easy to create amd host a bot. While Quill.Api is currently more limited than the official Twitter API We are working hard on adding a lot more, and we will soon be more capable than the official Twitter API. Twitter(X) is not associated with this prodject.

## Installation

Install with npm

```bash
  npm i QuillJs-test
```
    
## Usage/Examples

```javascript
'use strict';
const { Client } = require('quill.api');
const cookies = require("./cookies.json");
const path = require('node:path');

// Path verible for cookies.json file
const JSONpath = path.join(__dirname , '/cookies.json');

const log = (...args) => console.log(process.uptime().toFixed(3), ...args);

const client = new Client.Client({
    driver: "firefox",
    Headless: true,
});


client.on('debug', log);
client.on('ready', () => 
{
      console.log('client ready');
      var draft = new client.Draft().addText('Hello World!').Send();
});

client.login({ username: 'DISPLAY NAME', password: 'PWD', cookies: JSONpath });

```



## Roadmap

- [ ] Proxy Suport For reading network trafic.
- [X] Dynamic Client instence.
- [X] Threads.
- [X] Gifs. Aperently alredy suported!
- [ ] DM messeging.
- [ ] Changing profile info.
- [ ] creating polls
- [ ] Changing who can reply.
- [ ] groups and lists suport.
- [ ] IDK Comign up with more things to do.

## The Gang

we are all a couple of bord tenagers at scool so dont expect thaire to be rollouts evrey week or somthing like that. altho we are in school when summer rolls around we will be able to make more frequent changes to thi prodject. 

oh Also This is a simple fun prodject Twitter plees dont take action against us 🥺 im begging.

## Feedback

If you have any feedback, please reach out to us at dogeproduce@gmail.com or through the issues tab

© 2023 DogeProductions. All rights reserved. 
