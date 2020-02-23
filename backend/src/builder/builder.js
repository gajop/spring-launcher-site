const mongoose = require('mongoose')

const Repository = require('../models/repository')

const { updatePackageInfo } = require('./build_steps/update_package_info')
const { processBuild } = require('./process_build')

async function runBuilder() {
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

async function runQueries() {
  let targetBuild = null
  let repo = null
  try {
    // Find one and lock its status
    const query = { 'builds.build_info.status': 'queued' }
    repo = await Repository.findOne(
      query
    ).exec()
    if (repo == null) {
      return
    }

    let newestDate = null
    for (const build of repo.builds) {
      if (build.build_info.status !== 'queued') {
        continue
      }
      if (newestDate == null || build.build_info.created_time > newestDate) {
        newestDate = build.build_info.created_time
        targetBuild = build
      }
    }

    if (targetBuild == null) {
      console.error('No queued build found despite there being a queried repo')
      return false
    }

    for (const build of repo.builds) {
      if (build.build_info.status !== 'queued') {
        continue
      }
      if (build !== targetBuild) {
        console.log(`Skipping build: ${build}`)
        const query = { 'builds._id': build._id }
        const update = {
          $set: {
            'builds.$.build_info.status': 'skipped'
          }
        }
        await Repository.findOneAndUpdate(query, update).exec()
      }
    }
  } catch (err) {
    // Seems like hell at this point? TODO: Handle exceptions better.
    console.error(err)
    console.log(err)
    return false
  }

  console.log(`One repository queued: ${repo.full_name}`)
  console.log(targetBuild)
  {
    const query = { 'builds._id': targetBuild._id }
    const update = {
      $set: {
        'builds.$.build_info.status': 'started',
        'builds.$.build_info.started_time': Date.now()
      }
    }
    await Repository.findOneAndUpdate(query, update).exec()
  }

  try {
    const gitUrl = `https://github.com/${repo.full_name}.git`
    const packageInfo = processBuild(repo.full_name, gitUrl, 'repo', 'build')
    updatePackageInfo(targetBuild, packageInfo)
    {
      const query = { 'builds._id': targetBuild._id }
      const update = {
        $set: {
          'builds.$.build_info.status': 'success',
          'builds.$.build_info.ended_time': Date.now()
        }
      }
      await Repository.findOneAndUpdate(query, update).exec()
    }
  } catch (err) {
    console.error(err)
    console.log(err)
    reportBuildFailure(targetBuild, err.message)
  }

  return true
}

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds))
}

async function reportBuildFailure(build, errMsg) {
  const query = { 'builds._id': build._id }
  const update = {
    $set: {
      'builds.$.build_info.status': 'failure',
      'builds.$.build_info.err_msg': errMsg,
      'builds.$.build_info.ended_time': Date.now()
    }
  }
  return Repository.findOneAndUpdate(query, update).exec()
}

module.exports = {
  runBuilder: runBuilder
}
