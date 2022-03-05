import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import connectMongoose from './mongoose';
import sessionMiddleware from './middleware/session';
import routes from './routes';

const setupApp = async () => {
  const app = express();
  app.enable('trust proxy');
  app.use(
    cors({
      origin: ['http://localhost:3001'],
      credentials: true,
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
      ],
    })
  );
  app.use(helmet());
  app.use(sessionMiddleware(await connectMongoose()));

  app.use(morgan('dev'));

  // Parsers for POST data
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Point static path to dist
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use('/api', routes);

  // Catch all other routes and return the index file
  app.get('*', (_, res) =>
    res.sendFile(path.join(__dirname, 'dist/index.html'))
  );
  return app;
};

export default (): Promise<express.Express> => setupApp();
