'use strict'

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const BuildStep = require('./build_step')

class NoSuchPartialPathError extends Error {
}
class FailedToCloneError extends Error {
}

class PartialClone extends BuildStep {
  constructor (gitUrl, clonePath, partialPath) {
    super('Partial clone')
    this.gitUrl = gitUrl
    this.clonePath = clonePath
    this.partialPath = partialPath
  }

  execute () {
    console.log(`Partially cloning: ${this.gitUrl}:${this.partialPath} to ${this.clonePath}...`)

    fs.existsSync(this.clonePath) ? this.pullExisting() : this.cloneNew()
  }

  pullExisting () {
    execSync('git pull --rebase', {
      cwd: this.clonePath
    })
  }

  cloneNew () {
    fs.mkdirSync(this.clonePath)
    execSync('git init', {
      cwd: this.clonePath
    })
    execSync('git config core.sparseCheckout true', {
      cwd: this.clonePath
    })

    try {
      execSync(`git remote add -f origin ${this.gitUrl}`, {
        cwd: this.clonePath,
        timeout: 10000
      })
    } catch (error) {
      if (error.code === 'ETIMEDOUT') {
        throw new FailedToCloneError()
      }
      throw error
    }

    fs.writeFileSync(
      path.join(this.clonePath, '.git/info/sparse-checkout'),
      `${this.partialPath}/*`
    )

    try {
      execSync('git checkout master', {
        cwd: this.clonePath
      })
    } catch (error) {
      if (error.message === 'error: Sparse checkout leaves no entry on working directory') {
        throw new NoSuchPartialPathError()
      }
      throw error
    }
  }
}

module.exports = {
  PartialClone: PartialClone

}
