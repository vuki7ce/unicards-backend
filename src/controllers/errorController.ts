import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const handleCastErrorDB = (err: Record<string, any>) => {
  const message = `Invalid ${err.path}: ${err.value}!`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: Record<string, any>) => {
  const field = Object.getOwnPropertyNames(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate ${field} value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: Record<string, any>) => {
  const errors = Object.values(err.errors as Record<string, any>).map(
    el => el.message
  );
  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: Record<string, any>, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: Record<string, any>, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export default (
  err: Record<string, any>,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
      name: err.name,
      code: err.code,
      keyValue: err.keyValue as Record<string, any>,
    } as Record<string, any>;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
