import express, { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import userRouter from './routes/userRoutes';
import subjectRouter from './routes/subjectRoutes';

const app: Express = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(
  cors({
    credentials: true,
    origin: 'http://127.0.0.1:9000',
    exposedHeaders: ['set-cookie'],
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/subjects', subjectRouter);

app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
