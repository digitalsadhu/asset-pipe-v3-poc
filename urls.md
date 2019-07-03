# Proposed URLs for asset on cdn

A convention based approach using info described in an `assets.json` file

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "server": "http://assets-server",
    "inputs": {
        "js": "./assets/scripts.js",
        "css": "./assets/styles.css"
    },
    "outputs": {
        "js": "scripts.js",
        "css": "styles.css"
    }
}
```

## JavaScript

-   `<asset server host>/<name>/<version>/js/src/<outputs.js>`
-   `<asset server host>/<name>/<version>/js/bundle/<outputs.js>`

-   `http://assets-server/my-app/1.0.0/js/src/scripts.js`
-   `http://assets-server/my-app/1.0.0/js/bundle/scripts.js`

## CSS

-   `<asset server host>/<name>/<version>/css/src/<outputs.css>`
-   `<asset server host>/<name>/<version>/css/bundle/<outputs.css>`

-   `http://assets-server/my-app/1.0.0/css/src/styles.css`
-   `http://assets-server/my-app/1.0.0/css/bundle/styles.css`
