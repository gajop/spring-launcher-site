'use strict'

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

class NoSuchPartialPathError extends Error {
}
class FailedToCloneError extends Error {
}

function partialClone (gitUrl, clonePath, partialPath) {
  if (!partialPath.endsWith('*')) {
    partialPath += '*'
  }
  if (!partialPath.endsWith('/*')) {
    partialPath = partialPath.slice(0, partialPath.length - 1) + '/*'
  }
  console.log(`Partially cloning: ${gitUrl}:${partialPath} to ${clonePath}...`)

  fs.existsSync(clonePath) ? pullExisting(clonePath) : cloneNew(gitUrl, clonePath, partialPath)
}

function pullExisting (clonePath) {
  execSync('git pull --rebase', {
    cwd: clonePath
  })
}

function cloneNew (gitUrl, clonePath, partialPath) {
  fs.ensureDirSync(clonePath)
  execSync('git init', {
    cwd: clonePath
  })
  execSync('git config core.sparseCheckout true', {
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

  fs.writeFileSync(
    path.join(clonePath, '.git/info/sparse-checkout'),
    partialPath
  )

  try {
    execSync('git checkout master', {
      cwd: clonePath
    })
  } catch (error) {
    if (error.message.includes('error: Sparse checkout leaves no entry on working directory')) {
      throw new NoSuchPartialPathError()
    }
    throw error
  }
}

module.exports = {
  partialClone: partialClone,
  NoSuchPartialPathError: NoSuchPartialPathError,
  FailedToCloneError: FailedToCloneError
}
