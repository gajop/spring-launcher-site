const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Repository', mongoose.Schema({
  github_id: { type: Number, required: true},
  full_name: { type: String, required: true },
  name: { type: String, required: false },

  image_url: { type: String, required: false },
  site_url: { type: String, required: false },

  installation: {
    id: { type: Number, required: true},
    url: { type: String, required: true },
  },

  builds: [{
    // commit info
    commit : {
      message: { type: String, required: false },
      hash: { type: String, required: false },
      url: { type: String, required: false },
      timestamp: { type: Date, required: false },
      committer : {
        name: { type: String, required: false },
        email: { type: String, required: false },
        username: { type: String, required: false },
      }
    },
    // TODO: support different branches
    // branch: {
    //   name: { type: String, required: false },
    //   url: { type: String, required: false },
    // },
    build_info: {
      start: { type: Date, required: false },
      end: { type: Date, required: false },
      result: { type: String, required: false },
    },
  }]
}));

