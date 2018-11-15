const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const extname = path.extname;



// `https://github.com/${gajop/test-repo}.git`

module.exports.clonePartially = async function(git_url, dir) {
  if (!fs.existsSync(dir)) {
    const cmd = `sh partial_clone_repo.sh ${dir} ${git_url}`;
    const { stdout, stderr } = execSync(cmd);
  } else {
    const { stdout, stderr } = await exec('git pull', {
      cwd: dir
    });
    console.log(stdout, stderr);
  }
};

module.exports.clone = async function(git_url, dir) {
  if (!fs.existsSync(dir)) {
    const cmd = `sh full_clone_repo.sh ${dir} ${git_url}`;
    const { stdout, stderr } = execSync(cmd);
  } else {
    const { stdout, stderr } = await exec('git pull', {
      cwd: dir
    });
    console.log(stdout, stderr);
  }
};

module.exports.build = async function(repo_dir, launcher_dir, build_dir) {
  const cmd = `sh build_repo.sh ${repo_dir} ${launcher_dir} ${build_dir}`;
  const { stdout, stderr } = await exec(cmd);
  console.log(stdout, stderr);
}
