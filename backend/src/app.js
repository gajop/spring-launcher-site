/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */

module.exports = app => {
  const bodyParser = require('body-parser')
  const mongoose = require('mongoose')
  const router = app.route('/api')

  console.log(app.app())

  mongoose.connect('mongodb://localhost:27017/spring-launcher')
    .then(() => {
      console.log('Connected to database')
    })
    .catch(() => {
      console.error('Connection failed')
    })

  router.use(bodyParser.json())

  router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    )
    next()
  })

  router.use('/github', require('./routes/github'))
  router.use('/repos', require('./routes/repos'))
  router.use('/user', require('./routes/user'))

  const githubAppRepository = require('./routes/github_app')
  githubAppRepository(app)

  /* Spawning buildbots seems t

  const { spawn } = require('child_process');
  const child = spawn('node', ['./src/builder/builder.js'], {
    detached: true
  });
  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  console.log("spawned");
  // child.unref();

  */
}
