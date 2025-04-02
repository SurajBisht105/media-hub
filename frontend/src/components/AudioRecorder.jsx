
import { useState } from "react";
import axios from "axios";

// Dynamically load the backend URL from the environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/mpeg" });
      const formData = new FormData();
      formData.append("audio", blob, "recording.mp3");
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/audio/upload`,
          formData
        ); // Use BACKEND_URL
        setAudioUrl(
          `${BACKEND_URL}/api/audio/stream/${res.data.audio.filename}`
        ); // Use BACKEND_URL
      } catch (error) {
        console.error("Error uploading recording:", error);
        alert("Failed to upload recording");
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an audio file first!");
      return;
    }
    const formData = new FormData();
    formData.append("audio", selectedFile);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/audio/upload`, formData); // Use BACKEND_URL
      setAudioUrl(`${BACKEND_URL}/api/audio/stream/${res.data.audio.filename}`); // Use BACKEND_URL
      setSelectedFile(null); // Clear the selected file after upload
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio");
    }
  };

  return (
    <div>
      <h1>Audio Recording</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
      </div>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload Audio
        </button>
      </div>
      {audioUrl && (
        <audio controls style={{ marginTop: "20px" }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}
    </div>
  );
}

export default AudioRecorder;
