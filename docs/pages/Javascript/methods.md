# Methods 
This page contains all the useable methods for quill along with what they return that they take in and what they do.

# Client Methods


## constructor

> Constructs the Quill client and initializes all other modules it has to.
> - @returns ```Promise<string>```.
> - @pram ```driver: string```, --- the browser you want to init client with. check browsers.
> - @pram ```Headless: bool```, --- Init client in headless mode(do not show browser)?
> - @pram ```loopDelayLength: int```, --- How fast should the check iterate, this means delay before each iterations?
> - @pram ```maxLoopIterations: int```, --- how many times should a check integrate before returning error?
> - @pram ```ProxyClnt: object```, --- Options for the proxy client, ```({ ip: string, port: string, })```, :heavy_exclamation_mark: NOT YET IMPLEMENTED
```javascript
Client({
    driver: string,
    Headless: bool,
    loopDelayLength: int,
    MaxloopTterations: int,
    ProxyClnt: object,
});
```

## login
> Logs the client in, establishing a connection To twitter.
> - @returns ```Promise<string>```.
> - @event ```events.clientReady```, reference [Quill/Events](http://127.0.0.1:5500/docs/#/pages/Javascript/Events)
> - @pram ```username: string``` Username for the account you want to log into!
> - @pram ```password: string``` The password for the account you would like to log into!
> - @pram ```cookies: string``` The file path to the cookies file you want to save the clients cookies and load the cookies from.
```javascript
client.login({
    username: string,
    password: string,
    cookies: string,
});
```

## Destroy
> Exits the client and destroys it
> - @returns ```Promise<void>```
> - @pram ```fullwipe: bool```, delete the cookies and browser info when exiting the client?
```javascript
client.Destroy({
    fullwipe: bool,
});
```

## Send
!> METHOD DEPRECATED!
> Send message
```javascript
NO EXAMPLE!
```

## draft_Tweet
!> METHOD DEPRECATED!
> create a new tweet draft
```javascript
NO EXAMPLE
```

## addText
!> METHOD DEPRECATED!
> Add text to draft
```javascript
NO EXAMPLE
```

## add_media
!> METHOD DEPRECATED!
> add media to draft
```javascript
NO EXAMPLE
```

## _validateOptions
Validates the options passed to the client
```javascript
client._validateOptions();
```

---
© 2023 DogeProductions. All rights reserved.