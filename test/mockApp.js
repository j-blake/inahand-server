const express = require('express');
const bodyParser = require('body-parser');
const Identity = require('../server/model/identity');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

module.exports = app;
