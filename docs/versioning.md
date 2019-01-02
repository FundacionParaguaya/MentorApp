This app follows the [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) approach to version labelling. Please refer to it when deciding on a version number for a new release. In the _source_ we change the version this way in `package.json` and `android/app/build.gradle`. If you are releasing `1.x.x` for example you set both of these to the same number. You can see past releases in the repo release tab so you can decide on version number. There is also a programatically generated [Changelog](../CHANGELOG.md).

When releasing a new version you should apply the following steps before deploying:

1. Decide on the proper number of this release.
2. Update the `package.json`, `version` prop with this number.
3. Add a git tag to the corresponging commit in `master` branch, using `git tag v1.x.x` for example.
4. Push the tag to remote using `git push origin --tags`
5. Generate the updated changelog using the [Github Changelog Generator](https://github.com/github-changelog-generator/github-changelog-generator). Follow installation instructions if you don’t have it. The basic command is `github_changelog_generator -t <github_token>`. You generate the github token following [this guide](https://github.com/github-changelog-generator/github-changelog-generator#github-token). You need a token because GitHub only allows 50 unauthenticated requests per hour. Remove the `generated using` line from he changelog before pushing it.
6. Commit the changes to master.
7. Follow the [deploying](deploying.md) guide.

After the release is out, you can edit it’s details in the Releases tab of the Code section of this repo. Click on the given release and use open text to describe what are the general changes in this release.
