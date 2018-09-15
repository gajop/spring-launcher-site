const mongoose = require('mongoose');

module.exports = mongoose.model('Game', mongoose.Schema({
  title: { type: String, required: false },
  image_url: { type: String, required: false },
  github_url: { type: String, required: false },
  site_url: { type: String, required: false }
}));
