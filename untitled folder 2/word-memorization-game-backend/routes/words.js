const express = require('express');
const Word = require('../models/word');
const Quiz = require('../models/quiz');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const words = await Word.find();
  res.send(words);
});

router.post('/', authMiddleware, async (req, res) => {
  const { englishWord, turkishTranslation, sentences, imageUrl, audioUrl } = req.body;
  const word = new Word({
    englishWord,
    turkishTranslation,
    sentences,
    imageUrl,
    audioUrl,
    addedBy: req.user._id,
  });
  await word.save();


  res.send({word, message: 'Word added successfully'});
});

module.exports = router;
