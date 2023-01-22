import express from 'express';
import {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController';

const router = express.Router();

router.route('/').post(createSubject).get(getAllSubjects);

router.route('/:id').get(getSubject).patch(updateSubject).delete(deleteSubject);

export default router;
