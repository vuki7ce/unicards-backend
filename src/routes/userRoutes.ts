import express from 'express';
import multer from 'multer';
import {
  signUp,
  logIn,
  protect,
  updatePassword,
} from '../controllers/authController';
import {
  uploadUserPhoto,
  updateMe,
  deleteMe,
  resizeUserPhoto,
} from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', protect, deleteMe);

export default router;
