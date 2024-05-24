const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  englishWord: { type: String, required: true },
  turkishTranslation: { type: String, required: true },
  sentences: [String],
  imageUrl: String,
  audioUrl: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
