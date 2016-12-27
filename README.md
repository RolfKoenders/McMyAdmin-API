
# mcmyadmin-api [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> nodejs interface for the mcmyadmin api

## Usage
Create an instance of the `McMyAdmin` class. The library will take care of obtaining a sessionId so you don't have to login first.

```js
const mcAdmin = new McMyAdmin({
    host: 'http://xxx.xxx.x.xx',
    port: 8080,
    username: 'admin',
    password: 'password'
});
```

## API Methods

### .status((err, info))
> mcAdmin.status((err, info) => {});

Get the server status

```json
{
  "status": 200,
  "state": 50,
  "failed": false,
  "failmsg": "",
  "maxram": 4096,
  "users": 0,
  "maxusers": 10,
  "userinfo": {},
  "time": "2016-12-27 15:48:08",
  "ram": 0,
  "starttime": "[Not Running]",
  "uptime": null,
  "cpuusage": 0
}
```