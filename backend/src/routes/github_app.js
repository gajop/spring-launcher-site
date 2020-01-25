const Repository = require('../models/repository')

module.exports = app => {
  function addUniqueRepositories (installation, repos) {
    for (repo of repos) {
      const repoName = repo.name
      const query = { github_id: repo.id }
      Repository.findOneAndUpdate(query, {
        github_id: repo.id,
        name: repo.name,
        full_name: repo.full_name,

        installation: {
          id: installation.id,
          url: installation.html_url
        }
      }, {
        upsert: true
      }, (err, doc) => {
        if (err) {
          app.log(`Error saving repository: ${err}`)
        } else {
          app.log(`Added repository: ${repoName}`)
        }
      })
    }
  }

  function removeUniqueRepositories (repos) {
    for (repo of repos) {
      const repoName = repo.name
      Repository.deleteOne({
        github_id: repo.id
      }, (err, doc) => {
        if (err) {
          app.log(`Error deleting repository: ${err}`)
        } else {
          app.log(`Removed repository: ${repoName}`)
        }
      })
    }
  }

  app.log('App loaded!')

  app.on(`*`, async context => {
    app.log('MY LOG', { event: context.event, action: context.payload.action })
  })

  // TODO: There should be some way to obtain all the event data on startup
  // Especially useful if some data is missing because of server outage.
  // Not sure what's possible... (ideas below didn't work)

  // app.auth().then(github => {
  //   // console.log('GITHUB', github);
  //   github.apps.getInstallations().then(res => {
  //     console.log('RES', res);
  //   });
  //   // github.apps.getInstallationRepositories().then(res => {
  //   //   console.log(res);
  //   // });
  // });
  // app.on('installations', async context => {
  //   app.log('Installations', context);
  // });

  // Github Installation
  app.on('installation.created', async context => {
    const pl = context.payload
    addUniqueRepositories(pl.installation, pl.repositories)
  })

  app.on('installation.deleted', async context => {
    const pl = context.payload
    Repository.deleteMany({
      'installation.id': pl.installation.id
    }, err => {
      app.log(`Error deleting repositories with installation id: ${pl.installation.id}`)
    })
  })

  // Github Repository
  app.on('installation_repositories.added', async context => {
    const pl = context.payload
    addUniqueRepositories(pl.installation, pl.repositories_added)
  })

  app.on('installation_repositories.removed', async context => {
    const pl = context.payload
    removeUniqueRepositories(pl.repositories_removed)
  })

  function isDistCfgChanged (commits) {
    for (commit of commits) {
      for (changes of [commit.added, commit.removed, commit.modified]) {
        for (change of changes) {
          if (change.startsWith('dist_cfg/')) {
            return true
          }
        }
      }
    }
    return false
  }

  // Github pushes
  app.on('push', async context => {
    // TODO: push can contain up to 20 commits.
    // Our tool might fail if there is more than that.
    // See: https://developer.github.com/v3/activity/events/types/#pushevent

    const pl = context.payload

    if (!isDistCfgChanged(pl.commits)) {
      app.log(`Commits don't contain changes to dist_cfg: ${pl.head_commit.tree_id}`)
      return
    }

    // Repo name (link)
    const repo_id = pl.repository.id
    const head_commit = pl.head_commit

    const build = {
      commit: {
        message: head_commit.message,
        hash: head_commit.id,
        url: head_commit.url,
        timestamp: head_commit.timestamp,
        committer: {
          name: head_commit.committer.name,
          email: head_commit.committer.email,
          username: head_commit.committer.username
        }
      },
      build_info: {
        status: 'queued',
        created_time: Date.now()
      }
    }

    console.log(build)

    const query = { github_id: repo_id }
    Repository.findOneAndUpdate(query, {
      $push: { builds: build }
    }, (error, success) => {
      if (error) {
        app.log(error)
      } else {
        app.log(`Added build commit: ${head_commit.tree_id}`)
        app.log(build.build_info.status)
        // QueueBuild(repo_id, build);
      }
    })
  })
}
