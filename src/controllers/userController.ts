import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import filterObj from '../utils/filterObj';

// const multerStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, 'src/public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user?._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not an image. Please upload only images!',
        400
      ) as unknown as null,
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user?._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .withMetadata()
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`src/public/img/users/${req.file.filename}`);

  next();
};

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
      'lastName',
      'username',
      'email'
    );

    if (req.file) filteredBody.photo = req.file.filename;

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
