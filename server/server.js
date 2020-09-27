import app from './express';
import config from '../config/config';
import mongoose from 'mongoose';

// Connection URL
mongoose.Promise = global.Promise;

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});

app.listen(config.port, error => {
  if (error) {
    console.error(`An error occurred: ${error}`);
  } else {
    console.log(`Server started on port ${config.port}`);
  }
})
