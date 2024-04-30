# Valid Events And emitters for Quill.js

> Event emitters and where they originated from.
---

# Client Events

## Ready
> Returns when the login prosses is done!
> - Use to wait for login prosses to be finished
> - @Emitted from Client.js
```javascript
client.on('ready', () => {
    // Do stuff
});
```

## Error
> Returns On Client error
> - can be one of many errors Reference [Errors](./errors.md)
> - @Emitted from Anywhere don't worry about it

## Debug
> Returns on a debug message
> - Note you have to handle the debug messages Example below!
> - @Emitted from Anywhere
```javascript
const log = (...args) => console.log(process.uptime().toFixed(3)+":", ...args);
client.on('debug', log);
```

## ClientBuilt
!> DEPRICATED / NO LONGER USED!
> returns when client is done creating

---

# Shared Events

 NONE OF IMPORTANTS HERE:shrug:

> :shushing_face: :horse: :horse: :horse: :horse:
