import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import filterObj from '../utils/filterObj';

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POST's password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use the /updateMyPassword route!',
          400
        )
      );
    }

    // 2) Update user document
    const filteredBody = filterObj(
      req.body,
      'firstName',
      'firstName',
      'username',
      'email',
      'photo'
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      filteredBody,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedUser = await User.findByIdAndDelete(req.user?._id);

    if (!deletedUser) {
      return next(new AppError('No user found with that ID!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
