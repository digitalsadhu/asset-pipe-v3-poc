'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');

function validateMeta(meta) {
    if (!meta) throw new Error('invalid asset definition file');
    if (!meta.server)
        throw new Error('asset definition file missing required key "server"');
    if (!meta.inputs)
        throw new Error('asset definition file missing required key "inputs"');
    if (!meta.outputs)
        throw new Error('asset definition file missing required key "outputs"');
    if (!meta.name)
        throw new Error('asset definition file missing required key "name"');
    if (!meta.version)
        throw new Error('asset definition file missing required key "version"');
    if (!meta.organisation)
        throw new Error(
            'asset definition file missing required key "organisation"'
        );
}

module.exports = class Client {
    constructor({ js, css }) {
        let meta = null;
        this.scripts = [];
        this.styles = [];

        try {
            const metaPath = join(pkgDir.sync(), 'assets.json');
            const metaString = readFileSync(metaPath, 'utf8');
            meta = JSON.parse(metaString);
        } catch (err) {}

        if (meta) {
            validateMeta(meta);

            const {
                server,
                inputs,
                outputs,
                organisation,
                name,
                version,
            } = meta;

            if (inputs.js) {
                const scripts = outputs.js || 'scripts.js';
                this.scripts.push({
                    value: `${server}/${organisation}/${name}/${version}/js/src/${scripts}`,
                    type: 'esm',
                });
            }
            if (inputs.css) {
                const styles = outputs.css || 'styles.css';
                this.styles.push({
                    value: `${server}/${organisation}/${name}/${version}/css/src/${styles}`,
                });
            }
        }

        if (js) {
            this.scripts.push({
                type: 'esm',
                value: js,
                development: true,
            });
        }
        if (css) {
            this.styles.push({
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
