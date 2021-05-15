// Get dependencies
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import appInit from './server/app';

appInit().then((app) => {
  const httpsServer = http.createServer(app);
  httpsServer.listen(process.env.PORT);
});
