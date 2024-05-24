const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "static" directory
app.use(express.static(path.join(__dirname, 'static')));

mongoose.connect('mongodb+srv://admin:123@word-memorization.nw7tn7j.mongodb.net/?retryWrites=true&w=majority&appName=word-memorization');

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});

// Import routes
const authRoutes = require('./routes/auth');
const wordRoutes = require('./routes/words');
const quizRoutes = require('./routes/quiz');
const uploadRoutes = require('./routes/upload');

// Use routes
app.use('/auth', authRoutes);
app.use('/words', wordRoutes);
app.use('/quiz', quizRoutes);
app.use('/upload', uploadRoutes);

// database reset endpoint
app.get('/reset', async (req, res) => { 
  await mongoose.connection.dropDatabase();
  res.send('Database reset');
});

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
