const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const connectMongoose = require('./mongoose');
const sessionMiddleware = require('./middleware/session');
const routes = require('./routes');

const app = express();
const init = async () => {
  app.use(cors({
    origin: ['http://localhost:3001'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  }));
  app.use(helmet());
  app.use(sessionMiddleware(await connectMongoose()));

  const swaggerDocument = YAML.load('server/swagger.yaml');
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  app.use(morgan('dev'));

  // Parsers for POST data
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Point static path to dist
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use('/api', routes);

  // Catch all other routes and return the index file
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

};
init();
module.exports = app;
