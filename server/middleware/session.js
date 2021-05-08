const session = require('express-session');
const connectMongo = require('connect-mongo');

const MongoStore = connectMongo(session);
function initializeSessionMiddleware(mongooseConnection) {
  return session({
    name: process.env.COOKIE_NAME,
    secret: process.env.CONNECT_MONGO_SECRET,
    store: new MongoStore({ mongooseConnection }),
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
  });
}
module.exports = initializeSessionMiddleware;
