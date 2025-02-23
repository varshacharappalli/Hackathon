import 'bulma/css/bulma.css';
import React, { useState, useCallback } from 'react';
import { Upload, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    }
  }, []);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate an upload action
    setTimeout(() => {
      setIsUploading(false);
      alert('File uploaded successfully!');
    }, 2000);
  };

  const handleGeneratePortfolio = () => {
    if (file) {
      setIsUploading(true);
      // Simulate file processing before navigation
      setTimeout(() => {
        setIsUploading(false);
        navigate('/createportfolio');
      }, 1000);
    }
  };

  return (
    <div className="hero is-fullheight has-background-gradient">
      <div className="hero-body">
        <div className="container has-text-centered">
          {/* Header */}
          <h1 className="title has-text-white is-size-2 has-text-weight-bold mb-6">
            AI Resume Optimizer
          </h1>

          {/* Main Content */}
          <div className="box">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`dropzone ${isDragging ? 'is-active' : ''}`}
              style={{
                border: '2px dashed',
                borderColor: isDragging ? '#ffdd57' : '#ccc',
                padding: '2rem',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
                backgroundColor: file ? '#f5f5f5' : 'transparent',
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="file-input"
                id="file-upload"
                style={{ display: 'none' }}
                aria-label="Upload PDF Resume"
              />
              <label htmlFor="file-upload" className="file-label">
                <Upload className="icon is-large" style={{ color: '#ffdd57' }} />
                <p className="subtitle has-text-white">
                  {file ? file.name : 'Drag and drop your PDF resume here'}
                </p>
                <p className="has-text-grey">
                  {file ? 'Click to change file' : 'or click to upload'}
                </p>
              </label>
            </div>

            {/* Buttons */}
            <div className="buttons is-centered mt-4">
              <button
                className="button is-warning is-medium"
                disabled={!file || isUploading}
                onClick={handleUpload}
                aria-label="Check Resume Score"
              >
                {isUploading ? <Loader className="icon" /> : 'Check Score'}
                {isUploading && '...'}
              </button>
              <button
                className="button is-danger is-medium"
                disabled={!file || isUploading}
                onClick={handleGeneratePortfolio}
                aria-label="Generate Portfolio"
              >
                {isUploading ? <Loader className="icon" /> : 'Generate Portfolio'}
                {isUploading && '...'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6">
            <a href="#" className="has-text-grey-dark mr-4" aria-label="Privacy Policy">
              Privacy Policy
            </a>
            <a href="#" className="has-text-grey-dark mr-4" aria-label="Terms of Service">
              Terms of Service
            </a>
            <a href="#" className="has-text-grey-dark" aria-label="Contact">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
