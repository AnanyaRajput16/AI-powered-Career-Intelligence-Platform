import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    collegeName: '',
    degree: '',
    branch: '',
    passingYear: '',
    cgpa: '',
    skills: '',
    certifications: '',
    projects: '',
    workExperience: '',
    careerInterests: '',
    linkedin: '',
    github: '',
    location: '',
    aboutMe: ''
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        collegeName: user.collegeName || '',
        degree: user.degree || '',
        branch: user.branch || '',
        passingYear: user.passingYear || '',
        cgpa: user.cgpa || '',
        skills: user.skills ? user.skills.join(', ') : '',
        certifications: user.certifications ? user.certifications.join(', ') : '',
        projects: user.projects ? user.projects.join(', ') : '',
        workExperience: user.workExperience ? user.workExperience.join(', ') : '',
        careerInterests: user.careerInterests ? user.careerInterests.join(', ') : '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        location: user.location || '',
        aboutMe: user.aboutMe || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        collegeName: user.collegeName || '',
        degree: user.degree || '',
        branch: user.branch || '',
        passingYear: user.passingYear || '',
        cgpa: user.cgpa || '',
        skills: user.skills ? user.skills.join(', ') : '',
        certifications: user.certifications ? user.certifications.join(', ') : '',
        projects: user.projects ? user.projects.join(', ') : '',
        workExperience: user.workExperience ? user.workExperience.join(', ') : '',
        careerInterests: user.careerInterests ? user.careerInterests.join(', ') : '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        location: user.location || '',
        aboutMe: user.aboutMe || ''
      });
    }
    setMessage('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    // Basic Validation
    if (!formData.name) {
      setErrorMsg('Name is required');
      return;
    }

    setLoading(true);

    const submissionData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
      projects: formData.projects.split(',').map(s => s.trim()).filter(s => s),
      workExperience: formData.workExperience.split(',').map(s => s.trim()).filter(s => s),
      careerInterests: formData.careerInterests.split(',').map(s => s.trim()).filter(s => s)
    };

    const res = await updateProfile(submissionData);
    setLoading(false);
    if (res.success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setErrorMsg(res.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-module" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1rem' }}>
      <div className="glass-card profile-form-container">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Edit Profile</h3>
        
        {message && <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>{message}</div>}
        {errorMsg && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{errorMsg}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email (Read Only)</label>
            <input type="email" name="email" value={formData.email} readOnly className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'not-allowed' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}>
                <option value="" style={{ color: 'black' }}>Select...</option>
                <option value="Male" style={{ color: 'black' }}>Male</option>
                <option value="Female" style={{ color: 'black' }}>Female</option>
                <option value="Other" style={{ color: 'black' }}>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>

          <h4 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--accent-blue)' }}>Education</h4>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>College Name</label>
            <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Degree</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="B.Tech" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Branch</label>
              <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="CSE" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Passing Year</label>
              <input type="text" name="passingYear" value={formData.passingYear} onChange={handleChange} placeholder="2025" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CGPA</label>
              <input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="8.5" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>

          <h4 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--accent-blue)' }}>Professional Details (Comma separated)</h4>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Skills</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certifications</label>
            <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} placeholder="AWS Cloud Practitioner, Infosys Springboard..." className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Projects</label>
            <input type="text" name="projects" value={formData.projects} onChange={handleChange} placeholder="E-commerce App, AI Career Platform..." className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Work Experience</label>
            <input type="text" name="workExperience" value={formData.workExperience} onChange={handleChange} placeholder="Intern at XYZ..." className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Career Interests</label>
            <input type="text" name="careerInterests" value={formData.careerInterests} onChange={handleChange} placeholder="Full Stack Developer, UI/UX..." className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
          </div>

          <h4 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--accent-blue)' }}>Links & Bio</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LinkedIn Profile</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>GitHub Profile</label>
              <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>About Me</label>
            <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} rows="3" className="form-input" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, padding: '0.75rem', borderRadius: '4px' }}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={handleReset} className="btn btn-secondary" disabled={loading} style={{ flex: 1, padding: '0.75rem', borderRadius: '4px' }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card profile-preview-container" style={{ alignSelf: 'start', position: 'sticky', top: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Live Profile Preview</h3>
        <div className="preview-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem auto' }}>
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{formData.name || 'Your Name'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{formData.degree ? `${formData.degree} ${formData.branch ? `in ${formData.branch}` : ''}` : 'Your Degree'}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0' }}>{formData.location || 'Location not set'}</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contact Info</h4>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>Email:</span> {formData.email}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>Phone:</span> {formData.phone || 'N/A'}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>LinkedIn:</span> {formData.linkedin || 'N/A'}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>GitHub:</span> {formData.github || 'N/A'}</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Education</h4>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>College:</span> {formData.collegeName || 'N/A'}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>Passing Year:</span> {formData.passingYear || 'N/A'}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>CGPA:</span> {formData.cgpa || 'N/A'}</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Skills & Interests</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
              {formData.skills ? formData.skills.split(',').map((skill, idx) => (
                skill.trim() && <span key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem' }}>{skill.trim()}</span>
              )) : <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills added</span>}
            </div>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}><span style={{ color: 'var(--text-muted)' }}>Interests:</span> {formData.careerInterests || 'N/A'}</p>
          </div>
          
          {formData.aboutMe && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>About Me</h4>
              <p style={{ fontSize: '0.85rem', margin: '0', lineHeight: '1.4' }}>{formData.aboutMe}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
