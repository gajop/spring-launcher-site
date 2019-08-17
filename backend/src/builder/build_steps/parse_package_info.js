const assert = require('assert')
const { readFileSync } = require('fs')

function parsePackageInfo (repoDir) {
  const configStr = readFileSync(`${repoDir}/dist_cfg/config.json`)
  const config = JSON.parse(configStr)
  assert(config.title != null)

  var hasPortable = false
  for (var setup in config.setups) {
    if (setup.package && setup.package.portable === true) {
      hasPortable = true
      break
    }
  }

  return {
    title: config.title,
    hasPortable: hasPortable
  }
}

module.exports = {
  parsePackageInfo: parsePackageInfo
}
