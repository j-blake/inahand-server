// Get dependencies
require('dotenv').config();
const path = require('path');
const http = require('http');
const appInit = require('./app');

appInit().then((app) => {
  const httpsServer = http.createServer(app);
  httpsServer.listen(process.env.HTTP_PORT);
});
