'use strict';

const express = require('express');
const Podlet = require('@podium/podlet');
const Assets = require('../client');

const app = express();

app.use('/assets', express.static('assets'));

const podlet = new Podlet({
    name: 'pretendPodlet',
    version: '1.0.0',
    pathname: '/',
    development: process.env.NODE_ENV !== 'production',
    logger: console,
});

app.use(podlet.middleware());

const assets = new Assets({
    js: '/assets/scripts.js',
    css: '/assets/styles.css',
});
podlet.js(assets.js);
podlet.css(assets.css);

app.get(podlet.manifest(), (req, res) => {
    res.send(podlet);
});

app.get(podlet.content(), (req, res) => {
    res.podiumSend('<div>Something</div>');
});

app.listen(3000, () => {
    console.log('app listening on port 3000');
});
