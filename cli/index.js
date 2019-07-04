#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const semver = require('semver');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const mkdir = require('make-dir');

const runningAsScript = !module.parent;

function resolvePath(pathname) {
    if (!path.isAbsolute(pathname)) {
        pathname = path.normalize(`${process.cwd()}/${pathname}`);
    }

    const { dir, base: file } = path.parse(pathname);
    return { dir, file, pathname };
}

function uploadFiles({ server, meta, js, css }) {
    const form = new FormData();
    form.append('meta', fs.createReadStream(meta));
    form.append('js', fs.createReadStream(js));
    form.append('css', fs.createReadStream(css));

    return new Promise((resolve, reject) => {
        form.submit(`${server}/upload`, (err, res) => {
            if (err) return reject(err);

            res.once('data', chunk => {
                resolve(chunk.toString());
            });
        });
    });
}

function archive({ cwd, input, output, gzip = true }) {
    return tar.create({ file: output, gzip, cwd }, [input]);
}

async function main(commands, metaPath = './assets.json') {
    if (commands[0] === 'publish') {
        const pathToMeta = resolvePath(metaPath).pathname;
        const meta = JSON.parse(fs.readFileSync(pathToMeta));

        // produce archive of js
        const jsAssetPaths = resolvePath(meta.inputs.js);
        const cssAssetPaths = resolvePath(meta.inputs.css);

        await mkdir(__dirname + '/tmp');

        await archive({
            cwd: jsAssetPaths.dir,
            input: jsAssetPaths.file,
            output: __dirname + '/tmp/archive-js.tgz',
        });
        await archive({
            cwd: cssAssetPaths.dir,
            input: cssAssetPaths.file,
            output: __dirname + '/tmp/archive-css.tgz',
        });

        const response = await uploadFiles({
            server: meta.server,
            meta: pathToMeta,
            js: __dirname + '/tmp/archive-js.tgz',
            css: __dirname + '/tmp/archive-css.tgz',
        });

        console.log(response);
    }

    if (commands[0] === 'version') {
        const pathToMeta = resolvePath(metaPath).pathname;
        const meta = JSON.parse(fs.readFileSync(pathToMeta));

        if (
            !commands[1] ||
            !['major', 'minor', 'patch'].includes(commands[1])
        ) {
            console.error(
                'invalid semver type supplied. Use "major", "minor" or "patch" eg. asset-pipe version minor'
            );
            return;
        }
        meta.version = semver.inc(meta.version, commands[1]);
        fs.writeFileSync(pathToMeta, JSON.stringify(meta, null, 2));
        console.log(
            `Version ${meta.version} set. Run "asset-pipe publish" to publish`
        );
    }
}

module.exports = {
    publish() {
        main('publish');
    },
};

// only do this if run as a cli
if (runningAsScript) {
    const argv = yargs.argv;
    const path = argv.path;
    const commands = argv._;
    main(commands, path);
}
