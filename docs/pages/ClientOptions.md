# Client Options

## driver

The driver that quill will use when running. this can be firefox, chrome, internet explorer, 
```javascript
const client = new Client({
    driver: 'browser'
});
```

## Proxy | Not Implemented |

The proxy options is for reading network trafic so we can read the bots notifications.
```javascript
const client = new Client({
    ProxyClnt: {Http: '<http://localhost:8080>', Https: '<http://localhost:8080>'}
});
```

---
© 2023 DogeProductions. All rights reserved.