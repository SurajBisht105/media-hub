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

// Use CORS to allow requests from the frontend
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// Root route to confirm server is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Media Hub Backend is running" });
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

// mongodb+srv://Suraj:suraj087@media.lvigpdn.mongodb.net/mediaHub?retryWrites=true&w=majority&appName=media
