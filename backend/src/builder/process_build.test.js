'use strict'

const { processBuild } = require('./process_build')

const fs = require('fs-extra')
const path = require('path')

var TEST_DIR

beforeEach(() => {
  TEST_DIR = fs.mkdtempSync('test')
})

afterEach(() => {
  fs.removeSync(TEST_DIR)
})

test('ok-build-1', () => {
  processBuild('test-repo',
    'https://github.com/gajop/test-repo.git',
    path.join(TEST_DIR, 'repo'),
    path.join(TEST_DIR, 'build')
  )
})
