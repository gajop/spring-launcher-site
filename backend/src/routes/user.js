const express = require('express')
const router = express.Router()

const User = require('../models/user')
// User.remove({}, (err) => {
//   console.log("DATABASE CLEANED");
// });

const checkAuth = require('../middleware/check-auth')

router.get('',
  checkAuth,
  (req, res, next) => {
    User.findOne({
      github_nick: req.userData.github_nick
    }).then(user => {
      res.status(200).json(user)
    })
  })

module.exports = router
