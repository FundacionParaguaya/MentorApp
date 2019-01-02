# Debugging

To see the console log you need to enable Remote Debugging. You can use the `⌘D` keyboard shortcut when your app is running in the iOS Simulator, or `⌘M` when running in an Android emulator on Mac OS. That opens the dev menu where you can select Enable Remote Debugging. You can also enable Hot Reload from there.

When running the app on an android device you will need to shake the device in order to see the dev tools. Another option is to use the adb shell on your dev machine terminal to give it commands.

To open the dev tools on a device: `adb shell input keyevent 82`
To refresh an android device used for testing run: `adb shell input text "RR"`

Some devices might show a `failed to connect to dev server` error. Most probably your dev machine is either on a different network, or has switched it's IP since your last session. To fix that:

1. Open dev tools on the device, shaking it or using the command above.
2. Open Dev Settings
3. In there tap Debug server host & port for device
4. Enter your IP, including the `:8081` port otherwise it's likely not to work.

To find your IP address on a Mac, open Settings > Network > Advanced (while your active connection is selected) > TCP/IP tab. Your local IP should be next to IPv4 Address.

## The dev Tools

The dev menu allows you to manually reload the app, but also enable live and hot reloads. Live reload reloads the app on the connected device when there are _saved_ changes in the source code on the dev machine. This means your progress trough the app screens will be lost and you will start at the Dashboar/Login screen again. Hot reload attempts to update the app without reloading, in which case your screen progress will not be bothered. This is perfect for when updating component styles.

Enabling `Debug JS Remotely` will allow you to see consol logs and errors and this is probably the most important feature of the Dev Tools.

Please note that a connected device in Dev mode is not representative of the actual performance of the app. Especially **enabling Debug JS Remotely will considerably slow down the app**.

## Debugger

When you enable `Debug JS Remotely` a Chrome tab will open, showing any console logs, helping you with the debugging process. [React Native Debugger](https://github.com/jhen0409/react-native-debugger) is a standalone alternative, which also allows you to monitor store changes and use the Inspector to examine specific React components as if in a normal DOM tree.
