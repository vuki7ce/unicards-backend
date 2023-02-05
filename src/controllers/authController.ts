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
