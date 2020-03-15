'use strict'

const assert = require('assert')
const { readFileSync } = require('fs')

function parsePackageInfo (repoDir) {
  const configStr = readFileSync(`${repoDir}/dist_cfg/config.json`)
  const config = JSON.parse(configStr)
  assert(config.title != null, 'Missing config title')

  var hasPortable = false
  for (const setup of config.setups) {
    if (setup.package && setup.package.portable === true) {
      hasPortable = true
      break
    }
  }

  var buildTypes = ['windows', 'linux']
  if (hasPortable) {
    buildTypes.push('windows-portable')
  }

  var downloadLinks = []
  for (const buildType of buildTypes) {
    var link = ''
    if (buildType === 'linux') {
      link = `${config.title}.AppImage`
    } else if (buildType === 'windows-portable') {
      link = `${config.title}-portable.exe`
    } else if (buildType === 'windows') {
      link = `${config.title}.exe`
    } else {
      throw new `Unexpected buildType: ${buildType}`()
    }

    downloadLinks.push({
      platform: buildType,
      link: link
    })
  }

  return {
    title: config.title,
    buildTypes: buildTypes,
    downloadLinks: downloadLinks
  }
}

module.exports = {
  parsePackageInfo: parsePackageInfo
}
