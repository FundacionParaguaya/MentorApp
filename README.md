This is the source repository for the Poverty Stoplight native mobile app. If you want to use the app get it for Android from the [Play Store](https://play.google.com/store/apps/details?id=com.povertystoplightapp). If you would like to participate as a dev read on.

## Prerequisites for development

### For OSX

- Install **node** at least version 12, via Brew (this will also install **npm** which you need to install required packages for the app) - `brew install node`
- Install **react-native command line interface** globally via npm - `npm install -g react-native-cli`
- Install [Android Studio](https://developer.android.com/distribute/) (with default settings), which also needs [Java SE Development Kit 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
  - [Here](https://stackoverflow.com/a/47699905) is how to install Java with Brew (and manage multiple Java versions)
- If and only if you don't like Android Studio you can install **xcode** from the App Store as an alternative

## To install

1.  `git clone git@github.com:FundacionParaguaya/MentorApp.git` to clone the repo
2.  `cd povertystoplightapp` to go into repo folder
3.  `npm i` from repo folder to install all dependencies

## To run

- make sure to set up your `ANDROID_SDK` variable https://stackoverflow.com/questions/38835931/react-native-adb-reverse-enoent .
- if you are using mac, run `chmod 755 android/gradlew` .
- `npm run ios` for IOS dev mode
- `npm run android` for Android dev mode

## Debug

1. To debug you first need to install and start react-native-debugger on your machine.
2. Start the app and click "d" in the node console. This will open the dev tools on your device.
3. Click debug. This should transfer the data to the react-native-debugger app.

<img width="200" alt="portfolio_view" src="assets/images/browserstack.png">

[click here to check their website](http://browserstack.com)
