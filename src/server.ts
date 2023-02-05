import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err: Record<string, any>) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

import app from './app';

const DB = (process.env.DATABASE as string).replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD as string
);

mongoose.set('strictQuery', true);
mongoose.connect(DB).then(() => console.log('DB connection successfull'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err: Record<string, any>) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
