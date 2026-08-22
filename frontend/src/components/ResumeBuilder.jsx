import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ResumeBuilder = () => {
  const { user } = useAuth();
  
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    summary: '',
    collegeName: '',
    degree: '',
    branch: '',
    passingYear: '',
    cgpa: '',
    workExperience: '',
    projects: '',
    skills: '',
    certifications: ''
  });

  useEffect(() => {
    if (user) {
      setResumeData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        summary: user.aboutMe || '',
        collegeName: user.collegeName || '',
        degree: user.degree || '',
        branch: user.branch || '',
        passingYear: user.passingYear || '',
        cgpa: user.cgpa || '',
        workExperience: user.workExperience ? user.workExperience.join(', ') : '',
        projects: user.projects ? user.projects.join(', ') : '',
        skills: user.skills ? user.skills.join(', ') : '',
        certifications: user.certifications ? user.certifications.join(', ') : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Resume changes saved locally! (MongoDB update will be implemented in later phases)');
  };

  return (
    <div className="resume-builder-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Resume Builder</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Phase 1 Foundation: Edit your resume data locally using your existing profile.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Personal Information */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: 'var(--accent-blue)' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
              <input type="text" name="name" value={resumeData.name} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" name="email" value={resumeData.email} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Phone Number</label>
              <input type="tel" name="phone" value={resumeData.phone} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>LinkedIn Profile</label>
              <input type="url" name="linkedin" value={resumeData.linkedin} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>GitHub Profile</label>
              <input type="url" name="github" value={resumeData.github} onChange={handleChange} className="form-input" />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: 'var(--accent-emerald)' }}>Professional Summary</h3>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <textarea name="summary" value={resumeData.summary} onChange={handleChange} rows="4" className="form-input" style={{ resize: 'vertical' }} placeholder="A brief professional summary..."></textarea>
          </div>
        </div>

        {/* Education */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: '#eab308' }}>Education</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>College / University Name</label>
              <input type="text" name="collegeName" value={resumeData.collegeName} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Degree</label>
              <input type="text" name="degree" value={resumeData.degree} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Branch / Major</label>
              <input type="text" name="branch" value={resumeData.branch} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Passing Year</label>
              <input type="text" name="passingYear" value={resumeData.passingYear} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CGPA / Percentage</label>
              <input type="text" name="cgpa" value={resumeData.cgpa} onChange={handleChange} className="form-input" />
            </div>
          </div>
        </div>

        {/* Experience & Projects */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: 'var(--accent-rose)' }}>Work Experience & Projects</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Work Experience (Comma separated or detailed paragraphs)</label>
              <textarea name="workExperience" value={resumeData.workExperience} onChange={handleChange} rows="4" className="form-input" style={{ resize: 'vertical' }}></textarea>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Projects (Comma separated or detailed paragraphs)</label>
              <textarea name="projects" value={resumeData.projects} onChange={handleChange} rows="4" className="form-input" style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
        </div>

        {/* Skills & Certifications */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', color: 'var(--accent-indigo)' }}>Skills & Certifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skills (Comma separated)</label>
              <textarea name="skills" value={resumeData.skills} onChange={handleChange} rows="2" className="form-input" style={{ resize: 'vertical' }}></textarea>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Certifications (Comma separated)</label>
              <textarea name="certifications" value={resumeData.certifications} onChange={handleChange} rows="2" className="form-input" style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
        </div>

        {/* Save Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            Save Local Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeBuilder;
