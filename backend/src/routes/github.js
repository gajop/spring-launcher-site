const express = require('express')
const request = require('request')

const router = express.Router()

const crypto = require('crypto')
const Octokit = require('@octokit/rest')

const jwt = require('jsonwebtoken')

const User = require('../models/user')

// SpringRTS Launcher GitHub app
// URL: https://github.com/settings/apps/springrts-launcher
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const JWT_SECRET = process.env.JWT_SECRET

var valid_states = []

// Github Apps authentication
// https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/
// Step 1: obtain URL
router.get('/auth/token', (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      throw err
    }

    const state = buffer.toString('hex')
    valid_states.push(state)

    res.status(200).json({
      client_id: CLIENT_ID,
      state: state
    })
  })
})

router.post('/auth/validate', (req, res, next) => {
  //
  const code = req.body.code
  const state = req.body.state

  request.post(
    'https://github.com/login/oauth/access_token', {
      json: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        state: state
      }
    }, function (error, response, body) {
      console.log('ERROR', error)
      console.log('statusCode', response.statusCode)
      console.log('statusCode', body)
      if (!error && response.statusCode == 200 && !body.error) {
        console.log('ACCESS_TOKEN', body.access_token)
        console.log('token_type', body.token_type)
        const octokit = new Octokit()
        octokit.authenticate({
          type: 'token',
          token: body.access_token
        })
        octokit.users.get({}).then(result => {
          console.log('GOT USER', result)
          const github_nick = result.data.login
          const github_avatar_url = result.data.avatar_url

          // User.findOneAndUpdate(
          //   { github_nick: github_nick },
          //   { github_nick: github_nick, nick: github_nick, github_avatar_url: github_avatar_url},
          //   { upsert: true, new: true, setDefaultsOnInsert: true }
          // )

          const user = new User({
            github_nick: github_nick,
            nick: github_nick,
            github_avatar_url: github_avatar_url,
            github_access_token: body.access_token
          })
          user.save((err, savedUser) => {
            console.log(savedUser._id)
          })

          const token = jwt.sign(
            { github_nick: github_nick },
            JWT_SECRET,
            { expiresIn: '1h' }
          )

          res.status(200).json({
            token: token,
            expiresIn: 3600
          })
        })
      } else {
        console.log('fail')
        res.status(404).json({
          message: 'Failed to authenticate with Github'
        })
      }
    })
})

module.exports = router
