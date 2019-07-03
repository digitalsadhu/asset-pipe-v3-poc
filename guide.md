# Getting started

## install

```
npm i @asset-pipe/client
```

## assets.json

Create a file called assets.json in the root of your project.

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "server": "http://assets-server",
    "input": {
        "js": "./assets/scripts.js",
        "css": "./assets/styles.css"
    },
    "targets": {
        "chrome": "58",
        "ie": "11"
    }
}
```

## Include the client in a podlet

```js
app.use('/assets', express.static('assets'));

const Assets = require('@asset-pipe/client');
const assets = new Assets({ js: '/assets/js', css: '/assets/css' });

podlet.js(assets.js);
podlet.css(assets.css);
```

## When going into production

```sh
$ asset-pipe publish
```
