// backend/models/Video.js
const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);