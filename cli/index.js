'use strict';

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const mkdir = require('make-dir');

// flags
// --name
// --js
// --css
// --url

// relative paths
// ./scripts.js
// scripts.js
// assets/scripts.js
// ./assets/scripts.js

// absolute paths
// /asd/asd/sad/scripts.js

function assetPaths(pathname) {
    if (!path.isAbsolute(pathname)) {
        pathname = path.normalize(`${process.cwd()}/${pathname}`);
    }

    const { dir, base: file } = path.parse(pathname);
    return { dir, file };
}

async function main() {
    const meta = JSON.parse(fs.readFileSync(process.cwd() + '/assets.json'));

    // produce archive of js
    const jsAssetPaths = assetPaths(meta.inputs.js);
    const cssAssetPaths = assetPaths(meta.inputs.css);

    await mkdir(__dirname + '/tmp');

    await tar.create(
        {
            gzip: true,
            file: __dirname + '/tmp/archive-js.tgz',
            cwd: jsAssetPaths.dir,
        },
        [jsAssetPaths.file]
    );

    // produce archive of css
    await tar.create(
        {
            gzip: true,
            cwd: cssAssetPaths.dir,
            file: __dirname + '/tmp/archive-css.tgz',
        },
        [cssAssetPaths.file]
    );

    // POST request to url with archives
    const form = new FormData();
    form.append('meta', fs.createReadStream(process.cwd() + '/assets.json'));
    form.append('js', fs.createReadStream(__dirname + '/tmp/archive-js.tgz'));
    form.append('css', fs.createReadStream(__dirname + '/tmp/archive-css.tgz'));
    form.submit(`http://localhost:4001/upload`, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }

        res.on('data', chunk => {
            console.log(chunk.toString());
        });
    });

    // get back data from server and save to file .asset-pipe.json
}

module.exports = main;

// only do this if run as a cli
main();
