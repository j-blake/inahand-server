import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Connection } from 'mongoose';
import e from 'express';

function initializeSessionMiddleware(
  mongooseConnection: Connection
): e.RequestHandler {
  return session({
    name: process.env.COOKIE_NAME,
    secret: process.env.CONNECT_MONGO_SECRET || '',
    store: MongoStore.create({ client: mongooseConnection.getClient() }),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      httpOnly: true,
      secure: 'auto',
      maxAge: 10 * 60 * 1000, // 10 minutes from now,
    },
  });
}

export default initializeSessionMiddleware;
