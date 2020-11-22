// Get dependencies
require('dotenv').config();
const path = require('path');
const https = require('https');
const fs = require('fs');
const appInit = require('./app');

// https://docs.microsoft.com/en-us/azure/application-gateway/self-signed-certificates
const options = {
  key: fs.readFileSync(path.join(__dirname, '../server.key'), 'utf8'),
  cert: fs.readFileSync(path.join(__dirname, '../server.crt'), 'utf8'),
  ca: fs.readFileSync(path.join(__dirname, '../rootCA.key'), 'utf8'),
  requestCert: false,
  rejectUnauthorized: false,
};
appInit().then((app) => {
  const httpsServer = https.createServer(options, app);
  httpsServer.listen(process.env.HTTPS_PORT);
});
