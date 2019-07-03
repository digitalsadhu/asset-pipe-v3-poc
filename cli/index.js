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

async function main(
    url,
    name = 'test',
    js = './assets/scripts.js',
    css = './assets/styles.css'
) {
    // produce archive of js
    const jsAssetPaths = assetPaths(js);
    const cssAssetPaths = assetPaths(css);

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
    form.append('js', fs.createReadStream(__dirname + '/tmp/archive-js.tgz'));
    form.append('css', fs.createReadStream(__dirname + '/tmp/archive-css.tgz'));
    form.submit(`http://localhost:4001/upload/${name}`, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        res.on('data', chunk => {
            const responseJSON = JSON.parse(chunk.toString());
            fs.writeFileSync(
                path.join(process.cwd(), '.asset-pipe.json'),
                JSON.stringify(responseJSON, null, 2)
            );
            console.log();
        });
    });

    // get back data from server and save to file .asset-pipe.json
}

module.exports = main;

// only do this if run as a cli
main();
