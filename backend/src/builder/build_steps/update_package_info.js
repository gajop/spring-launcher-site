const Repository = require('../../models/repository')

async function updatePackageInfo (build, packageInfo) {
  const query = { 'builds._id': build._id }
  const update = { $set: {
    title: packageInfo.title
  } }
  await Repository.findOneAndUpdate(query, update).exec()
}

module.exports = {
  updatePackageInfo: updatePackageInfo
}
