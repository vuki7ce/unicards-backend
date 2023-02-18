import { Request, Response, NextFunction } from 'express';
import Subject from '../models/subjectModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import filterObj from '../utils/filterObj';
import { Types } from 'mongoose';

// Create subject
export const createSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filteredBody = filterObj(
      req.body,
      'name',
      'description',
      'isPrivate',
      'user'
    );

    if (
      filteredBody.user &&
      filteredBody.user !== req.currentUser?._id.toString() &&
      req.currentUser?.role !== 'admin'
    ) {
      return next(
        new AppError(
          'You do not have the permission to perform this action!',
          403
        )
      );
    }

    if (!filteredBody.user) {
      filteredBody.user = req.currentUser?._id;
    }

    const newSubject = await Subject.create(filteredBody);

    res.status(201).json({
      status: 'success',
      data: {
        subject: newSubject,
      },
    });
  }
);

// Get all subjects
export const getAllSubjects = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // If user is not an admin, he can only get public subjects
    let filter = {
      $or: [
        { isPrivate: false, user: { $ne: req.currentUser?._id } },
        { user: req.currentUser?._id },
      ],
    } as any;
    if (req.currentUser?.role === 'admin') filter = {};

    const apiFeatures = new APIFeatures(Subject.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const subjects = await apiFeatures.query;

    res.status(200).json({
      status: 'success',
      results: subjects.length,
      data: {
        subjects,
      },
    });
  }
);

// Get subject
export const getSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return next(new AppError('No subject found with that ID!', 404));
    }

    if (
      req.currentUser?.role !== 'admin' &&
      !subject.user.equals(req.currentUser?._id as Types.ObjectId) &&
      subject.isPrivate
    ) {
      return next(
        new AppError(
          'You do not have the permission to perform this action!',
          403
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        subject,
      },
    });
  }
);

// Update subject
export const updateSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filteredBody = filterObj(
      req.body,
      'name',
      'description',
      'isPrivate',
      'user'
    );

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return next(new AppError('No subject found with that ID!', 404));
    }

    if (
      (req.currentUser?.role !== 'admin' &&
        !subject.user.equals(req.currentUser?._id as Types.ObjectId)) ||
      (filteredBody.user && req.currentUser?.role !== 'admin')
    ) {
      return next(
        new AppError(
          'You do not have the permission to perform this action!',
          403
        )
      );
    }

    subject.name = filteredBody.name ?? subject.name;
    subject.description = filteredBody.description ?? subject.description;
    subject.isPrivate = filteredBody.isPrivate ?? subject.isPrivate;
    subject.user = filteredBody.user ?? subject.user;

    res.status(200).json({
      status: 'success',
      data: {
        subject,
      },
    });
  }
);

// Delete subject
export const deleteSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return next(new AppError('No subject found with that ID!', 404));
    }

    if (
      req.currentUser?.role !== 'admin' &&
      !subject.user.equals(req.currentUser?._id as Types.ObjectId)
    ) {
      return next(
        new AppError(
          'You do not have the permission to perform this action!',
          403
        )
      );
    }

    await subject.delete();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
