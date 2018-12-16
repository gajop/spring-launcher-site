#!/bin/bash

# First argument is game path
# Second argument is the launcher dir
# Thrid argument is the build dir


rm -rf "$3"
mkdir -p "$3"
cp -r "$2"/* "$3"
cp -r "$1/dist_cfg/"* "$3/src"
cp -r "$1/dist_cfg/bin/"* "$3/bin/*"
rm -rf "$3/src/bin"
cp "$1/package.json" "$3/"

cd "$3"
npm install
npm run build -lw
