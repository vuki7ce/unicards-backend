import express from 'express';
import {
  signUp,
  logIn,
  protect,
  updatePassword,
} from '../controllers/authController';
import { updateMe, deleteMe } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

export default router;
