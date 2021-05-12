// Get dependencies
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import appInit from './server/app';

appInit().then((app) => {
  const httpsServer = http.createServer(app);
  console.log('listening...', process.env.PORT);
  httpsServer.listen(process.env.PORT);
});
