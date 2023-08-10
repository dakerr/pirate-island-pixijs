Pirate Island - A demo game made with Typescript and PixiJS
=============

This project is based from Pixi Open Games.  A collection of games to help learn how to make games using PixiJS and its ecosystem of plugins and tools. 

![firebase deploy](https://github.com/dakerr/pirate-island-pixijs/actions/workflows/firebase-hosting-merge.yml/badge.svg)

## Features

This project utilizes multiple pixi based libraries including:
- PixiJS a rendering library build for the web.
- UI for commonly used UI components in PixiJS.
- AssetPack, a framework agnostic tool for optimizing assets for the web.

Other neat stuff in this project:
- written in Typescript, with linting and formatting (Eslint and Prettier)
- package management with Yarn (Fast, consistent, secure)
- uses GreenSock Animation Platform (GSAP). Wow! Do people know about this?
- built with Vite, OMG its awesome.
- hosted with Firebase Hosting
- deployed to Firebase with Github Actions
- sends highscores to Cloud Firestore

## Purpose
This simple game demonstrates how data could be sent to a separate app, and displayed in real-time.

## How?
Both apps (and potentially many others) are connected to the same cloud based database - the NoSQL Firestore Database.  The second app (here) consumes the data in a stream using a React hook and updates the table in real-time!

## Prerequisites
This project needs `Node.js` and `Yarn` installed on your system.

## Setup
```bash
# Clone the repository
git clone http://github.com/dakerr/pirate-island-pixijs
cd ./pirate-island-pixijs

# Install dependencies
yarn

# Start the project
yarn start
```

\* this will let you play the game but the second project is needed to save the high scores

## Build
```bash
# Assetpack bundles, tsc compiles and vite builds for production.  Output to /dist
yarn build
```

## Known Issues
Until I setup a GitHub Action to ![Create an .env file](https://github.com/marketplace/actions/create-env-file), you will need to setup a Firebase config yourself.  (Not going to commit secrets to GitHub!)  A Firebase API key is required to access the Firestore.  

## License
[MIT License](https://opensource.org/licenses/MIT)

