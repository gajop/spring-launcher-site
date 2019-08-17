'use strict'

const fs = require('fs-extra')
const { execSync } = require('child_process')

class FailedToCloneError extends Error {
}

function clone (gitUrl, clonePath) {
  console.log(`Cloning: ${gitUrl} to ${clonePath}...`)

  fs.existsSync(clonePath) ? pullExisting(clonePath) : cloneNew(gitUrl, clonePath)
}

function pullExisting (clonePath) {
  execSync('git pull --rebase', {
    cwd: clonePath
  })
}

function cloneNew (gitUrl, clonePath) {
  fs.ensureDirSync(clonePath)
  execSync('git init', {
    cwd: clonePath
  })

  try {
    execSync(`git remote add -f origin ${gitUrl}`, {
      cwd: clonePath,
      // TODO: These numbers are arbitrary and depend on the connection
      timeout: 120000
    })
  } catch (error) {
    if (error.code === 'ETIMEDOUT') {
      throw new FailedToCloneError()
    }
    throw error
  }
  execSync('git checkout master', {
    cwd: clonePath
  })
}

module.exports = {
  clone: clone

}
