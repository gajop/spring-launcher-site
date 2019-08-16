const { execSync } = require('child_process')

function uploadBuild (buildDir, repoFullName) {
  console.log('Uploading the build...')
  console.log(`Copying ${buildDir}/dist/*.json ${buildDir}/dist/*.yml ${buildDir}/dist/mac/*.zip ${buildDir}/dist/mac/*.dmg ${buildDir}/dist/*.exe ${buildDir}/dist/*.AppImage to s3://spring-launcher/${repoFullName}`)
  execSync(`s3cmd put ${buildDir}/dist/*.json ${buildDir}/dist/*.yml ${buildDir}/dist/mac/*.zip ${buildDir}/dist/mac/*.dmg ${buildDir}/dist/*.exe ${buildDir}/dist/*.AppImage s3://spring-launcher/${repoFullName}/ --recursive --acl-public --add-header=Cache-Control:max-age=86400`)
}

module.exports = {
  uploadBuild: uploadBuild
}
