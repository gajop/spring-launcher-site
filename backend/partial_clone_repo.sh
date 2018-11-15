#!/bin/bash

# First argument is repository name.
# Second argument is repository url.

mkdir -p "$1"
cd "$1"
git init
git config core.sparseCheckout true
git remote add -f origin "$2"
echo "dist_cfg/*" > .git/info/sparse-checkout
git checkout master
