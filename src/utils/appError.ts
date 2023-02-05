class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // When a new object is created and the constructor is called,
    // then that function call is not gonna appear in that stack trace,
    // and will not pollute it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
