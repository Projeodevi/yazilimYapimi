const express = require('express');
const User = require('../models/user');
const Quiz = require('../models/quiz');
const Word = require('../models/word');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({message: 'Username and password are required'});
  }
  if (await User.findOne({ username })) {
    return res.status(400).send({message: 'User already exists'});
  }
  const user = new User({ username, password });
  await user.save();
  
  // Create initial quizzes for each word in the database
  const words = await Word.find();
  // get random 10 words
  const randomWords = words.sort(() => 0.5 - Math.random()).slice(0, 10);
  for (const word of randomWords) {
    await Quiz.create({ user: user._id, word: word._id });
  }

  res.send({ token: user.generateAuthToken(), message: 'User created successfully'});
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.comparePassword(password)) {
    res.send({ token: user.generateAuthToken() });
  } else {
    res.status(400).send({message: 'Invalid credentials'});
  }
});

router.post('/forgot-password', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    user.password = password;
    await user.save();
    res.send({message: 'Password updated'});
  } else {
    res.status(404).send({message: 'User not found'});
  }
});

module.exports = router;
