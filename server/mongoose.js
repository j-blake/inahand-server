/* eslint-disable no-console */
const mongoose = require('mongoose');

function createMongooseConnection() {
  const uri = process.env.DB_CONNECTION;
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  mongoose.connect(uri, options).then(
    () => console.log('successful database connection'),
    err => console.error('connection error: ', err),
  );
  return mongoose.connection;
}
module.exports = createMongooseConnection;
