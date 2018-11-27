#!/bin/bash

# First argument is the build dir
# Second argument is the spaces path

echo "Copying $1/dist/*.json $1/dist/*.yml $1/dist/mac/*.zip $1/dist/mac/*.dmg $1/dist/*.exe $1/dist/*.AppImage to s3://spring-launcher/$2"

s3cmd put $1/dist/*.json $1/dist/*.yml $1/dist/mac/*.zip $1/dist/mac/*.dmg \
          $1/dist/*.exe $1/dist/*.AppImage s3://spring-launcher/$2/ --recursive --acl-public --add-header=Cache-Control:max-age=86400
