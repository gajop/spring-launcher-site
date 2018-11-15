/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */

module.exports = app => {
  const bodyParser = require('body-parser');
  const mongoose = require("mongoose");
  const router = app.route('/api');

  console.log(app.app())

  mongoose.connect('mongodb://localhost:27017/spring-launcher')
    .then(() => {
      console.log('Connected to database')
    })
    .catch(() => {
      console.error('Connection failed');
    });

  router.use(bodyParser.json());

  router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
  });

  router.use("/github", require('./routes/github'));
  router.use("/games", require('./routes/games'));
  router.use("/user", require('./routes/user'));

  const github_app_repository = require('./routes/github_app');
  github_app_repository(app);
}
