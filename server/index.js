'use strict';

const express = require('express');
const cors = require('cors');
const { readFile, stat } = require('fs').promises;
const multer = require('multer');
const tar = require('tar');
const { join } = require('path');
const mkdir = require('make-dir');
const semver = require('semver');

const { /*HOST = 'http://localhost',*/ PORT = 4001 } = process.env;

const app = express();
const upload = multer({ dest: 'tmp/' });

async function versionExists(organisation, name, version) {
    try {
        const st = await stat(
            join(__dirname, 'uploads', organisation, name, version)
        );
        return st.isDirectory();
    } catch (err) {
        console.log(err);
        console.log('does not exist!');
        return false;
    }
}

// receive archive of js
app.post(
    '/upload',
    upload.fields([
        { name: 'meta', maxCount: 1 },
        { name: 'js', maxCount: 1 },
        { name: 'css', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { organisation, name, version, outputs } = JSON.parse(
                await readFile(req.files.meta[0].path)
            );

            if (await versionExists(organisation, name, version))
                throw new Error('VERSION EXISTS');
            if (!semver.valid(version)) throw new Error('INVALID SEMVER VALUE');

            const port = PORT !== 80 ? `:${PORT}` : '';
            // const host = `${HOST}${port}`;

            const jsArchive = req.files.js[0].path;
            const cssArchive = req.files.css[0].path;

            const jsPath = join(
                __dirname,
                'uploads',
                organisation,
                name,
                version,
                'js/src'
            );
            const cssPath = join(
                __dirname,
                'uploads',
                organisation,
                name,
                version,
                'css/src'
            );
            await mkdir(jsPath);
            await mkdir(cssPath);

            await tar.extract({ file: join(__dirname, jsArchive), C: jsPath });
            await tar.extract({
                file: join(__dirname, cssArchive),
                C: cssPath,
            });
            res.send({
                success: true,
                // js: [
                //     {
                //         value: `${host}/${organisation}/${name}/${version}/js/src/${
                //             outputs.js
                //         }`,
                //         type: 'module',
                //     },
                //     {
                //         value: `${host}/${organisation}/${name}/${version}/js/bundle/${
                //             outputs.js
                //         }`,
                //         type: 'iife',
                //     },
                // ],
                // css: [
                //     {
                //         value: `${host}/${organisation}/${name}/${version}/css/src/${
                //             outputs.css
                //         }`,
                //     },
                //     {
                //         value: `${host}/${organisation}/${name}/${version}/css/bundle/${
                //             outputs.css
                //         }`,
                //     },
                // ],
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({
                error: err.message,
            });
        }
    }
);

app.use(cors());
app.use('/', express.static('uploads'));

app.listen(PORT, () => {
    console.log('started on port 4001');
});
