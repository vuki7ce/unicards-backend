import { Request, Response, NextFunction } from 'express';
import Subject from '../models/subjectModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Create subject
export const createSubject = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newSubject = await Subject.create(req.body);

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
  async (_req: Request, res: Response, _next: NextFunction) => {
    const subjects = await Subject.find();

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
      return next(new AppError('No subject found with that ID', 404));
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
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subject) {
      return next(new AppError('No subject found with that ID', 404));
    }

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
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return next(new AppError('No subject found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
