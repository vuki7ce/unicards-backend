import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A subject must have a name!'],
  },
  description: {
    type: String,
    trim: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A subject must belong to a user!'],
  },
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
