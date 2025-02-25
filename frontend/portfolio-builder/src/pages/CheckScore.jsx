import React, { useState, useCallback } from 'react';
import { Upload, Loader } from 'lucide-react';
import '../styling/CheckScore.css';

const CheckScore = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [resumeData, setResumeData] = useState(null);

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
      // Get available file information
      setFileInfo({
        name: droppedFile.name,
        type: droppedFile.type,
        size: droppedFile.size,
        lastModified: new Date(droppedFile.lastModified).toLocaleString()
      });
      setError(null);
    } else if (droppedFile) {
      setError('Please upload a PDF file only');
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      // Get available file information
      setFileInfo({
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        lastModified: new Date(selectedFile.lastModified).toLocaleString()
      });
      setError(null);
    } else if (selectedFile) {
      setError('Please upload a PDF file only');
    }
  }, []);

  const uploadFile = async () => {
    if (!file) {
      setError('Please upload a resume first');
      return null;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add file metadata to formData if available
      if (fileInfo) {
        formData.append('file_name', fileInfo.name);
        formData.append('file_size', fileInfo.size.toString());
        formData.append('file_type', fileInfo.type);
        formData.append('file_last_modified', fileInfo.lastModified);
      }
      
      const response = await fetch('http://127.0.0.1:8000/extract', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload resume');
      }
      
      const data = await response.json();
      setIsUploading(false);
      setResumeData(data); // Store resume data in state
      localStorage.setItem('resumeData', JSON.stringify(data));
      localStorage.setItem('fileInfo', JSON.stringify(fileInfo));
      return data;
    } catch (err) {
      setIsUploading(false);
      setError(err.message || 'Failed to upload resume');
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    let resumeDataToUse = resumeData;
    
    // If no resume data in state, try to upload file first
    if (!resumeDataToUse) {
      if (!file) {
        setError('Please upload a resume first');
        return;
      }
      
      resumeDataToUse = await uploadFile();
      if (!resumeDataToUse) return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_description: jobDescription,
          resume_data: resumeDataToUse
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      setResult(data);
    } catch (error) {
      console.error('Error matching resume:', error);
      setError(error.message || 'Failed to match resume with job description');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillsList = (skills = []) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return <p className="text-gray-500 italic">None found</p>;
    }
    
    return (
      <ul className="list-disc pl-4">
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="border rounded-md shadow-md">
        <div className="bg-gray-200 p-4">
          <h2 className="text-xl font-bold">Resume Match Checker</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* File upload section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  aria-label="Upload PDF Resume"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-lg">
                    {file ? file.name : 'Drag and drop your PDF resume here'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {file ? 'Click to change file' : 'or click to upload'}
                  </p>
                </label>
              </div>
            </div>

            {/* Display file information when available */}
            {fileInfo && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-4">
                <p><strong>File:</strong> {fileInfo.name}</p>
                <p><strong>Size:</strong> {Math.round(fileInfo.size / 1024)} KB</p>
                <p><strong>Last Modified:</strong> {fileInfo.lastModified}</p>
              </div>
            )}

            {/* Resume upload button */}
            {file && !resumeData && (
              <button 
                className={`px-4 py-2 rounded-md ${isUploading ? 'bg-gray-400' : 'bg-green-500'} text-white mb-4`}
                onClick={uploadFile} 
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin mr-2" size={16} />
                    Uploading Resume...
                  </span>
                ) : 'Upload Resume'}
              </button>
            )}

            {/* Confirmation of successful resume upload */}
            {resumeData && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-md mb-4">
                <p className="text-green-700">
                  <strong>Resume uploaded successfully!</strong>
                </p>
                <p>Name: {resumeData.name || 'Not detected'}</p>
                <p>Skills: {resumeData.skills?.length || 0} detected</p>
              </div>
            )}

            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Enter job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="5"
            />
            
            <button 
              className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
              onClick={handleSubmit} 
              disabled={loading || !jobDescription.trim()}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader className="animate-spin mr-2" size={16} />
                  Processing Match...
                </span>
              ) : 'Check Match'}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
                <p>{error}</p>
              </div>
            )}

            {result?.match_results && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-xl font-bold">
                    Overall Match Score: {result.match_results.overall_score}%
                  </h3>
                  <div className="mt-2">
                    <p>Skills Match: {result.match_results.score_breakdown?.skills_match?.score ?? 0}% (Weight: {result.match_results.score_breakdown?.skills_match?.weight ?? '40%'})</p>
                    <p>Achievement Match: {result.match_results.score_breakdown?.achievement_match?.score ?? 0}% (Weight: {result.match_results.score_breakdown?.achievement_match?.weight ?? '60%'})</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">Skills Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-green-50 p-3 rounded-md">
                      <h5 className="font-semibold text-green-600">Matching Skills</h5>
                      {renderSkillsList(result.match_results.skills_analysis?.matching_skills)}
                    </div>
                    <div className="bg-red-50 p-3 rounded-md">
                      <h5 className="font-semibold text-red-600">Missing Skills</h5>
                      {renderSkillsList(result.match_results.skills_analysis?.missing_skills)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">Achievement Analysis</h4>
                  <p className="mt-2">{result.match_results.achievement_analysis?.summary}</p>
                  <div className="mt-2">
                    <h5 className="font-semibold text-green-600">Key Matches</h5>
                    {renderSkillsList(result.match_results.achievement_analysis?.key_matches)}
                  </div>
                  <div className="mt-2">
                    <h5 className="font-semibold text-amber-600">Growth Areas</h5>
                    {renderSkillsList(result.match_results.achievement_analysis?.growth_areas)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckScore;