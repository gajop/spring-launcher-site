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
	console.log('Applying status rename patch for succeed...')
	await updateSucceed();
	console.log('Applying status rename patch for failed...')
	await updateFailed();
	process.exit()
}

async function updateSucceed() {
	while (true) {
		try {
			const query = { 'builds.build_info.status': 'succeed' }
			let repo = await Repository.findOne(
				query
			).exec()
			if (repo == null) {
				return;
			}
			for (const build of repo.builds) {
				if (build.build_info.status !== 'succeed') {
					continue;
				}
				console.log(`Updating build: ${build.id} for repository: ${repo.full_name}`)
				const query = { 'builds._id': build._id }
				const update = {
					$set: {
						'builds.$.build_info.status': 'success',
					}
				}
				await Repository.findOneAndUpdate(query, update).exec()
			}
		} catch (err) {
			console.error(err)
			return;
		}
	}
}

async function updateFailed() {
	while (true) {
		try {
			const query = { 'builds.build_info.status': 'failed' }
			let repo = await Repository.findOne(
				query
			).exec()
			if (repo == null) {
				return;
			}
			for (const build of repo.builds) {
				if (build.build_info.status !== 'failed') {
					continue;
				}
				console.log(`Updating build: ${build.id} for repository: ${repo.full_name}`)
				const query = { 'builds._id': build._id }
				const update = {
					$set: {
						'builds.$.build_info.status': 'failure',
					}
				}
				await Repository.findOneAndUpdate(query, update).exec()
			}
		} catch (err) {
			console.error(err)
			return;
		}
	}
}