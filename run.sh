nvm use 8
npm i
export ANDROID_HOME=/Users/ggaona/Library/Android/sdk
npm run convert-androidx
react-native link
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
npm run start-android