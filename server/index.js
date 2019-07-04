'use strict';

const express = require('express');
const cors = require('cors');
const { readFile, stat, unlink } = require('fs').promises;
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

async function extract({ src, dest }) {
    await mkdir(dest);
    await tar.extract({ file: src, C: dest });
}

async function unlinkFiles(...paths) {
    return Promise.all(paths.map(path => unlink(path)));
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
            const metaPath = join(__dirname, req.files.meta[0].path);
            const jsArchive = req.files.js[0].path;
            const cssArchive = req.files.css[0].path;
            const jsArchivePath = join(__dirname, jsArchive);
            const cssArchivePath = join(__dirname, cssArchive);

            const { organisation, name, version } = JSON.parse(
                await readFile(metaPath)
            );

            if (await versionExists(organisation, name, version)) {
                await unlinkFiles(metaPath, jsArchivePath, cssArchivePath);
                throw new Error('VERSION EXISTS');
            }
            if (!semver.valid(version)) {
                await unlinkFiles(metaPath, jsArchivePath, cssArchivePath);
                throw new Error('INVALID SEMVER VALUE');
            }

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

            await extract({ src: jsArchivePath, dest: jsPath });
            await extract({ src: cssArchivePath, dest: cssPath });
            await unlinkFiles(metaPath, jsArchivePath, cssArchivePath);

            res.send({ success: true });
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
