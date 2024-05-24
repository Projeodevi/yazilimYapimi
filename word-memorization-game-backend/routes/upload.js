const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../static/images'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer for audio uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../static/audio'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadImage = multer({ storage: imageStorage });
const uploadAudio = multer({ storage: audioStorage });

// Endpoint for uploading images
router.post('/image', authMiddleware, uploadImage.single('image'), (req, res) => {
  res.send({ imageUrl: `/images/${req.file.filename}` });
});

// Endpoint for uploading audio
router.post('/audio', authMiddleware, uploadAudio.single('audio'), (req, res) => {
  res.send({ audioUrl: `/audio/${req.file.filename}` });
});

module.exports = router;
