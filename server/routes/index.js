const fs = require('fs');
const path = require('path');
const express = require('express');

const routerDirectory = path.join(__dirname, './');

const routes = fs.readdirSync(routerDirectory)
  .filter(file => file.toLowerCase().indexOf('.js') && !file.startsWith('index'))
  /* eslint-disable-next-line global-require, import/no-dynamic-require */
  .map(file => require(path.join(routerDirectory, path.basename(file, '.js'))));

const router = express.Router();
routes.forEach(route => router.use(route));

module.exports = router;
