const { execSync } = require('child_process')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const assert = require('assert')

const mongoose = require('mongoose')
const Repository = require('../models/repository')

const INTERNAL_VER = '1'

async function runBuilder () {
  try {
    await mongoose.connect('mongodb://localhost:27017/spring-launcher')
  } catch (err) {
    console.error('Connection failed')
    console.error(err)
    return
  }
  console.log('Starting the builder...')

  console.log('Checking for build requests...')
  while (true) {
    if (!await runQueries()) {
      await wait(5000)
    } else {
      console.log('Checking for build requests...')
    }
  }
}

async function runQueries () {
  var repo
  try {
    // First we lock all queued builds (change their status)
    await Repository.updateOne(
      { 'builds.build_info.status': 'queued' },
      { $set: { 'builds.$[].build_info.status': 'queued_lock' } }).exec()

    // Here we query and update one (locked) build query
    // We change its status to "started" and initialize the build time
    // We also return the changed query with the repo full name
    const query = { 'builds.build_info.status': 'queued_lock' }
    const update = { $set: {
      'builds.$.build_info.status': 'started',
      'builds.$.build_info.started_time': Date.now()
    } }
    repo = await Repository.findOneAndUpdate(
      query,
      update,
      {
        sort: { 'builds.build_info.created_time': -1 },
        projection: { full_name: 1, 'builds.$': 1 }
      }
    ).exec()
    if (repo == null) {
      return false
    }

    // We then skip all older queued builds for this repo
    // This results in fewer builds and therefore saves resources
    console.log(repo._id)
    await Repository.updateOne(
      { _id: repo._id,
        'builds.build_info.status': 'queued_lock' },
      { $set: { 'builds.$[].build_info.status': 'skipped' } }).exec()
  } catch (err) {
    // Seems like hell at this point? TODO: Handle exceptions better.
    console.error(err)
    return false
  }

  // There should be only one build returned
  // assert(repo.builds.length == 1);
  console.log(`One queued repo: ${repo.full_name}`)
  console.log(repo.builds[0])

  processBuildRequest(repo.builds[0], repo.full_name)

  return true
}

function wait (milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds))
}

function processBuildRequest (build, repoFullName) {
  console.log(`Cloning repositories`)
  const gitUrl = `https://github.com/${repoFullName}.git`
  const repoDir = `repo/${repoFullName}`

  try {
    logCall(clonePartially(gitUrl, repoDir))
  } catch (err) {
    reportBuildFailure(build,
      repoFullName,
      'Failed cloning Git repository.')
    return false
  }

  const launcherDir = 'repo/spring-launcher'
  try {
    logCall(clone('https://github.com/gajop/spring-launcher.git',
      launcherDir))
  } catch (err) {
    reportBuildFailure(build,
      repoFullName,
      'Internal Error. Failed cloning Launcher Git repository.')
    return false
  }

  console.log('Creating package.json')
  try {
    const version = `${INTERNAL_VER}.` +
                    execSync('git rev-list --count HEAD', { cwd: repoDir }).toString().trim() +
                    '.0'
    console.log('version: ', version)
    logCall(createPackageJson(launcherDir, repoDir, repoFullName, version))
  } catch (err) {
    console.error(err)
    reportBuildFailure(build, repoFullName,
      'Failed to create package.json')
    return false
  }

  console.log(`Starting the build`)
  const buildDir = `build/${repoFullName}`
  try {
    logCall(buildRepository(repoDir, launcherDir, buildDir))
  } catch (err) {
    reportBuildFailure(build,
      repoFullName,
      'Failed building the launcher executables.')
    return false
    // console.error(err.toString());
  }

  console.log(`Uploading the build`)
  try {
    logCall(uploadBuild(buildDir, repoFullName))
  } catch (err) {
    reportBuildFailure(build,
      repoFullName,
      'Failed uploading the launcher executables.')
    return false
    // console.error(err.toString());
  }

  return true
};

function clonePartially (gitUrl, dir) {
  return (existsSync(dir)
    ? execSync('git pull', { cwd: dir })
    : execSync(`sh partial_clone_repo.sh ${dir} ${gitUrl}`))
}

function clone (gitUrl, dir) {
  return (existsSync(dir)
    ? execSync('git pull', { cwd: dir })
    : execSync(`sh full_clone_repo.sh ${dir} ${gitUrl}`))
}

function createPackageJson (launcherDir, repoDir, repoFullName, version) {
  const configStr = readFileSync(`${repoDir}/dist_cfg/config.json`)
  const config = JSON.parse(configStr)

  assert(config.title != null)

  const repoDotName = repoFullName.replace(/\//g, '.')

  const packageTemplate = JSON.parse(readFileSync(`${launcherDir}/package.json`).toString())
  packageTemplate.name = config.title.replace(/ /g, '-')
  // eslint-disable-next-line no-template-curly-in-string
  packageTemplate.build.artifactName = config.title + '.${ext}' // '' is used on purpose, we want the spring to contain ${ext} as text
  packageTemplate.version = version
  packageTemplate.build.appId = `com.springrts.launcher.${repoDotName}`
  packageTemplate.build.publish.url = `https://spring-launcher.ams3.digitaloceanspaces.com/${repoFullName}`

  writeFileSync(`${repoDir}/package.json`, JSON.stringify(packageTemplate), 'utf8')
}

function buildRepository (repoDir, launcherDir, buildDir) {
  return execSync(`sh build_repo.sh ${repoDir} ${launcherDir} ${buildDir}`)
}

function uploadBuild (buildDir, repoFullName) {
  return execSync(`sh upload_repo.sh ${buildDir} ${repoFullName}`)
}

function logCall (stdout, stderr) {
  if (stdout) {
    console.log(stdout.toString())
  }
  if (stderr) {
    console.error(stderr.toString())
  }
}

async function reportBuildFailure (build, repoFullName, errMsg) {
  const query = { 'builds._id': build._id }
  const update = { $set: {
    'builds.$.build_info.status': 'failed',
    'builds.$.build_info.err_msg': errMsg,
    'builds.$.build_info.end_time': Date.now()
  } }
  return Repository.findOneAndUpdate(query, update).exec()
}

module.exports = {
  runBuilder: runBuilder
}
