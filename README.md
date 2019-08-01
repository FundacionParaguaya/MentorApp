This is the source repository for the Poverty Stoplight native mobile app. If you want to use the app get it for Android from the [Play Store](https://play.google.com/store/apps/details?id=com.povertystoplightapp). If you would like to participate as a dev read on.

## Prerequisites for development

### For OSX

- Install **xcode** from the App Store
- Install **brew** from [here](https://brew.sh)
- Install **node** via Brew (this will also install **npm** which you need to install required packages for the app) - `brew install node`
- Install **react-native command line interface** globally via npm - `npm install -g react-native-cli`
- Get **Watchman** via Brew - `brew install watchman`
- Install [Android Studio](https://developer.android.com/distribute/) (with default settings), which also needs [Java SE Development Kit 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
  - [Here](https://stackoverflow.com/a/47699905) is how to install Java with Brew (and manage multiple Java versions)

## To install

1.  `git clone git@github.com:FundacionParaguaya/MentorApp.git` to clone the repo
2.  `cd povertystoplightapp` to go into repo folder
3.  `npm i` from repo folder to install all dependencies
4.  `convert-androidx` to convert all sub dependencies to the proper format for Android
5.  `react-native link` to link all native packages. If `react-native` command is not defined run `npm install -g react-native-cli` first.

## To run

- `npm run start-ios` for IOS dev mode
- `npm run start-android` for Android dev mode

## Guides

- [Runing emulators on OSX](docs/emulator-osx.md)
- [Running the app in Dev mode on a real device](docs/run-on-device.md)
- [Using debugging tools](docs/debugging.md)
- [Deploying on Play Store](docs/deploying.md)
- [Versioning](docs/versioning.md)
- [General test plan](docs/test-plan.md)

## Thanks To

<img width="200" alt="portfolio_view" src="assets/images/browserstack.png"> 

[click here to check their website](http://browserstack.com)
