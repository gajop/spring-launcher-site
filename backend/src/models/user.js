const mongoose = require('mongoose')

module.exports = mongoose.model('User', mongoose.Schema({
  nick: { type: String, required: true },
  github_nick: { type: String, required: false },
  github_avatar_url: { type: String, requried: false },
  github_access_token: { type: String, required: false }
}))
