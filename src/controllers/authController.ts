import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const signToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const logIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    // 1.) Check if email and password exist
    if ((!email && !username) || !password) {
      return next(
        new AppError(`Please provide email or username and password!`, 400)
      );
    }

    // 2.) Check if user exists && password is correct
    const user = await User.findOne({ $or: [{ email }, { username }] }).select(
      '+password'
    );

    if (!user || !(await user.correctPassword(password, user?.password))) {
      return next(
        new AppError('Incorrect email or username or password!', 401)
      );
    }

    // 3.) If everything ok, send token to client
    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      return next(
        new AppError('You are not logged in! Please log in to get access!', 401)
      );

    // 2) Validate token
    const decoded = (await promisify<string, jwt.Secret>(jwt.verify)(
      token,
      process.env.JWT_SECRET as string
    )) as unknown as { id: string; iat: number; exp: number };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist!',
          401
        )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password. Please log in again!',
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
);
