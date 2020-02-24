const mongoose = require('mongoose')

const Repository = require('../models/repository')

if (require.main === module) {
	applyPatch()
}

async function applyPatch() {
	try {
		await mongoose.connect('mongodb://localhost:27017/spring-launcher')
	} catch (err) {
		console.error('Connection failed')
		console.error(err)
		return
	}
	console.log('Applying status rename patch...')
	await updateAll();
	process.exit()
}

async function updateAll() {
	try {
		const repos = await Repository.find();
		for (const repo of repos) {
			for (const build of repo.builds) {
				if (build.build_info.status !== 'success' && build.build_info.status !== 'failed') {
					continue;
				}
				console.log(`Updating build: ${build.id} for repository: ${repo.full_name}`)
				const query = { 'builds._id': build._id }
				console.log(build.build_info.status)
				const update = build.build_info.err_msg != null
					? { $set: { 'builds.$.build_info.status': 'failure', } }
					: { $set: { 'builds.$.build_info.status': 'success', } };
				await Repository.findOneAndUpdate(query, update).exec()
			}
		}
	} catch (err) {
		console.error(err)
		return;
	}
}
