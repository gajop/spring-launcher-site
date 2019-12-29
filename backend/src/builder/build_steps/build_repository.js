const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

function buildRepository(repoDir, launcherDir, buildDir, buildTypes) {
  console.log('Starting the build...')
  fs.removeSync(buildDir)
  fs.ensureDirSync(buildDir)
  fs.copySync(launcherDir, buildDir)
  fs.copySync(path.join(repoDir, 'dist_cfg'), path.join(buildDir, 'src'))
  copyIfExists(path.join(repoDir, 'dist_cfg/bin'), path.join(buildDir, 'bin'))
  copyIfExists(path.join(repoDir, 'dist_cfg/files'), path.join(buildDir, 'files'))
  copyIfExists(path.join(repoDir, 'dist_cfg/build'), path.join(buildDir, 'build'))
  fs.removeSync(path.join(buildDir, 'src/bin'))
  fs.copySync(path.join(repoDir, 'package.json'), path.join(buildDir, 'package.json'))
  execSync('npm install', { cwd: buildDir })
  if (buildTypes.includes('linux')) {
    execSync('npm run build-linux', { cwd: buildDir })
  }
  if (buildTypes.includes('windows-portable')) {
    const configStr = fs.readFileSync(`${buildDir}/src/config.json`)
    const config = JSON.parse(configStr)

    execSync('npm run build-win-portable', { cwd: buildDir })
    fs.moveSync(
      path.join(buildDir, `dist/${config.title}.exe`),
      path.join(buildDir, `dist/${config.title}-portable.exe`)
    )
  }
  if (buildTypes.includes('windows')) {
    execSync('npm run build-win', { cwd: buildDir })
  }
}

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copySync(src, dest)
  }
}

module.exports = {
  buildRepository: buildRepository
}
