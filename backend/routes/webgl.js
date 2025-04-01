// backend/routes/webgl.js
const express = require('express');
const router = express.Router();

router.get('/sample', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/webgl/index.html'));
});

module.exports = router;