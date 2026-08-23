import React, { useState, useEffect } from 'react';
import api from '../api/index';
import { useAuth } from '../context/AuthContext';

const JobRecommendations = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchAndMatchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get('/api/jobs');
          const fetchedJobs = res.data;
          
          if (!fetchedJobs || fetchedJobs.length === 0) {
            setJobs([]);
            setLoading(false);
            return;
          }

          const userSkills = (user.skills || []).map(s => s.toLowerCase());
          const userExp = (user.workExperience || []).join(' ').toLowerCase();
          
          const evaluatedJobs = fetchedJobs.map(job => {
            let matchedCount = 0;
            const reqSkills = job.requiredSkills || [];
            
            reqSkills.forEach(req => {
              const reqLower = typeof req === 'string' ? req.toLowerCase() : '';
              if (userSkills.some(us => us.includes(reqLower) || reqLower.includes(us))) {
                matchedCount++;
              }
            });
            
            let matchPercent = reqSkills.length > 0 ? Math.round((matchedCount / reqSkills.length) * 100) : 0;
            
            // Experience Context Boost
            const expString = (job.experience || '').toLowerCase();
            if (expString.includes('0-2') || expString.includes('1-2') || expString.includes('1-3')) {
               if (userExp.length < 200) matchPercent += 10;
            } else {
               if (userExp.length > 300) matchPercent += 10;
            }
            
            if (matchPercent > 99) matchPercent = 99;
            if (matchedCount === reqSkills.length && reqSkills.length > 0) matchPercent = 100;
            
            return {
              ...job,
              id: job._id || job.id, // Map MongoDB _id to id for existing UI
              matchPercent
            };
          });
          
          // Sort descending by match percent
          evaluatedJobs.sort((a, b) => b.matchPercent - a.matchPercent);
          setJobs(evaluatedJobs);
          
          // Fire-and-forget telemetry
          try {
            api.post('/api/users/analytics/track', { type: 'job' }, {
              headers: { Authorization: `Bearer ${user.token}` }
            }).catch(() => {});
          } catch (err) {}
        } catch (err) {
          console.error('Error fetching jobs:', err);
          setError('Failed to load job recommendations. Please check your connection and try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAndMatchJobs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <svg style={{ width: '3rem', height: '3rem', animation: 'spin 1s linear infinite', color: 'var(--accent-emerald)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span style={{ color: 'var(--text-secondary)' }}>Scouring job boards for your perfect match...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <svg style={{ width: '3rem', height: '3rem', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span style={{ color: 'var(--text-secondary)' }}>{error}</span>
      </div>
    );
  }

  return (
    <div className="job-recommendations-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Job Recommendations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>We found these 10 realistic job postings based on your skills, ATS score, and career trajectory.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {jobs.map((job, index) => {
          const isTopMatch = index < 2; // Highlight top 2
          
          return (
            <div 
              key={job.id} 
              className="glass-card" 
              style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isTopMatch ? '1px solid var(--accent-emerald)' : '1px solid rgba(255,255,255,0.05)',
                background: isTopMatch ? 'linear-gradient(145deg, rgba(16,185,129,0.03) 0%, rgba(255,255,255,0.01) 100%)' : 'var(--glass-bg)'
              }}
            >
              {isTopMatch && (
                <div style={{ position: 'absolute', top: '-10px', right: '1.5rem', background: 'var(--accent-emerald)', color: '#fff', padding: '0.2rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  TOP MATCH
                </div>
              )}
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {job.title}
                    </h3>
                    <div style={{ color: 'var(--accent-blue)', fontSize: '0.95rem', fontWeight: '500' }}>
                      {job.company}
                    </div>
                  </div>
                  
                  {/* Circular Mini Score */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${job.matchPercent >= 80 ? 'var(--accent-emerald)' : job.matchPercent >= 50 ? '#eab308' : '#ef4444'}` }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: job.matchPercent >= 80 ? 'var(--accent-emerald)' : job.matchPercent >= 50 ? '#eab308' : '#ef4444' }}>{job.matchPercent}%</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {job.type}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {job.experience}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {job.salary}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Required Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {job.requiredSkills.map((skill, i) => {
                      const userSkills = (user.skills || []).map(s => s.toLowerCase());
                      const hasSkill = userSkills.some(us => us.includes(skill) || skill.includes(us));
                      return (
                        <span key={i} style={{ 
                          padding: '0.2rem 0.5rem', 
                          background: hasSkill ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', 
                          border: hasSkill ? '1px solid var(--accent-emerald)' : '1px solid transparent',
                          borderRadius: '4px', 
                          fontSize: '0.75rem', 
                          color: hasSkill ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                          textTransform: 'capitalize'
                        }}>
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                {job.applyLink ? (
                  <a 
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                  >
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    Quick Apply
                  </a>
                ) : (
                  <button 
                    className="btn" 
                    disabled
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Apply Unavailable
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobRecommendations;
