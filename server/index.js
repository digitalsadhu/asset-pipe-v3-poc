'use strict';

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const tar = require('tar');
const { join } = require('path');
const mkdir = require('make-dir');

const app = express();
const upload = multer({ dest: 'tmp/' });

app.use(cors());
app.use('/assets', express.static('uploads'));

// receive archive of js
app.post(
    '/upload/:name',
    upload.fields([{ name: 'js', maxCount: 1 }, { name: 'css', maxCount: 1 }]),
    async (req, res) => {
        try {
            const { name } = req.params;

            const jsArchive = req.files.js[0].path;
            const cssArchive = req.files.css[0].path;
            const now = Date.now().toString();

            const jsPath = join(__dirname, 'uploads', name, now, 'js');
            const cssPath = join(__dirname, 'uploads', name, now, 'css');
            await mkdir(jsPath);
            await mkdir(cssPath);

            await tar.extract({ file: join(__dirname, jsArchive), C: jsPath });
            await tar.extract({
                file: join(__dirname, cssArchive),
                C: cssPath,
            });
            res.send({
                js: [
                    {
                        value: `http://localhost:4001/assets/${name}/${now}/js/scripts.js`,
                        type: 'module',
                    },
                ],
                css: [
                    {
                        value: `http://localhost:4001/assets/${name}/${now}/css/styles.css`,
                    },
                ],
            });
        } catch (err) {
            console.error(err);
        }
    }
);

app.listen(4001, () => {
    console.log('started on port 4001');
});
