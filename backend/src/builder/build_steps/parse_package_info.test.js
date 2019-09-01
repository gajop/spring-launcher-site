'use strict'

const fs = require('fs-extra')
const path = require('path')

const { partialClone } = require('./partial_clone')
const { clone } = require('./clone')
const { createPackagejsonFromGit } = require('./create_packagejson')
const { parsePackageInfo } = require('./parse_package_info')

var TEST_DIR

beforeEach(() => {
  TEST_DIR = fs.mkdtempSync('test')
})

afterEach(() => {
  fs.removeSync(TEST_DIR)
})

test('ok-parse-package-info-1', () => {
  const repoDir = path.join(TEST_DIR, 'repo')
  const launcherDir = path.join(TEST_DIR, 'launcher')

  partialClone('https://github.com/gajop/test-repo.git', repoDir, 'dist_cfg')
  clone('https://github.com/gajop/spring-launcher.git', launcherDir)
  createPackagejsonFromGit(launcherDir, repoDir, 'test-repo')
  const packageInfo = parsePackageInfo(repoDir)
  for (const downloadLink of packageInfo.downloadLinks) {
    downloadLink.link = `gajop/test-repo/${downloadLink.link}`
  }

  expect(packageInfo.buildTypes.includes('windows-portable')).toBe(true)
  expect(packageInfo.title).toBe('Test-Title')

  expect(packageInfo.downloadLinks.length).toBe(3)
  for (const downloadLink of packageInfo.downloadLinks) {
    if (downloadLink.platform === 'linux') {
      expect(downloadLink.link).toBe('gajop/test-repo/Test-Title.AppImage')
    } else if (downloadLink.platform === 'windows') {
      expect(downloadLink.link).toBe('gajop/test-repo/Test-Title.exe')
    } else if (downloadLink.platform === 'windows-portable') {
      expect(downloadLink.link).toBe('gajop/test-repo/Test-Title-portable.exe')
    }
  }
})
