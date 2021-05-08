const session = require('express-session');
const MongoStore = require('connect-mongo');

function initializeSessionMiddleware(mongooseConnection) {
  return session({
    name: process.env.COOKIE_NAME,
    secret: process.env.CONNECT_MONGO_SECRET,
    store: MongoStore.create({ client: mongooseConnection.getClient() }),
    resave: true,
    rolling: true,
    saveUninitialized: false,
    unset: 'destroy',
    proxy:true,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 1000, // 10 minutes from now,
      signed: true,
    },
  });
}
module.exports = initializeSessionMiddleware;
