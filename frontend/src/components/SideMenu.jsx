// src/components/SideMenu.jsx
import { NavLink } from 'react-router-dom';

function SideMenu() {
  return (
    <div style={{ width: '200px', background: '#f4f4f4', padding: '20px' }}>
      <h2>Media Hub</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><NavLink to="/video">Video Streaming</NavLink></li>
        <li><NavLink to="/pdf">PDF Viewer</NavLink></li>
        <li><NavLink to="/audio">Audio Recording</NavLink></li>
        <li><NavLink to="/webgl">WebGL Display</NavLink></li>
        <li><NavLink to="/audio-review">Audio Review</NavLink></li>
      </ul>
    </div>
  );
}

export default SideMenu;