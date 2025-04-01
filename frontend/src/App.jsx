// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import VideoPlayer from './components/VideoPlayer';
import PdfViewer from './components/PdfViewer';
import AudioRecorder from './components/AudioRecorder';
import WebGlDisplay from './components/WebGlDisplay';
import AudioReview from './components/AudioReview';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <SideMenu />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/video" element={<VideoPlayer />} />
          <Route path="/pdf" element={<PdfViewer />} />
          <Route path="/audio" element={<AudioRecorder />} />
          <Route path="/webgl" element={<WebGlDisplay />} />
          <Route path="/audio-review" element={<AudioReview />} />
          <Route path="/" element={<h1>Welcome to Media Hub</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;