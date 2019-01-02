# Deploying to production

To deploy the app on the Play Store, you need access to it on the Google Play Console. If you don't have access ask the product owner. If you have access follow these steps:

1. Open `/android/app/build.gradle` and find the lines with `versionCode` ane `versionName`. `versionCode` goes up by one number. `versionName` is set to the same number decided for this release - **please follow the [versioning](versioning.md) guide**. For example:

```
versionCode 6 // becomes versionCode 7
versionName "1.2.1" // becomes versionName "1.2.2" or "1.3.0"
```

2. Open Android Studio on your dev machine.
3. Open the MentorApp project in it. If this is the first time you are opening this project in Android Studio you will have to select `Open existing project` and then browse to `project_folder/android` and selecting it.
4. From the top menu select `Build > Generate Signed Bundle / APK`. If it's greyed out, checkout the bottom status bar. Are there any processes runing or is Android Studio indexing? Wait for these to finish.
5. Select APK in the next screen. Click Next.
6. In the following screen enter the full path to the `mentorapp.keystore`. It is located in the repo folder, should be in `/android/app/mentorapp.keystore`. Below that enter your credentials for all 3 fields. If you don't have credentials ask the dev team. Click Next.
7. In the next screen make sure you take a not of the destination folder, which should be `/android/app` in most cases. The build will generate in a `release` folder in the above directory. Check both checkboxes at the bottom of this screen. Click Finish.
8. Wait for the build to finish and then check the contents of the destination folder from the previous step. If there were no errors there should be a `app-release.apk` file in the release folder. We will try to add any possible build errors to this file as we encounter them.
9. Go to [Google Play Console](https://play.google.com/apps/publish/).
10. Select Poverty Stoplight Mentor App.
11. Select Release Management > App Releases.
12. Scroll down to this deploy's related track (for a testing/preview release it would be Internal Test Track, for a normal release it would be Production track) and click Manage on the right.
13. Click Create Release at the top (it may be displayed as Edit Release).
14. In the next screen click Browse Files and navigate to the `app-release.apk` file in the release folder you saw at step 8.
15. After the file is selected on the same screen make sure that in the section at the bottom labeled `What's new in this release?` you change up the text a bit. You can do any small change. Aslo check if the `Release name` is the version you put in step 1.
16. Finaly, hit Review.
