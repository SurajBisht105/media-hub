
const express = require('express');
const router = express.Router();
const Audio = require('../models/Audio');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file provided' });
  }
  const writeStream = req.gfs.openUploadStream(req.file.originalname);
  writeStream.write(req.file.buffer);
  writeStream.end();

  writeStream.on('finish', async () => {
    const audio = new Audio({ filename: req.file.originalname });
    await audio.save();
    res.status(201).json({ message: 'Audio uploaded', audio });
  });

  writeStream.on('error', (err) => {
    res.status(500).json({ message: 'Error uploading audio', error: err.message });
  });
});

router.get('/stream/:filename', (req, res) => {
  const { filename } = req.params;
  console.log(`Streaming audio: ${filename}`);
  const readStream = req.gfs.openDownloadStreamByName(filename);

  res.set('Content-Type', 'audio/mpeg');
  readStream.pipe(res);

  readStream.on('error', (err) => {
    console.error(`Stream error for ${filename}:`, err);
    res.status(404).json({ message: 'Audio not found' });
  });
});

router.get('/list', async (req, res) => {
  try {
    const audios = await Audio.find().sort({ uploadDate: -1 });
    console.log('Audios found:', audios);
    res.json(audios);
  } catch (err) {
    console.error('Error fetching audio list:', err);
    res.status(500).json({ message: 'Error fetching audios', error: err.message });
  }
});

router.delete('/delete/:filename', async (req, res) => {
  const { filename } = req.params;
  console.log(`Deleting audio: ${filename}`);

  try {
    const files = await req.gfs.find({ filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Audio file not found in GridFS' });
    }
    await req.gfs.delete(files[0]._id);

    const result = await Audio.deleteOne({ filename });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Audio metadata not found' });
    }

    res.json({ message: 'Audio deleted successfully' });
  } catch (err) {
    console.error('Error deleting audio:', err);
    res.status(500).json({ message: 'Error deleting audio', error: err.message });
  }
});

// New rename endpoint
router.put('/rename/:oldFilename', async (req, res) => {
  const { oldFilename } = req.params;
  const { newFilename } = req.body; // Expect new filename in request body
  console.log(`Renaming audio from ${oldFilename} to ${newFilename}`);

  if (!newFilename) {
    return res.status(400).json({ message: 'New filename is required' });
  }

  try {
    // Find the file in GridFS
    const files = await req.gfs.find({ filename: oldFilename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Audio file not found in GridFS' });
    }
    const fileId = files[0]._id;

    // Download the file content
    const readStream = req.gfs.openDownloadStreamByName(oldFilename);
    const chunks = [];
    readStream.on('data', (chunk) => chunks.push(chunk));
    readStream.on('error', () => res.status(404).json({ message: 'Error reading audio file' }));
    readStream.on('end', async () => {
      const audioBuffer = Buffer.concat(chunks);

      // Upload with new filename
      const writeStream = req.gfs.openUploadStream(newFilename);
      writeStream.write(audioBuffer);
      writeStream.end();

      writeStream.on('finish', async () => {
        // Delete the old file from GridFS
        await req.gfs.delete(fileId);

        // Update metadata in Audio collection
        const result = await Audio.updateOne(
          { filename: oldFilename },
          { $set: { filename: newFilename } }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Audio metadata not found' });
        }

        res.json({ message: 'Audio renamed successfully', newFilename });
      });

      writeStream.on('error', (err) => {
        console.error('Error uploading renamed audio:', err);
        res.status(500).json({ message: 'Error renaming audio in GridFS', error: err.message });
      });
    });
  } catch (err) {
    console.error('Error renaming audio:', err);
    res.status(500).json({ message: 'Error renaming audio', error: err.message });
  }
});

module.exports = router;
