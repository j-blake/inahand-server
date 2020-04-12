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
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const api = require('./routes');

function createMongooseConnection() {
  const uri = process.env.DB_CONNECTION;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  return mongoose.connection;
}

function createExpressApp() {
  const expressApp = express();
  expressApp.use(cors({
    origin: ['http://localhost:3001'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  }));
  expressApp.use(helmet());
  expressApp.use(session({
    name: process.env.COOKIE_NAME,
    secret: process.env.CONNECT_MONGO_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 1000, // 10 minutes from now,
      signed: true,
    },
  }));
  const swaggerDocument = YAML.load('server/swagger.yaml');
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  expressApp.use(morgan('dev'));

  // Parsers for POST data
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(cookieParser(process.env.COOKIE_SECRET));

  // Point static path to dist
  expressApp.use(express.static(path.join(__dirname, 'dist')));
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
// https://docs.microsoft.com/en-us/azure/application-gateway/self-signed-certificates
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
