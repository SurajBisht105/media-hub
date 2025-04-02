
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const pdfSchema=new Schema({
  filename: String,
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pdf', pdfSchema);
