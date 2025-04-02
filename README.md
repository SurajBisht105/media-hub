# Media Hub

Media Hub is a full-stack application that allows users to upload, view, and interact with various types of media, including videos, PDFs, audio recordings, and WebGL content. The project is built using a React frontend and an Express/MongoDB backend.

---

## Features

- **Frontend**: Built with React, Vite, and React Router for seamless navigation.
- **Backend**: Powered by Express.js and MongoDB for media storage and retrieval.
- **Media Support**:
  - Video playback
  - PDF viewing
  - Audio recording and playback
  - WebGL rendering
- **File Uploads**: Supports file uploads using Multer and GridFS for MongoDB.

---

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (v16 or higher recommended).
- **MongoDB**: A running MongoDB instance is required for storing media files.
- **Vite**: Used for the frontend development server.

---

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **AI**: Open AI

---

## Setup Instructions

### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/SurajBisht105/media-hub.git
cd media-hub
```

### 2. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables
   You’ll need to set up a `.env` file with the following variables:

```bash
MONGODB_URI=mongodb+srv://Suraj:suraj087@media.lvigpdn.mongodb.net/mediaHub?retryWrites=true&w=majority&appName=media
FRONTEND_URL=http://localhost:5173
PORT=5000
```

4. Run the application
   After setting up the environment variables, you can start the backend server:

```bash
npm start
```

### 3. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables
   You’ll need to set up a `.env` file with the following variables:

```bash
VITE_BACKEND_URL=http://localhost:5000
```

4. Start the frontend development server:

```bash
npm run dev
```

-> Ensure both the backend and frontend servers are running.
-> Open your browser and navigate to http://localhost:5173.

---

## Tech Stack

- **Frontend**:
  1.React
  2.Vite
  3.React Router
  4.Axios
  5.React-PDF
- **Backend**:
  1.Express.js
  2.MongoDB with GridFS
  3.Multer for file uploads

## Project Structure

media-hub/
├── backend/
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── server.js
│ ├── models/
│ │ ├── Audio.js
│ │ ├── Pdf.js
│ │ ├── Video.js
│ ├── routes/
│ │ ├── audio.js
│ │ ├── pdf.js
│ │ ├── video.js
│ │ ├── webgl.js
├── frontend/
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── vite.config.js
│ ├── public/
│ │ ├── vite.svg
│ │ ├── cdnjs/
│ │ │ ├── pdf.worker.min.js
│ │ ├── webgl/
│ │ ├── index.html
│ │ ├── Build/
│ │ ├── StreamingAssets/
│ │ ├── TemplateData/
│ ├── src/
│ ├── App.jsx
│ ├── main.jsx
│ ├── components/
│ │ ├── AudioRecorder.jsx
│ │ ├── PdfViewer.jsx
│ │ ├── VideoPlayer.jsx
│ │ ├── WebGlDisplay.jsx
│ │ ├── AudioReview.jsx
│ ├── services/
│ ├── api.js
