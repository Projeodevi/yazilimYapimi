const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  word: { type: mongoose.Schema.Types.ObjectId, ref: 'Word' },
  correctAnswers: { type: Number, default: 0 },
  nextTestDate: { type: Date, default: Date.now },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
