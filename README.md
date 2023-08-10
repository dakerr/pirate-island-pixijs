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
- uses GreenSock Animation Platform (GSAP). Wow! Do people know about this?
- built with Vite, OMG its awesome.
- hosted with Firebase Hosting
- deployed to Firebase with Github Actions

## Purpose
This simple game demonstrates how data could be sent to a separate app, and displayed in real-time.

## How?
Both apps (and potentially many others) are connected to the same cloud based database - the NoSQL Firestore Database.  The second app (here) consumes the data in a stream using a React hook and updates the table in real-time!



