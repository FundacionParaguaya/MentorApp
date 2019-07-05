#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

cd ../../ # navigate to the root folder
github_changelog_generator --token $GIT_KEY
