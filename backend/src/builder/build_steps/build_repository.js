const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

function buildRepository (repoDir, launcherDir, buildDir) {
  console.log('Starting the build...')
  fs.removeSync(buildDir)
  fs.ensureDirSync(buildDir)
  fs.copySync(launcherDir, buildDir)
  fs.copySync(path.join(repoDir, 'dist_cfg'), path.join(buildDir, 'src'))
  copyIfExists(path.join(repoDir, 'dist_cfg/bin'), path.join(buildDir, 'bin'))
  copyIfExists(path.join(repoDir, 'dist_cfg/files'), path.join(buildDir, 'files'))
  fs.removeSync(path.join(buildDir, 'src/bin'))
  // fs.copySync(path.join(repoDir, 'package.json'), path.join(buildDir))
  execSync(`npm install`, { cwd: buildDir })
  execSync(`npm run build -lw`, { cwd: buildDir })
}

function copyIfExists (src, dest) {
  if (fs.existsSync(src)) {
    fs.copySync(src, dest)
  }
}

module.exports = {
  buildRepository: buildRepository
}
