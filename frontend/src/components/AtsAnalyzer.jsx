import React, { useState, useEffect } from 'react';
import api from '../api/index';
import { useAuth } from '../context/AuthContext';

const AtsAnalyzer = () => {
  const { user, token, refreshUser } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (user && user.analysisHistory && user.analysisHistory.ats) {
      if (user.analysisHistory.ats.jobDescription) setJobDescription(user.analysisHistory.ats.jobDescription);
      if (user.analysisHistory.ats.result) setResult(user.analysisHistory.ats.result);
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
     const response = await api.post(
       '/api/ats/analyze',
       { jobDescription, module: 'ats' },
       {
         headers: { Authorization: `Bearer ${token}` }
        }
       );

       setResult(response.data);

       // Save latest ATS result for Learning Path
       localStorage.setItem(
         'latestAtsResult',
          JSON.stringify(response.data)
   );

if (refreshUser) await refreshUser();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error analyzing resume against job description.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--accent-emerald)';
    if (score >= 75) return 'var(--accent-blue)';
    if (score >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="ats-analyzer-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>ATS Resume Analysis</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Compare your profile data with a job description to calculate your ATS match score.</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Paste Job Description Here</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="form-input"
            rows="8"
            placeholder="Paste the full job description from LinkedIn, Indeed, etc."
            style={{ width: '100%', resize: 'vertical', minHeight: '150px' }}
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          className="btn btn-primary"
          disabled={loading || !user}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <svg style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing Resume...
            </span>
          ) : (
            'Analyze Resume Match'
          )}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
          {/* Top Score Section */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={getScoreColor(result.score)}
                    strokeWidth="3"
                    strokeDasharray={`${result.score}, 100`}
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getScoreColor(result.score) }}>{result.score}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
            </div>
            
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>ATS Rating: <span style={{ color: getScoreColor(result.score) }}>{result.rating}</span></h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Your profile matches {result.score}% of the core requirements found in this job description.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Skills (40%)</span>
                    <span>{result.categoryScores.skills}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.categoryScores.skills}%`, background: 'var(--accent-blue)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Experience (25%)</span>
                    <span>{result.categoryScores.experience}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.categoryScores.experience}%`, background: 'var(--accent-indigo)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Projects (15%)</span>
                    <span>{result.categoryScores.projects}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.categoryScores.projects}%`, background: 'var(--accent-cyan)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Education (10%) & Keywords (10%)</span>
                    <span>{(result.categoryScores.education + result.categoryScores.keywords) / 2}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(result.categoryScores.education + result.categoryScores.keywords) / 2}%`, background: 'var(--accent-emerald)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Matching & Missing Skills */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Matching Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.matchingSkills.length > 0 ? result.matchingSkills.map((skill, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', borderRadius: '99px', fontSize: '0.8rem', color: 'var(--accent-emerald)', textTransform: 'capitalize' }}>
                      {skill}
                    </span>
                  )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No direct skill matches found.</span>}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#ef4444', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                  Missing Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.missingSkills.length > 0 ? result.missingSkills.map((skill, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '99px', fontSize: '0.8rem', color: '#fca5a5', textTransform: 'capitalize' }}>
                      {skill}
                    </span>
                  )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Great! No required skills missing.</span>}
                </div>
              </div>
            </div>

            {/* General Keywords */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  Matching Keywords
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.matchingKeywords.map((kw, i) => (
                    <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#fca5a5', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Missing Keywords
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
             <div className="glass-card">
                <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>Resume Strengths</h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.strengths.map((str, i) => <li key={i}>{str}</li>)}
                </ul>
             </div>
             
             <div className="glass-card">
                <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>Resume Weaknesses</h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                </ul>
             </div>
             
             <div className="glass-card">
                <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>Improvement Suggestions</h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                </ul>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtsAnalyzer;

