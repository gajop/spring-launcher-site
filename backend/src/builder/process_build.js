'use strict'

const { partialClone } = require('./build_steps/partial_clone')
const { clone } = require('./build_steps/clone')
const { createPackagejsonFromGit } = require('./build_steps/create_packagejson')
const { buildRepository } = require('./build_steps/build_repository')
const { uploadBuild } = require('./build_steps/upload_build')
const { parsePackageInfo } = require('./build_steps/parse_package_info')

function processBuild (repoFullName, gitUrl, repoPrefix, buildPrefix) {
  console.log('Cloning repositories...')
  const repoDir = `${repoPrefix}/${repoFullName}`
  const launcherDir = `${repoPrefix}/spring-launcher`
  const buildDir = `${buildPrefix}/${repoFullName}`

  partialClone(gitUrl, repoDir, 'dist_cfg')
  clone('https://github.com/gajop/spring-launcher.git', launcherDir)
  createPackagejsonFromGit(launcherDir, repoDir, repoFullName)
  const packageInfo = parsePackageInfo(repoDir)
  for (const downloadLink of packageInfo.downloadLinks) {
    downloadLink.link = `${repoFullName}/${downloadLink.link}`
  }

  buildRepository(repoDir, launcherDir, buildDir, packageInfo.buildTypes)
  uploadBuild(buildDir, repoFullName)
  return packageInfo
}

module.exports = {
  processBuild: processBuild
}
