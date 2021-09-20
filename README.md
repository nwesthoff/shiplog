[![Create Stable Build](https://github.com/nwesthoff/vercelfservice/actions/workflows/build-main.yaml/badge.svg?branch=main)](https://github.com/nwesthoff/vercelfservice/actions/workflows/build-main.yaml)

# VercelfService

A Mac Menu Bar application for watching your Vercel builds.

The app is built using

- [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- [Electron](https://www.electronjs.org/) - used to package it as Menu Bar application

## Available Scripts

In the project directory, you can run:

### `yarn electron:dev`

Runs the app in the development mode.\
Starts the server on [http://localhost:3000](http://localhost:3000) and launches the app in the Menu Bar

### `yarn make`

Packages the app and generates platform specific distributables to the `out` folder. Uses [Electron Forge](https://www.electronforge.io/) for packaging.
