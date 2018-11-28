const { execSync } = require('child_process');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const assert = require('assert');

const mongoose = require("mongoose");
const Repository = require("../models/repository");

const INTERNAL_VER = "1";

async function runBuilder() {
  try {
    await mongoose.connect('mongodb://localhost:27017/spring-launcher');
  } catch (err) {
    console.error('Connection failed');
    console.error(err);
    return;
  }
  console.log("Starting the builder...")

  while (true) {
    if (!await runQueries()) {
      await wait(5000);
    }
  }
}

async function runQueries() {
  console.log("Checking for build requests...");
  var repo;
  try {
    // First we lock all queued builds (change their status)
    await Repository.updateOne(
      { 'builds.build_info.status' : 'queued' },
      { "$set" : { "builds.$[].build_info.status" : "queued_lock"} }).exec();

    // Here we query and update one (locked) build query
    // We change its status to "started" and initialize the build time
    // We also return the changed query with the repo full name
    const query = { 'builds.build_info.status' : 'queued_lock' };
    const update = { "$set" : {
      "builds.$.build_info.status" : "started",
      "builds.$.build_info.started_time" : Date.now()
    }};
    repo = await Repository.findOneAndUpdate(
      query,
      update,
      {
        sort: { 'builds.build_info.created_time': -1 },
        projection: { "full_name": 1, "builds.$": 1}
      }
    ).exec();
    if (repo == null) {
      return false;
    }

    // We then skip all older queued builds for this repo
    // This results in fewer builds and therefore saves resources
    console.log(repo._id);
    await Repository.updateOne(
      { _id : repo._id,
        'builds.build_info.status' : 'queued_lock' },
      { "$set" : { "builds.$[].build_info.status" : "skipped"} }).exec();
  } catch (err) {
    // Seems like hell at this point? TODO: Handle exceptions better.
    console.error(err);
    return false;
  }

  // There should be only one build returned
  // assert(repo.builds.length == 1);
  console.log(`One queued repo: ${repo.full_name}`);
  console.log(repo.builds[0]);


  processBuildRequest(repo.builds[0], repo.full_name);

  return true;
}

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds))
}


function processBuildRequest(build, repo_full_name) {
  console.log(`Cloning repositories`);
  const git_url = `https://github.com/${repo_full_name}.git`;
  const repo_dir = `repo/${repo_full_name}`;

  try {
    logCall(clonePartially(git_url, repo_dir));
  } catch (err) {
    reportBuildFailure(build,
      repo_full_name,
      "Failed cloning Git repository.")
    return false;
  }

  const launcher_dir = 'repo/spring-launcher';
  try {
    logCall(clone('https://github.com/gajop/spring-launcher.git',
          launcher_dir));
  } catch (err) {
    reportBuildFailure(build,
      repo_full_name,
      "Internal Error. Failed cloning Launcher Git repository.")
    return false;
  }

  console.log('Creating package.json');
  try {
    const version = `${INTERNAL_VER}.`
                    + execSync('git rev-list --count HEAD', { cwd: repo_dir }).toString().trim()
                    + '.0';
    console.log('version: ', version);
    logCall(create_package_json(launcher_dir, repo_dir, repo_full_name, version));
  } catch (err) {
    console.error(err);
    reportBuildFailure(build, repo_full_name,
      "Failed to create package.json")
    return false;
  }


  console.log(`Starting the build`);
  const build_dir = `build/${repo_full_name}`;
  try {
    logCall(buildRepository(repo_dir, launcher_dir, build_dir));
  } catch (err) {
    reportBuildFailure(build,
      repo_full_name,
      "Failed building the launcher executables.")
    return false;
    // console.error(err.toString());
  }

  console.log(`Uploading the build`);
  try {
    logCall(uploadBuild(build_dir, repo_full_name));
  } catch (err) {
    reportBuildFailure(build,
      repo_full_name,
      "Failed uploading the launcher executables.")
    return false;
    // console.error(err.toString());
  }

  return true;
};

function clonePartially (git_url, dir) {
  return (existsSync(dir) ?
          execSync('git pull', { cwd: dir }) :
          execSync(`sh partial_clone_repo.sh ${dir} ${git_url}`));
}

function clone(git_url, dir) {
  return (existsSync(dir) ?
          execSync('git pull', { cwd: dir }) :
          execSync(`sh full_clone_repo.sh ${dir} ${git_url}`));
}

function create_package_json(launcher_dir, repo_dir, repo_full_name, version) {
  const configStr = readFileSync(`${repo_dir}/dist_cfg/config.json`);
  const config = JSON.parse(configStr);

  assert(config.title != null);

  const repo_dot_name = repo_full_name.replace(/\//g, '.');

  const packageTemplate = readFileSync(`${launcher_dir}/package-template.json`).toString();
  const packageJson = packageTemplate
                        .replace("$(package_title)", config.title)
                        .replace("$(version)", version)
                        .replace("$(repo_full_name)", repo_full_name)
                        .replace("$(repo_dot_name)", repo_dot_name);

  writeFileSync(`${repo_dir}/package.json`, packageJson, 'utf8');
}

function buildRepository(repo_dir, launcher_dir, build_dir) {
  return execSync(`sh build_repo.sh ${repo_dir} ${launcher_dir} ${build_dir}`);
}

function uploadBuild(build_dir, repo_full_name) {
  return execSync(`sh upload_repo.sh ${build_dir} ${repo_full_name}`);
}

function logCall(stdout, stderr) {
  if (stdout) {
    console.log(stdout.toString());
  }
  if (stderr) {
    console.error(stderr.toString());
  }
}

async function reportBuildFailure(build, repo_full_name, err_msg) {
  const query = { 'builds._id' : build._id };
  const update = { "$set" : {
    "builds.$.build_info.status" : "failed",
    "builds.$.build_info.err_msg" : err_msg,
    "builds.$.build_info.end_time" : Date.now()
  }};
  return await Repository.findOneAndUpdate(query, update).exec();
}


if (require.main === module) {
  runBuilder();
}
