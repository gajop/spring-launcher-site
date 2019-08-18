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

  expect(packageInfo.buildTypes.includes('windows-portable')).toBe(true)
  expect(packageInfo.title).toBe('Test-Title')
})
