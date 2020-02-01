// Get dependencies
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const api = require('./routes');
const jwtMiddleware = require('./middleware/jwt');

function createMongooseConnection() {
  const uri = process.env.DB_CONNECTION;
  mongoose.connect(uri, { useNewUrlParser: true });
  return mongoose.connection;
}

function createExpressApp() {
  const expressApp = express();
  const swaggerDocument = YAML.load('server/swagger.yaml');
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Parsers for POST data
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(cookieParser(process.env.COOKIE_SECRET));

  // Point static path to dist
  expressApp.use(express.static(path.join(__dirname, 'dist')));
  expressApp.use(jwtMiddleware);
  expressApp.use('/api', api);

  // Catch all other routes and return the index file
  expressApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
  expressApp.set('port', process.env.PORT);

  return expressApp;
}

const connection = createMongooseConnection();
// eslint-disable-next-line no-console
connection.on('error', console.error.bind(console, 'connection error:'));

const app = createExpressApp();
const server = http.createServer(app);
const options = {
  key: fs.readFileSync(path.join(__dirname, '../server.key'), 'utf8'),
  cert: fs.readFileSync(path.join(__dirname, '../server.crt'), 'utf8'),
  ca: fs.readFileSync(path.join(__dirname, '../rootCA.key'), 'utf8'),
  requestCert: false,
  rejectUnauthorized: false,
};
const httpsServer = https.createServer(options, app);

// eslint-disable-next-line no-console
server.listen(process.env.PORT, () => console.log(`API running on localhost:${process.env.PORT}`));
// eslint-disable-next-line no-console
httpsServer.listen(process.env.HTTPS_PORT, () => console.log(`API running on localhost:${process.env.HTTPS_PORT}`));
