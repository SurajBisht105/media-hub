// backend/routes/pdf.js
const express = require('express');
const router = express.Router();
const Pdf = require('../models/Pdf');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const upload = multer({ storage: multer.memoryStorage() });

// Upload PDF
router.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No PDF file provided' });
  }
  const writeStream = req.gfs.openUploadStream(req.file.originalname);
  writeStream.write(req.file.buffer);
  writeStream.end();

  writeStream.on('finish', async () => {
    const pdf = new Pdf({ filename: req.file.originalname });
    await pdf.save();
    res.status(201).json({ message: 'PDF uploaded', pdf });
  });

  writeStream.on('error', (err) => {
    res.status(500).json({ message: 'Error uploading to GridFS', error: err.message });
  });
});

// Stream PDF
router.get('/stream/:filename', (req, res) => {
  const { filename } = req.params;
  console.log(`Streaming PDF: ${filename}`);
  const readStream = req.gfs.openDownloadStreamByName(filename);

  res.set('Content-Type', 'application/pdf');
  readStream.pipe(res);

  readStream.on('error', (err) => {
    console.error(`Stream error for ${filename}:`, err);
    res.status(404).json({ message: 'PDF not found' });
  });
});

// List PDFs
router.get('/list', async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ uploadDate: -1 });
    console.log('PDFs found:', pdfs);
    res.json(pdfs);
  } catch (err) {
    console.error('Error fetching PDF list:', err);
    res.status(500).json({ message: 'Error fetching PDFs', error: err.message });
  }
});

// Extract and download a specific page
router.get('/page/:filename/:pageNumber', async (req, res) => {
  const { filename, pageNumber } = req.params;
  console.log(`Extracting page ${pageNumber} from ${filename}`);

  try {
    const readStream = req.gfs.openDownloadStreamByName(filename);
    const chunks = [];
    readStream.on('data', (chunk) => chunks.push(chunk));
    readStream.on('error', () => res.status(404).json({ message: 'PDF not found' }));
    readStream.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      const pageNum = parseInt(pageNumber, 10);

      if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) {
        return res.status(400).json({ message: `Invalid page number. Must be between 1 and ${pageCount}` });
      }

      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
      newPdfDoc.addPage(copiedPage);

      const pdfBytes = await newPdfDoc.save();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}_page_${pageNum}.pdf"`,
        'Content-Length': pdfBytes.length,
      });
      res.send(Buffer.from(pdfBytes));
    });
  } catch (err) {
    console.error('Error extracting page:', err);
    res.status(500).json({ message: 'Error processing PDF', error: err.message });
  }
});

module.exports = router;