const express = require('express')
const Octokit = require('@octokit/rest')

const checkAuth = require('../middleware/check-auth')
const User = require('../models/user')
const Repository = require('../models/repository')

const router = express.Router()

router.get('', (req, res, next) => {
  Repository.find().then(repositories => {
    res.status(200).json(repositories)
  })
})

router.get('/available',
  checkAuth,
  (req, res, next) => {
    User.findOne({
      github_nick: req.userData.github_nick
    }).then(user => {
      const octokit = new Octokit()
      octokit.authenticate({
        type: 'token',
        token: process.env.CLIENT_SECRET // user.github_access_token
      })

      // octokit.apps.getInstallations({}).then(result => {
      //   console.log('getInstallations', result);
      // });

      // octokit.apps.getInstallationRepositories({}).then(result => {
      //   console.log('getInstallationRepositories', result);
      // });
      res.status(200).json({ message: 'OK' })
    })
  })

module.exports = router
