# Running the app on a real device

This guide describes how to run and develop the app on a physical device.

## Android

1. **Enable Debugging over USB** on your device in order to install your app during development. If you haven't done so for this particular device, you will first need to enable the "Developer options" menu by going to _Settings → About_ phone and then tapping the Build number row at the bottom _seven times_. You can then go back to _Settings → Developer_ options to enable `USB debugging`.

2. **Plug in your device via USB** to the dev machine. A popup ascing for permission should appear on the device. Accept it. Now check that your device is properly connecting to ADB, the Android Debug Bridge, by running `adb devices` in the terminal. If the list is empty, check the cable. If the device display that it's unauthorized, unplug and plug again until you see the above mentioned popup and accept.

3. Run `npm run start-android`. Since there is no emulator running, the command will try to run the app on the connected device. Like with emulator mode, wait a bit for the app to appear on the device screen.

Now you should be able to build and see the current version on the connected device. Refer to [debugging](debugging.md) to enhance your development experience.

### Troubleshooting

In case you see a red screen with `unable to load script from assets index.android.bundle`, try the following:

1. (in project directory) run `mkdir android/app/src/main/assets`
2. run `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
3. Try starting the app again `npm run android-start`
