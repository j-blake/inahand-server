const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const sessionMiddleware = (req, res, next) => {
  req.session = {};
  next();
};
app.use(sessionMiddleware);

module.exports = app;
