'use strict'

const { partialClone, NoSuchPartialPathError, FailedToCloneError } = require('./partial_clone')

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

var TEST_DIR

beforeEach(() => {
  TEST_DIR = fs.mkdtempSync('test')
})

afterEach(() => {
  fs.removeSync(TEST_DIR)
})

test('ok-clone-1', () => {
  const clonePath = path.join(TEST_DIR, 'clonedir')
  const partialPath = 'backend/src/builder'
  partialClone('https://github.com/gajop/spring-launcher-site.git',
    clonePath,
    partialPath)
  expect(fs.existsSync(clonePath)).toBe(true)
  expect(fs.existsSync(path.join(clonePath, partialPath))).toBe(true)
})

test('ok-clone-2', () => {
  // Clone two local repos: commit to the first, pull from the other
  // In this way, check if updating functionality works

  // first repo
  const clonePath1 = path.join(TEST_DIR, 'clonedir1')
  const partialPath = 'src/exts'
  partialClone('https://github.com/gajop/spring-launcher.git',
    clonePath1,
    partialPath)
  expect(fs.existsSync(clonePath1)).toBe(true)
  expect(fs.existsSync(path.join(clonePath1, partialPath))).toBe(true)

  // second repo (based on the first one)
  const clonePath2 = path.join(TEST_DIR, 'clonedir2')
  partialClone(path.resolve(clonePath1),
    clonePath2,
    partialPath)
  expect(fs.existsSync(clonePath2)).toBe(true)
  expect(fs.existsSync(path.join(clonePath2, partialPath))).toBe(true)

  // add a file to repo 1
  execSync(`touch ${clonePath1}/${partialPath}/test.txt`)
  expect(fs.existsSync(`${clonePath1}/${partialPath}/test.txt`)).toBe(true)
  execSync(`git add ${partialPath}/test.txt`, { cwd: clonePath1 })
  execSync('git commit -m "add new file"', { cwd: clonePath1 })

  // clone it to repo 2
  partialClone(path.resolve(clonePath1),
    clonePath2,
    partialPath)
  expect(fs.existsSync(path.join(clonePath2, partialPath, 'test.txt'))).toBe(true)
})

test('ok-update', () => {
  const clonePath = path.join(TEST_DIR, 'clonedir')
  const partialPath = 'backend/src/builder'
  partialClone('https://github.com/gajop/spring-launcher-site.git',
    clonePath,
    partialPath)
  expect(fs.existsSync(clonePath)).toBe(true)
  expect(fs.existsSync(path.join(clonePath, partialPath))).toBe(true)
})

test('fail-no-partial-path', () => {
  const clonePath = path.join(TEST_DIR, 'clonedir')
  const partialPath = 'dist_cfg'
  expect(() => partialClone('https://github.com/gajop/spring-launcher.git',
    clonePath,
    partialPath)).toThrow(NoSuchPartialPathError)
  expect(fs.existsSync(path.join(clonePath, partialPath))).toBe(false)
})

test('fail-invalid-git-url', () => {
  const clonePath = path.join(TEST_DIR, 'clonedir')
  const partialPath = 'src/exts'
  expect(() => partialClone('https://github.com/gajop/spring-launcher.invalid',
    clonePath,
    partialPath)).toThrow(FailedToCloneError)
  expect(fs.existsSync(path.join(clonePath, partialPath))).toBe(false)
})
