import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    required: [true, 'A flashcard must have a question!'],
  },
  answer: {
    type: String,
    trim: true,
    required: [true, 'A flashcard must have an answer!'],
  },
  status: {
    type: String,
    enum: ['not-started', 'learning', 'mastered'],
    default: 'not-started',
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'A flashcard must belong to a subject!'],
  },
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;
