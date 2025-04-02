require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const videoRoutes = require("./routes/video");
const audioRoutes = require("./routes/audio");
const pdfRoutes = require("./routes/pdf");
const webglRoutes = require("./routes/webgl");
const path = require("path");
const cors = require("cors");

const app = express();

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block unauthorized origins
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed headers
  optionsSuccessStatus: 204                             // Status for preflight requests
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Your routes and other middleware go here
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Media Hub Backend is running' });
});
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

let gfs;
mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
});

app.use((req, res, next) => {
  req.gfs = gfs;
  next();
});

app.use("/api/video", videoRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/webgl", webglRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
// mongodb+srv://Suraj:suraj087@media.lvigpdn.mongodb.net/mediaHub?retryWrites=true&w=majority&appName=media
