const express = require('express');
const Quiz = require('../models/quiz');
const Word = require('../models/word');
const History = require('../models/history');
const User = require('../models/user');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const quizzes = await Quiz.find();
  res.send(quizzes);
});

router.get('/start', authMiddleware, async (req, res) => {
  let quizzes = await Quiz.find({ user: req.user._id, nextTestDate: { $lte: Date.now() } }).populate('word');
  
  if (quizzes.length < req.user.wordCount) {

    const allUserQuizzes = await Quiz.find({ user: req.user._id }).populate('word');
    const allUserWords = allUserQuizzes.map(quiz => quiz.word._id);
    let count = req.user.wordCount - quizzes.length;
    const allWords = await Word.find({ _id: { $nin: allUserWords } });
    const randomWords = allWords.sort(() => 0.5 - Math.random()).slice(0, count);
    for (const word of randomWords) {
      await Quiz.create({ user: req.user._id, word: word._id });
    }
    quizzes = await Quiz.find({ user: req.user._id, nextTestDate: { $lte: Date.now() } }).populate('word');
    
  }
  res.send(quizzes); 
});

router.post('/answer', authMiddleware, async (req, res) => {
  const { quizId, answer } = req.body;
  const quiz = await Quiz.findById(quizId).populate('word');
  if (!quiz) return res.status(404).send({message: 'Quiz not found'});

  const correct = quiz.word.turkishTranslation.toLowerCase() === answer.toLowerCase();

  if (correct) {
    quiz.correctAnswers += 1;
    if (quiz.correctAnswers >= 6) {
      quiz.nextTestDate = null;
    } else {
      const intervals = [1, 7, 30, 90, 180, 365];
      quiz.nextTestDate = new Date(Date.now() + intervals[quiz.correctAnswers - 1] * 24 * 60 * 60 * 1000);
    }
  } else {
    quiz.correctAnswers = 0;
    quiz.nextTestDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  const history = new History({
    user: req.user._id,
    word: quiz.word._id,
    correct,
  });
  await history.save();

  await quiz.save();
  message = correct ? 'Correct answer!' : 'Incorrect answer!';
  res.send({ correct, message });
});

router.get('/analyze', authMiddleware, async (req, res) => {
  const history = await History.find({ user: req.user._id }).populate('word');
  const dayByDay = await History.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, correct: { $sum: { $cond: { if: '$correct', then: 1, else: 0 } } } } },
    { $sort: { _id: 1 } }
  ]);
  const correct = history.filter(h => h.correct).length;
  const total = history.length;
  const accuracy = total === 0 ? 0 : correct / total;
  const totalQuizFinished = await Quiz.find({ user: req.user._id, correctAnswers: { $gte: 6 } }).countDocuments();
  res.send({ correct, total, accuracy, dayByDay, totalQuizFinished});
});

router.post('/word-count', authMiddleware, async (req, res) => {
  const { wordCount } = req.body;
  if (wordCount < 1 || wordCount > 50) {
    return res.status(400).send({ message: 'Word count must be between 1 and 50' });
  }
  const user = await User.findById(req.user._id);
  user.wordCount = wordCount;
  
  await user.save();
  res.send({ message: 'Word count updated successfully' });
});

router.get('/word-count', authMiddleware, async (req, res) => {
  res.send({ wordCount: req.user.wordCount });
});

module.exports = router;
