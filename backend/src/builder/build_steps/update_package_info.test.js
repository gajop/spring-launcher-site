'use strict'

const { updatePackageInfo } = require('./update_package_info')

test('ok-update-1', () => {
  const build = {}
  updatePackageInfo(build, {
    title: 'TestTitle'
  })
})
