import express from 'express';
import multer from 'multer';
import {
  signUp,
  logIn,
  logOut,
  protect,
  updatePassword,
  restrictTo,
} from '../controllers/authController';
import {
  uploadUserPhoto,
  updateMe,
  deleteMe,
  getMe,
  resizeUserPhoto,
} from '../controllers/userController';
import subjectRouter from './subjectRoutes';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/logout', logOut);

router.get('/me', protect, getMe);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', protect, deleteMe);

export default router;
