# Getting started

## install

## 1. Setup for development

### Install

```
npm i @asset-pipe/client
```

```js
const express = require('express');
const Podlet = require('@podium/podlet');

// 1. require client
const Assets = require('@asset-pipe/client');

const podlet = new Podlet({ ..., development: true, ... });

app.use(podlet.middleware());

// 2. serve assets in your podlet (in this case at /assets)
app.use('/assets', express.static('assets'));

// 3. new up an instance of the Assets class giving it paths to where assets are being served
const assets = new Assets({ js: '/assets/js', css: '/assets/css' });

// 4. set asset definitions in manifest and development template
podlet.js(assets.js);
podlet.css(assets.css);

app.listen(3000);
```

You should now be able to start the podlet and see your js and css assets being served and included in the podlet's development template

```bash
$ node index.js
```

## 2. Setup for production

### Install

```
npm i -g @asset-pipe/cli
```

### Create an assets.json file

```sh
$ asset-pipe init
```

This will create an assets.json file for you in the current directory.

#### assets.json

This file will look like the following and you should fill in the fields as appropriate

```json
{
    "organisation": "[required]",
    "name": "[required]",
    "version": "1.0.0",
    "server": "http://assets-server.svc.prod.finn.no",
    "inputs": {
        "js": "[path to js entrypoint]",
        "css": "[path to css entrypoint]"
    },
    "outputs": {
        "js": "[output js filename]",
        "css": "[output css filename]"
    }
}
```

### Publish assets

```bash
asset-pipe publish
```

Now, after restarting the podlet your podlet will continue to serve local assets in development mode but will provide the locations of the now published assets
to the layout for production use.
