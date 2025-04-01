// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const videoRoutes = require('./routes/video');
const audioRoutes = require('./routes/audio');
const pdfRoutes = require('./routes/pdf');
const webglRoutes = require('./routes/webgl');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://Suraj:suraj087@media.lvigpdn.mongodb.net/mediaHub?retryWrites=true&w=majority&appName=media', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

app.use((req, res, next) => {
  req.gfs = gfs;
  next();
});

app.use('/api/video', videoRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/pdf', pdfRoutes); // Ensure this line exists
app.use('/api/webgl', webglRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongodb+srv://Suraj:suraj087@media.lvigpdn.mongodb.net/mediaHub?retryWrites=true&w=majority&appName=media
