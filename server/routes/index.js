const fs = require('fs');
const path = require('path');
const express = require('express');
const authMiddleware = require('../middleware/authentication');

const filterRoutesInDirectory = (dir) =>
  fs
    .readdirSync(dir)
    .filter(
      (file) =>
        file.toLowerCase().indexOf('.js') !== -1 && !file.startsWith('index')
    )
    /* eslint-disable-next-line global-require, import/no-dynamic-require */
    .map((file) => require(path.join(dir, path.basename(file, '.js'))));

const router = express.Router();
const publicDirectory = path.join(__dirname, './public');
const publicRoutes = filterRoutesInDirectory(publicDirectory);
const protectedDirectory = path.join(__dirname, './');
const protectedRoutes = filterRoutesInDirectory(protectedDirectory);

router.use([...publicRoutes, authMiddleware, ...protectedRoutes]);

module.exports = router;
