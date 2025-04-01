// backend/routes/video.js
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video file provided' });
  }
  const writeStream = req.gfs.openUploadStream(req.file.originalname);
  writeStream.write(req.file.buffer);
  writeStream.end();

  writeStream.on('finish', async () => {
    const video = new Video({ filename: req.file.originalname });
    await video.save();
    res.status(201).json({ message: 'Video uploaded', video });
  });

  writeStream.on('error', (err) => {
    res.status(500).json({ message: 'Error uploading video', error: err.message });
  });
});

router.get('/stream/:filename', (req, res) => {
  const { filename } = req.params;
  console.log(`Streaming video: ${filename}`);
  const readStream = req.gfs.openDownloadStreamByName(filename);

  res.set('Content-Type', 'video/mp4'); // Adjust based on file type
  readStream.pipe(res);

  readStream.on('error', (err) => {
    console.error(`Stream error for ${filename}:`, err);
    res.status(404).json({ message: 'Video not found' });
  });
});

router.get('/list', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    console.log('Videos found:', videos);
    res.json(videos);
  } catch (err) {
    console.error('Error fetching video list:', err);
    res.status(500).json({ message: 'Error fetching videos', error: err.message });
  }
});

module.exports = router;