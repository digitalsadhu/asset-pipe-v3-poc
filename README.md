# Asset Pipe POC

## Components

### app

Small podlet that demonstrates the setup. Makes use of the client described below.
Serves own assets locally using express static for dev purposes.

### cli

cli to upload to asset server that:

-   zips assets into a tmp dir
-   posts zip to asset server
-   receives meta info from asset server and saves as .asset-pipe.json

### client

small node tool to use in podlets/layouts that:

-   accepts paths to served (in dev) asset files
-   reads .asset-pipe.json if one exists
-   builds js and css arrays for use in manifests from both dev paths and .asset-pipe.json values
-   exposes a .js and .css method for use with podlet.js() and podlet.css()

### server

A simple fake asset server that:

-   accepts a post with a tar file containing zipped up js and css
-   unpacks assets in a dir
-   serves unpacked files
-   returns meta with file location info

## How to test out

## Install deps

You'll need to go into each of the 4 folders and run `npm install`

## Start up the app

You should be able to start by going into the app folder and running `node .` to fire it up and test it out.
if you visit `http://localhost:3000/manifest.json` you should see a couple asset entries and when you visit the
main URL at `http://localhost:3000` you should see that the background has been colored by the CSS.

## Publish to the asset server

Start up the asset server `cd server && node .` and go into the app folder and run the cli to upload the podlet's
assets to the server `cd app && node ../cli` (this needs to be run from the app's dir).

Restart the app and you should now see additional values in the manifest file.

This publish step is intended to be a build time/dev time operation so that run time is minimal and syncronous.
