
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const audioSchema = new Schema({
  filename: String,
  uploadDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Audio', audioSchema);
