/* eslint-disable no-console */
const mongoose = require('mongoose');

async function createMongooseConnection() {
  const uri = process.env.DB_CONNECTION;
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(uri, options);
    return mongoose.connection;
  } catch(err) {
    console.error('connection error: ', err);
    process.exit(1);
  }
}
module.exports = createMongooseConnection;
