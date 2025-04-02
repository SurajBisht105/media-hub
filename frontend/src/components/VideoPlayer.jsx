
import { useState, useEffect } from "react";
import axios from "axios";

// Dynamically load the backend URL from the environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState([]); // List of videos
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Fetch video list on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/video/list`); // Use BACKEND_URL
        console.log("Fetched videos:", res.data);
        setVideos(res.data);
        if (res.data.length > 0) {
          setVideoUrl(
            `${BACKEND_URL}/api/video/stream/${res.data[0].filename}`
          ); // Use BACKEND_URL
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setUploadStatus("Failed to load video list");
      }
    };
    fetchVideos();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a video file first!");
      return;
    }
    const formData = new FormData();
    formData.append("video", selectedFile);
    try {
      setUploadStatus("Uploading...");
      const res = await axios.post(
        `${BACKEND_URL}/api/video/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      ); // Use BACKEND_URL
      const streamUrl = `${BACKEND_URL}/api/video/stream/${res.data.video.filename}`; // Use BACKEND_URL
      console.log("Setting video URL:", streamUrl);
      setVideoUrl(streamUrl);
      setSelectedFile(null);
      setUploadStatus("Upload successful!");
      // Refresh video list
      const listRes = await axios.get(`${BACKEND_URL}/api/video/list`); // Use BACKEND_URL
      setVideos(listRes.data);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed");
    }
  };

  const handleVideoSelect = (filename) => {
    const streamUrl = `${BACKEND_URL}/api/video/stream/${filename}`; // Use BACKEND_URL
    console.log("Selected video URL:", streamUrl);
    setVideoUrl(streamUrl);
  };

  return (
    <div>
      <h1>Video Player</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload Video
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
      <div style={{ marginTop: "20px" }}>
        <h2>Video List</h2>
        <ul>
          {videos.map((video) => (
            <li key={video._id}>
              <button onClick={() => handleVideoSelect(video.filename)}>
                {video.filename}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <video
            controls
            src={videoUrl}
            width="600"
            onError={(e) => console.error("Video playback error:", e)}
          />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
