// src/components/WebGlDisplay.jsx
import { useState } from 'react';

function WebGlDisplay() {
  const [error, setError] = useState('');

  // URL relative to the frontend's public folder
  const webglUrl = '/webgl/index.html';

  return (
    <div>
      <h1>WebGL Display</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <iframe
        src={webglUrl}
        width="100%"
        height="600px"
        title="WebGL Player"
        style={{ border: 'none' }}
        onError={(e) => {
          console.error('Iframe load error:', e);
          setError('Failed to load WebGL content');
        }}
      />
    </div>
  );
}

export default WebGlDisplay;