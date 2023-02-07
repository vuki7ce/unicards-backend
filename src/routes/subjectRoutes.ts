import express from 'express';
import {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController';
import { protect, restrictTo } from '../controllers/authController';

const router = express.Router();

router.route('/').post(createSubject).get(protect, getAllSubjects);

router
  .route('/:id')
  .get(getSubject)
  .patch(updateSubject)
  .delete(protect, restrictTo('admin'), deleteSubject);

export default router;
