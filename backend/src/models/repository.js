const mongoose = require('mongoose')

module.exports = mongoose.model('Repository', mongoose.Schema({
  // Git repo information
  github_id: { type: Number, required: true },
  full_name: { type: String, required: true },
  name: { type: String, required: false },

  // dist_cfg/config.json
  image_url: { type: String, required: false },
  site_url: { type: String, required: false },
  title: { type: String, required: false },

  installation: {
    id: { type: Number, required: true },
    url: { type: String, required: true }
  },

  download_links: [{
    platform: { type: String, required: true },
    link: { type: String, required: true }
  }],

  builds: [{
    // commit info
    commit: {
      message: { type: String, required: false },
      hash: { type: String, required: false },
      url: { type: String, required: false },
      timestamp: { type: Date, required: false },
      committer: {
        name: { type: String, required: false },
        email: { type: String, required: false },
        username: { type: String, required: false }
      }
    },
    // TODO: support different branches
    // branch: {
    //   name: { type: String, required: false },
    //   url: { type: String, required: false },
    // },
    build_info: {
      created_time: { type: Date, required: false },
      started_time: { type: Date, required: false },
      ended_time: { type: Date, required: false },
      status: { type: String, required: true },
      err_msg: { type: String, required: false }
    },

    result_info: {
      dl_windows_url: { type: String, required: false },
      dl_linux_url: { type: String, required: false },
      dl_build_log_url: { type: String, required: false }
    }
  }]
}))
