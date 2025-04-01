import { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/frontend/public/cdnjs';

function PdfViewer() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [pdfs, setPdfs] = useState([]);

  // Fetch PDFs on component mount
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pdf/list');
        const pdfList = res.data;
        setPdfs(pdfList);
        if (pdfList.length > 0) {
          // Automatically load the first PDF
          const firstPdfUrl = `http://localhost:5000/api/pdf/stream/${pdfList[0].filename}`;
          console.log('Auto-loading PDF:', firstPdfUrl);
          setPdfUrl(firstPdfUrl);
        }
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setUploadStatus('Failed to load PDFs');
      }
    };
    fetchPdfs();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a PDF file first!');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    try {
      setUploadStatus('Uploading...');
      const res = await axios.post('http://localhost:5000/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const streamUrl = `http://localhost:5000/api/pdf/stream/${res.data.pdf.filename}`;
      setPdfUrl(streamUrl);
      setSelectedFile(null);
      setUploadStatus('Upload successful!');
      // Refresh PDF list
      const pdfListRes = await axios.get('http://localhost:5000/api/pdf/list');
      setPdfs(pdfListRes.data);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>PDF Viewer</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload PDF
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          style={{ width: '100%', height: '500px', marginTop: '20px' }}
        />
      )}
      {pdfs.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Stored PDFs</h3>
          <ul>
            {pdfs.map((pdf) => (
              <li key={pdf._id}>
                {pdf.filename}{' '}
                <button
                  onClick={() => setPdfUrl(`http://localhost:5000/api/pdf/stream/${pdf.filename}`)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PdfViewer;


