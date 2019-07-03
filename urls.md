# Proposed URLs for asset on cdn

A convention based approach using info described in an `assets.json` file

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

## JavaScript

-   `<asset server host>/<name>/<version>/js/scripts.js`
-   `<asset server host>/<name>/<version>/js/<browser>/<browser version>/scripts.js`

-   `http://assets-server/my-app/1.0.0/js/scripts.js`
-   `http://assets-server/my-app/1.0.0/js/chrome/58/scripts.js`
-   `http://assets-server/my-app/1.0.0/js/ie/11/scripts.js`

## CSS

-   `<asset server host>/<name>/<version>/css/styles.js`

-   `http://assets-server/my-app/1.0.0/css/styles.css`
