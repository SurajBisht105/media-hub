// src/components/AudioRecorder.jsx
import { useState, useRef } from 'react';
import axios from 'axios';

function AudioRecorder() {
  // State to manage recording status and recorded audio
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Refs to manage MediaRecorder and audio chunks
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start recording audio
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data); // Collect audio data chunks
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordedAudio(null); // Clear any previous recording
        setSaveStatus('');
      })
      .catch(err => console.error('Error accessing microphone:', err));
  };

  // Stop recording audio and store it temporarily
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob); // Store audio temporarily
        chunksRef.current = []; // Clear chunks for next recording
      };
      setIsRecording(false);
    }
  };

  // Save the recorded audio to the database
  const saveAudio = async () => {
    if (!recordedAudio) {
      setSaveStatus('No audio to save');
      return;
    }

    const formData = new FormData();
    formData.append('audio', recordedAudio, 'recording.webm');

    try {
      setSaveStatus('Saving...');
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Ensure this is set in your .env file
      await axios.post(`${BACKEND_URL}/api/audio/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSaveStatus('Audio saved successfully!');
      setRecordedAudio(null); // Clear after successful save
    } catch (err) {
      console.error('Error saving audio:', err);
      setSaveStatus('Failed to save audio');
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      {/* Start Recording Button */}
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      {/* Stop Recording Button */}
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {/* Preview and Save Audio Section */}
      {recordedAudio && (
        <div>
          <audio controls src={URL.createObjectURL(recordedAudio)} />
          <button onClick={saveAudio}>
            Save Audio
          </button>
        </div>
      )}
      {/* Save Status Feedback */}
      {saveStatus && <p>{saveStatus}</p>}
    </div>
  );
}

export default AudioRecorder;
