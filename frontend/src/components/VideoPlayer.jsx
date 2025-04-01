// src/components/VideoPlayer.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState([]); // List of videos
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fetch video list on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/video/list');
        console.log('Fetched videos:', res.data);
        setVideos(res.data);
        if (res.data.length > 0) {
          setVideoUrl(`http://localhost:5000/api/video/stream/${res.data[0].filename}`);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setUploadStatus('Failed to load video list');
      }
    };
    fetchVideos();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a video file first!');
      return;
    }
    const formData = new FormData();
    formData.append('video', selectedFile);
    try {
      setUploadStatus('Uploading...');
      const res = await axios.post('http://localhost:5000/api/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const streamUrl = `http://localhost:5000/api/video/stream/${res.data.video.filename}`;
      console.log('Setting video URL:', streamUrl);
      setVideoUrl(streamUrl);
      setSelectedFile(null);
      setUploadStatus('Upload successful!');
      // Refresh video list
      const listRes = await axios.get('http://localhost:5000/api/video/list');
      setVideos(listRes.data);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed');
    }
  };

  const handleVideoSelect = (filename) => {
    const streamUrl = `http://localhost:5000/api/video/stream/${filename}`;
    console.log('Selected video URL:', streamUrl);
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
      <div style={{ marginTop: '20px' }}>
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
        <div style={{ marginTop: '20px' }}>
          <video
            controls
            src={videoUrl}
            width="600"
            onError={(e) => console.error('Video playback error:', e)}
          />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;