const Repository = require('../../models/repository')

async function updatePackageInfo (build, packageInfo) {
  const query = { 'builds._id': build._id }
  const update = { $set: {
    title: packageInfo.title,

    download_links: packageInfo.download_links
  } }
  await Repository.findOneAndUpdate(query, update).exec()
}

module.exports = {
  updatePackageInfo: updatePackageInfo
}
