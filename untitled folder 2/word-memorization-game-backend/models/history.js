const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    word: { type: mongoose.Schema.Types.ObjectId, ref: 'Word' },
    date: { type: Date, default: Date.now },
    correct: { type: Boolean, required: true },
});

const History = mongoose.model('History', historySchema);

module.exports = History;