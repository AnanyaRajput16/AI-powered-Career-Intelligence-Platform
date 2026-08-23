import React, { useState, useRef, useEffect } from 'react';
import api from '../api/index';
import { useAuth } from '../context/AuthContext';



const ResumeAnalyzer = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  // Drag and Drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Click file select handler
  const handleFileSelect = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Check extensions
  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['pdf', 'docx'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Unsupported file format. Please upload a PDF or DOCX file.');
      setFile(null);
      return;
    }
    
    // Check size limit (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Max size is 5MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = (e) => {
    if (e) e.stopPropagation();
    setFile(null);
    setError('');
  };

  // Convert File to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload Logic
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    setMessage('');
    
    try {
      const base64Data = await convertToBase64(file);
      
      const payload = {
        fileName: file.name,
        fileType: file.type || file.name.split('.').pop().toLowerCase(),
        fileData: base64Data
      };

      const response = await api.post(`/api/users/resume`, payload);
      
      // Update local storage user with resume info
      const updatedUser = { ...user, resume: response.data.resume };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage(response.data.message);
      setFile(null);
      
      // Reload to reflect changes in UI through context
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error uploading resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your uploaded resume?")) return;
    
    try {
      await api.delete(`/api/users/resume`);
      
      // Update local storage user
      const updatedUser = { ...user };
      delete updatedUser.resume;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Resume deleted successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Failed to delete resume.');
    }
  };

  const downloadBase64File = (base64Data, fileName) => {
    const linkSource = base64Data;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const handleDownload = async () => {
    try {
      setMessage('Fetching file...');
      const response = await api.get(`/api/users/resume/download`);
      const { fileName, fileData } = response.data;
      downloadBase64File(fileData, fileName);
      setMessage('');
    } catch (err) {
      setError('Failed to download resume.');
      setMessage('');
    }
  };

  const handleView = async () => {
    // Open new tab synchronously before async operations to prevent browser popup blockers
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<html><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f3f4f6;"><h3>Loading your resume...</h3></body></html>');
    }

    try {
      setMessage('Fetching file for view...');
      const response = await api.get(`/api/users/resume/download`);

      const { fileData, fileType, fileName } = response.data;

      if (fileType === 'application/pdf' || fileType === 'pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'))) {
        // Extract raw base64 from Data URL and clean whitespace
        const base64String = (fileData.includes(',') ? fileData.split(',')[1] : fileData).replace(/\s+/g, '');
        
        // Decode base64 to binary
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        // Create Blob and local URL
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        
        if (newWindow) {
          newWindow.location.href = fileURL;
        } else {
          window.open(fileURL, '_blank');
        }
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'docx' || (fileName && fileName.toLowerCase().endsWith('.docx'))) {
        // Render DOCX natively using docx-preview CDN injected into an HTML Blob
        const base64String = (fileData.includes(',') ? fileData.split(',')[1] : fileData).replace(/\s+/g, '');
        
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume Preview - ${fileName}</title>
  <script src="https://unpkg.com/jszip/dist/jszip.min.js"></script>
  <script src="https://unpkg.com/docx-preview/dist/docx-preview.min.js"></script>
  <style>
    body { background-color: #f3f4f6; margin: 0; padding: 20px; display: flex; justify-content: center; font-family: sans-serif; }
    #document-container { background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; max-width: 900px; min-height: 100vh; padding: 1rem; box-sizing: border-box; overflow-x: auto; }
    .loading-text { text-align: center; margin-top: 50px; color: #6b7280; font-weight: normal; }
  </style>
</head>
<body>
  <div id="document-container">
    <h3 class="loading-text" id="loading-msg">Rendering Word Document...</h3>
  </div>
  
  <script>
    try {
      const base64Data = "${base64String}";
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      const container = document.getElementById("document-container");
      
      const renderDoc = () => {
        if (window.docx) {
          docx.renderAsync(blob, container).then(() => {
            document.getElementById('loading-msg').style.display = 'none';
          }).catch(err => {
            document.getElementById('loading-msg').innerText = 'Error rendering document: ' + err.message;
          });
        } else {
          setTimeout(renderDoc, 100);
        }
      };
      
      renderDoc();
    } catch (e) {
      document.getElementById('loading-msg').innerText = 'Failed to process document data.';
    }
  </script>
</body>
</html>`;
        
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const fileURL = URL.createObjectURL(htmlBlob);
        
        if (newWindow) {
          newWindow.location.href = fileURL;
        } else {
          window.open(fileURL, '_blank');
        }
      } else {
        // Fallback for older .doc or unknown types
        if (newWindow) {
          newWindow.close();
        }
        downloadBase64File(fileData, fileName);
      }

      setMessage('');
    } catch (err) {
      if (newWindow) {
        newWindow.close();
      }
      setError('Failed to view resume. ' + (err.message || ''));
      setMessage('');
    }
  };

  return (
    <div className="resume-analyzer-container">
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Resume Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Upload and manage your professional resume file.</p>
        </div>
      </div>

      {/* Main content body */}
      <div className="glass-card" style={{ padding: '3rem 2rem' }}>
        {error && (
          <div className="alert alert-error" style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="alert alert-success" style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-emerald)' }}>
            <span>{message}</span>
          </div>
        )}

        {/* Display Current Resume if exists */}
        {user?.resume && !file && (
          <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--accent-blue)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-blue)' }}>Current Resume</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <svg style={{ width: '2rem', height: '2rem', color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <div style={{ fontWeight: 'bold' }}>{user.resume.fileName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded on {new Date(user.resume.uploadedAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleView} className="btn btn-secondary">View File</button>
              <button onClick={handleDownload} className="btn btn-primary">Download</button>
              <button onClick={handleDelete} className="btn" style={{ background: '#ef4444', color: 'white' }}>Delete</button>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {user?.resume ? 'Upload a Replacement' : 'Upload New Resume'}
        </h3>

        {/* Upload Drop Zone */}
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          id="drag-drop-zone"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx"
            style={{ display: 'none' }}
          />
          
          <div className="upload-icon-wrapper">
            <svg style={{ width: '2.5rem', height: '2.5rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Drag & Drop your Resume</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>or click to browse local files</p>
          </div>
          
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accepted Formats: PDF, DOCX (Max 5MB)</span>
        </div>

        {/* Selected File Details */}
        {file && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <div className="selected-file-card" id="selected-file-card">
              <div className="file-info-group">
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--accent-blue)', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="file-name-text" id="file-name-display">{file.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="file-remove-btn"
                aria-label="Remove selected file"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Trigger Upload Button */}
        {file && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleUpload}
              className="btn btn-primary"
              style={{ padding: '0.9rem 3rem' }}
              disabled={isUploading}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResumeAnalyzer;
