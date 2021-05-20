import mongoose from 'mongoose';

async function createMongooseConnection(): Promise<mongoose.Connection> {
  const uri = process.env.DB_CONNECTION || '';
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(uri, options);
    return mongoose.connection;
  } catch (err) {
    console.error('connection error: ', err);
    return process.exit(1);
  }
}

export default createMongooseConnection;
