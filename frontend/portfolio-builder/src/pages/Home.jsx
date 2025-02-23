import 'bulma/css/bulma.css';
import React, { useState, useCallback } from 'react';
import { Upload, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styling/Home.css';

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
    setTimeout(() => {
      setIsUploading(false);
      alert('File uploaded successfully!');
    }, 2000);
  };

  const handleGeneratePortfolio = () => {
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        navigate('/createportfolio');
      }, 1000);
    }
  };

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          {/* Header */}
          <h1 className="title">AI Resume Optimizer</h1>

          {/* Main Content */}
          <div className="box">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`dropzone ${isDragging ? 'is-active' : ''}`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="file-input"
                id="file-upload"
                aria-label="Upload PDF Resume"
              />
              <label htmlFor="file-upload" className="file-label">
                <Upload className="icon" />
                <p className="subtitle">
                  {file ? file.name : 'Drag and drop your PDF resume here'}
                </p>
                <p className="has-text-grey">
                  {file ? 'Click to change file' : 'or click to upload'}
                </p>
              </label>
            </div>

            {/* Buttons */}
            <div className="buttons">
              <button
                className="button is-warning"
                disabled={!file || isUploading}
                onClick={handleUpload}
                aria-label="Check Resume Score"
              >
                {isUploading ? <Loader className="icon" /> : 'Check Score'}
                {isUploading && '...'}
              </button>
              <button
                className="button is-danger"
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
            <a href="#" className="footer-link" aria-label="Privacy Policy">
              Privacy Policy
            </a>
            <a href="#" className="footer-link" aria-label="Terms of Service">
              Terms of Service
            </a>
            <a href="#" className="footer-link" aria-label="Contact">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

