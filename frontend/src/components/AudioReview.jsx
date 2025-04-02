// src/components/AudioReview.jsx
import { useState, useEffect } from "react";
import axios from "axios";

// Dynamically load the backend URL from the environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AudioReview() {
  const [audioList, setAudioList] = useState([]);
  const [error, setError] = useState("");
  const [renameInput, setRenameInput] = useState({}); // Track rename inputs for each audio

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/audio/list`); // Use BACKEND_URL
      console.log("Fetched audio list:", res.data);
      setAudioList(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching audio list:", err);
      setError("Failed to load audio list");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/audio/delete/${filename}`
      ); // Use BACKEND_URL
      console.log(res.data.message);
      await fetchAudioList();
    } catch (err) {
      console.error("Error deleting audio:", err.response?.data || err.message);
      setError(
        `Failed to delete ${filename}: ${
          err.response?.data.message || err.message
        }`
      );
    }
  };

  const handleRenameChange = (filename, value) => {
    setRenameInput((prev) => ({ ...prev, [filename]: value }));
  };

  const handleRename = async (oldFilename) => {
    const newFilename = renameInput[oldFilename];
    if (!newFilename) {
      setError("Please enter a new filename");
      return;
    }

    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/audio/rename/${oldFilename}`, // Use BACKEND_URL
        { newFilename },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res.data.message);
      setRenameInput((prev) => ({ ...prev, [oldFilename]: "" })); // Clear input
      await fetchAudioList(); // Refresh list
    } catch (err) {
      console.error("Error renaming audio:", err.response?.data || err.message);
      setError(
        `Failed to rename ${oldFilename}: ${
          err.response?.data.message || err.message
        }`
      );
    }
  };

  return (
    <div>
      <h1>Audio Review</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {audioList.map((audio) => (
          <li key={audio._id} style={{ marginBottom: "10px" }}>
            <span>{audio.filename}</span>
            <audio
              controls
              src={`${BACKEND_URL}/api/audio/stream/${audio.filename}`} // Use BACKEND_URL
              style={{ marginLeft: "10px" }}
            />
            <button
              onClick={() => handleDelete(audio.filename)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
            <div style={{ marginTop: "5px" }}>
              <input
                type="text"
                value={renameInput[audio.filename] || ""}
                onChange={(e) =>
                  handleRenameChange(audio.filename, e.target.value)
                }
                placeholder="Enter new filename"
                style={{ marginRight: "10px" }}
              />
              <button onClick={() => handleRename(audio.filename)}>
                Rename
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AudioReview;
