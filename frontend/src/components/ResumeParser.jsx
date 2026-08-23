import React, { useState, useRef } from 'react';
import api from '../api/index';
import { useAuth } from '../context/AuthContext';

const ResumeParser = () => {
  const { updateProfile } = useAuth();
  
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

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

  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['pdf', 'docx'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Unsupported file format. Please upload a PDF or DOCX file.');
      setFile(null);
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Max size is 5MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleParse = async () => {
    if (!file) return;
    
    setIsParsing(true);
    setError('');
    setMessage('');
    
    try {
      const base64Data = await convertToBase64(file);
      
      const payload = {
        fileType: file.type || file.name.split('.').pop().toLowerCase(),
        fileData: base64Data
      };

      const response = await api.post('/api/resume/parse', payload);
      setParsedData(response.data.data);
      setMessage('Resume parsed successfully! Please review and edit the extracted details before saving to your profile.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error parsing resume. Ensure you have installed pdf-parse and mammoth in the backend.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParsedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveToProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      // Split comma separated arrays for the backend
      let generatedSummary = parsedData.summary?.trim();
      if (!generatedSummary) {
        const skillsArr = parsedData.skills ? parsedData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
        const topSkills = skillsArr.slice(0, 8).join(', ');
        const degree = parsedData.educationDetails?.degree || '';
        const branch = parsedData.educationDetails?.branch || '';
        const hasInternship = parsedData.workExperience?.toLowerCase().includes('intern') || parsedData.workExperience?.length > 20;
        
        let intro = 'Highly motivated professional';
        if (degree && branch) intro = `${degree} ${branch} graduate`;
        else if (degree) intro = `${degree} graduate`;
        else if (branch) intro = `${branch} professional`;

        const expText = hasInternship ? 'with internship/work experience and' : 'with';
        
        if (topSkills) {
          generatedSummary = `${intro} ${expText} hands-on experience in ${topSkills}. Passionate about building scalable solutions and contributing to innovative projects in the tech industry.`;
        } else {
          generatedSummary = `${intro} ${expText} a strong academic background. Eager to contribute to innovative projects and grow technical expertise.`;
        }
      }

      const submissionData = {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        collegeName: parsedData.educationDetails?.collegeName || '',
        degree: parsedData.educationDetails?.degree || '',
        branch: parsedData.educationDetails?.branch || '',
        passingYear: parsedData.educationDetails?.passingYear || '',
        cgpa: parsedData.educationDetails?.cgpa || '',
        skills: parsedData.skills ? parsedData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        certifications: parsedData.certifications ? parsedData.certifications.split(',').map(s => s.trim()).filter(s => s) : [],
        projects: parsedData.projects ? parsedData.projects.split('\n').map(s => s.trim()).filter(s => s) : [],
        workExperience: parsedData.workExperience ? parsedData.workExperience.split('\n').map(s => s.trim()).filter(s => s) : [],
        aboutMe: generatedSummary
      };

      const res = await updateProfile(submissionData);
      
      if (res.success) {
        setMessage('Extracted data saved to your profile successfully!');
        setTimeout(() => {
          window.location.hash = '#profile';
        }, 1500);
      } else {
        setError(res.message || 'Failed to save to profile');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setError('');
    setMessage('');
  };

  return (
    <div className="resume-analyzer-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Resume Auto-Parsing</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Upload your resume to automatically extract your details into your profile.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '3rem 2rem' }}>
        {error && (
          <div className="alert alert-error" style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="alert alert-success" style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-emerald)' }}>
            <span>{message}</span>
          </div>
        )}

        {!parsedData ? (
          <>
            {/* Upload Drop Zone for Parsing */}
            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ maxWidth: '600px', margin: '0 auto' }}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Select Resume for Parsing</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We will extract text from PDF or DOCX</p>
              </div>
            </div>

            {/* Selected File Details */}
            {file && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <div className="selected-file-card">
                  <div className="file-info-group">
                    <span className="file-name-text">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="file-remove-btn">
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {file && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button
                  onClick={handleParse}
                  className="btn btn-primary"
                  style={{ padding: '0.9rem 3rem' }}
                  disabled={isParsing}
                >
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span>{isParsing ? 'Extracting Data...' : 'Start Extraction'}</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="parsed-data-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--accent-blue)' }}>Extracted Information Review</h3>
              <button onClick={handleReset} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                Parse Another File
              </button>
            </div>

            <form onSubmit={handleSaveToProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" name="name" value={parsedData.name} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
                  <input type="email" name="email" value={parsedData.email} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone Number</label>
                <input type="text" name="phone" value={parsedData.phone} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skills (Comma Separated)</label>
                <input type="text" name="skills" value={parsedData.skills} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certifications (Comma Separated)</label>
                <input type="text" name="certifications" value={parsedData.certifications} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Education History</label>
                <textarea name="education" value={parsedData.education} onChange={handleChange} rows="4" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', resize: 'vertical' }}></textarea>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Work Experience</label>
                <textarea name="workExperience" value={parsedData.workExperience} onChange={handleChange} rows="5" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', resize: 'vertical' }}></textarea>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Projects</label>
                <textarea name="projects" value={parsedData.projects} onChange={handleChange} rows="5" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ padding: '1rem', marginTop: '1rem' }}>
                {isSaving ? 'Saving to Profile...' : 'Save Extracted Data to Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeParser;
