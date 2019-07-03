'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');

module.exports = class Client {
    constructor({ js, css }) {
        let meta = {};
        this.scripts = [];
        this.styles = [];

        try {
            const metaPath = join(pkgDir.sync(), '.asset-pipe.json');
            const metaString = readFileSync(metaPath, 'utf8');
            meta = JSON.parse(metaString);
        } catch (err) { }

        if (meta.js) {
            this.scripts = meta.js;
        }
        if (meta.css) {
            this.styles = meta.css;
        }
        if (js) {
            this.scripts.push({
                type: 'module',
                value: js,
                development: true,
            });
        }
        if (css) {
            this.styles.push({
                type: 'default',
                value: css,
                development: true,
            });
        }
    }

    get js() {
        return this.scripts;
    }
    get css() {
        return this.styles;
    }
};
