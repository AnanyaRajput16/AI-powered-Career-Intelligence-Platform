import React, { useState, useEffect } from 'react';
import api from '../api/index';
import { useAuth } from '../context/AuthContext';

const SkillGapAnalyzer = () => {
  const { user, token, refreshUser } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (user && user.analysisHistory && user.analysisHistory.skillGap) {
      if (user.analysisHistory.skillGap.jobDescription) setJobDescription(user.analysisHistory.skillGap.jobDescription);
      if (user.analysisHistory.skillGap.result) setResult(user.analysisHistory.skillGap.result);
    }
  }, [user]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Reusing the exact same backend API as ATS Analysis
      const response = await api.post('/api/ats/analyze', { jobDescription, module: 'skillGap' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      if (refreshUser) await refreshUser();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error analyzing skill gap against job description.');
    } finally {
      setLoading(false);
    }
  };

  const categorizeSkills = (skillsArray) => {
    const categories = {
      'Programming Languages': ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust', 'typescript', 'html', 'css', 'sass'],
      'Frameworks': ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'bootstrap', 'tailwind', 'graphql', 'rest api'],
      'Databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'nosql', 'firebase'],
      'Cloud & DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'linux', 'unix', 'bash'],
      'Tools & Others': ['git', 'github', 'gitlab', 'excel', 'tableau', 'power bi', 'agile', 'scrum', 'machine learning', 'ai', 'data science']
    };

    const grouped = {
      'Programming Languages': [],
      'Frameworks': [],
      'Databases': [],
      'Cloud & DevOps': [],
      'Tools & Others': []
    };

    skillsArray.forEach(skill => {
      let found = false;
      for (const [cat, items] of Object.entries(categories)) {
        if (cat !== 'Tools & Others' && items.includes(skill.toLowerCase())) {
          grouped[cat].push(skill);
          found = true;
          break;
        }
      }
      if (!found) grouped['Tools & Others'].push(skill);
    });

    return grouped;
  };

  let categorizedMissing = {};
  if (result) {
    categorizedMissing = categorizeSkills(result.missingSkills);
  }

  return (
    <div className="skill-gap-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Analyze Skill Gap from Job Description</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Identify missing competencies required for your target job description.</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="form-input"
            rows="6"
            placeholder="Paste the job description here to extract and categorize missing skills..."
            style={{ width: '100%', resize: 'vertical', minHeight: '120px' }}
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          className="btn btn-primary"
          disabled={loading || !user}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Mapping Skill Gaps...' : 'Analyze Skill Gap'}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
          
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Skill Match Score</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Based strictly on technical keywords required.</p>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: result.categoryScores.skills >= 80 ? 'var(--accent-emerald)' : result.categoryScores.skills >= 50 ? '#eab308' : '#ef4444' }}>
              {result.categoryScores.skills}%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Existing / Matching Skills */}
            <div className="glass-card">
              <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Matched Skills (You Have)
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.matchingSkills.length > 0 ? result.matchingSkills.map((skill, i) => (
                  <span key={i} style={{ padding: '0.3rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent-emerald)', textTransform: 'capitalize' }}>
                    {skill}
                  </span>
                )) : <span style={{ color: 'var(--text-muted)' }}>No direct skill matches found.</span>}
              </div>
            </div>

            {/* Recommended Skills to Learn */}
            <div className="glass-card">
              <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Recommended to Learn First
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.missingSkills.length > 0 ? result.missingSkills.slice(0, 5).map((skill, i) => (
                  <span key={i} style={{ padding: '0.3rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-blue)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent-blue)', textTransform: 'capitalize' }}>
                    {skill}
                  </span>
                )) : <span style={{ color: 'var(--text-muted)' }}>No missing skills to recommend!</span>}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem', color: '#ef4444' }}>Missing Skills by Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {Object.entries(categorizedMissing).map(([category, skills]) => {
              if (skills.length === 0) return null;
              return (
                <div key={category} className="glass-card" style={{ borderTop: '3px solid #ef4444' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{category}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skills.map((skill, i) => (
                      <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '99px', fontSize: '0.8rem', color: '#fca5a5', textTransform: 'capitalize' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {result.missingSkills.length === 0 && (
              <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--accent-emerald)' }}>
                Your resume satisfies all identified technical requirements in the job description!
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;
