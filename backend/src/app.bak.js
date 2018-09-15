const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb://localhost:27017/spring-launcher')
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.error('Connection failed');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use("/api/github", require('./routes/github'));
app.use("/api/games", require('./routes/games'));

module.exports = app;
