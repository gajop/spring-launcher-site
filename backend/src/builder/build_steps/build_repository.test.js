'use strict'

const fs = require('fs-extra')
const path = require('path')

const { partialClone } = require('./partial_clone')
const { clone } = require('./clone')
const { createPackagejsonFromGit } = require('./create_packagejson')
const { buildRepository } = require('./build_repository')
const { parsePackageInfo } = require('./parse_package_info')

var TEST_DIR

beforeEach(() => {
  TEST_DIR = fs.mkdtempSync('test')
})

afterEach(() => {
  fs.removeSync(TEST_DIR)
})

test('ok-build-repo-portable-1', () => {
  const repoDir = path.join(TEST_DIR, 'repo')
  const launcherDir = path.join(TEST_DIR, 'launcher')
  const buildDir = path.join(TEST_DIR, 'build')

  partialClone('https://github.com/gajop/test-repo.git', repoDir, 'dist_cfg')
  clone('https://github.com/gajop/spring-launcher.git', launcherDir)
  createPackagejsonFromGit(launcherDir, repoDir, 'test-repo')
  buildRepository(repoDir, launcherDir, buildDir, ['windows-portable'])

  const distDir = path.join(buildDir, 'dist')
  const packageInfo = parsePackageInfo(repoDir)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}-portable.exe`))).toBe(true)
})

test('ok-build-repo-2', () => {
  const repoDir = path.join(TEST_DIR, 'repo')
  const launcherDir = path.join(TEST_DIR, 'launcher')
  const buildDir = path.join(TEST_DIR, 'build')

  partialClone('https://github.com/gajop/test-repo.git', repoDir, 'dist_cfg')
  clone('https://github.com/gajop/spring-launcher.git', launcherDir)
  createPackagejsonFromGit(launcherDir, repoDir, 'test-repo')
  buildRepository(repoDir, launcherDir, buildDir, ['windows', 'linux', 'windows-portable'])

  const distDir = path.join(buildDir, 'dist')
  const packageInfo = parsePackageInfo(repoDir)
  expect(fs.existsSync(path.join(distDir, 'latest-linux.yml'))).toBe(true)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}.AppImage`))).toBe(true)

  expect(fs.existsSync(path.join(distDir, 'latest.yml'))).toBe(true)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}.exe`))).toBe(true)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}.exe.blockmap`))).toBe(true)

  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}-portable.exe`))).toBe(true)
})

test('ok-build-repo-3', () => {
  const repoDir = path.join(TEST_DIR, 'repo')
  const launcherDir = path.join(TEST_DIR, 'launcher')
  const buildDir = path.join(TEST_DIR, 'build')

  partialClone('https://github.com/gajop/test-repo.git', repoDir, 'dist_cfg')
  clone('https://github.com/gajop/spring-launcher.git', launcherDir)
  createPackagejsonFromGit(launcherDir, repoDir, 'test-repo')
  const packageInfo = parsePackageInfo(repoDir)
  buildRepository(repoDir, launcherDir, buildDir, packageInfo.buildTypes)

  const distDir = path.join(buildDir, 'dist')
  expect(fs.existsSync(path.join(distDir, 'latest-linux.yml'))).toBe(true)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}.AppImage`))).toBe(true)

  expect(fs.existsSync(path.join(distDir, 'latest.yml'))).toBe(true)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}.exe`))).toBe(true)
  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}.exe.blockmap`))).toBe(true)

  expect(fs.existsSync(path.join(distDir, `${packageInfo.title}-portable.exe`))).toBe(true)
})
