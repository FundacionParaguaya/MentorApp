This is the moblie app for the Poverty Stoplight platform. It is a native, not a web, app which requires you to setup your machine for native development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Instalation](#to-install)
- [Running](#to-run)
- [Documentation](#Docs)

## Prerequisites

### For OSX

- Install **xcode** from the App Store
- Install **brew** from [here](https://brew.sh)
- Install **node** via Brew (this will also install **npm** which you need to install required packages for the app) - `brew install node`
- Install **react-native command line interface** globally via npm - `npm install -g react-native-cli`
- Get **Watchman** via Brew - `brew install watchman`
- Install [Android Studio](https://developer.android.com/distribute/) (with default settings), which also needs [Java SE Development Kit 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
  - [Here](https://stackoverflow.com/a/47699905) is how to install Java with Brew (and manage multiple Java versions)

## To install

1.  `git clone git@github.com:penguin-digital/povertystoplightapp.git` to clone the repo
2.  `cd povertystoplightapp` to go into repo folder
3.  `npm i` from repo folder to install all dependencies

## To run

- `npm run start-ios` for IOS dev mode
- `npm run start-android` for Android dev mode

## Guides

- [Runing emulators on OSX](docs/emulator-osx.md)
- [Running the app in Dev mode on a real device](docs/run-on-device.md)
- [Using debugging tools](docs/debugging.md)
- [Deploying on Play Store](docs/deploying.md)
