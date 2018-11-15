#!/bin/bash

# First argument is repository name.
# Second argument is repository url.

mkdir -p "$1"
cd "$1"
git init
git remote add -f origin "$2"
git checkout master
