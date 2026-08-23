import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/index';

const rolesDB = [
  {
    title: 'Frontend Developer',
    requiredSkills: ['javascript', 'react', 'html', 'css', 'vue', 'angular', 'tailwind', 'bootstrap'],
    salary: '$70,000 - $110,000 / yr',
    growth: 'High'
  },
  {
    title: 'Backend Developer',
    requiredSkills: ['node.js', 'express', 'python', 'java', 'sql', 'mongodb', 'postgresql', 'c#'],
    salary: '$80,000 - $130,000 / yr',
    growth: 'High'
  },
  {
    title: 'Full Stack Developer',
    requiredSkills: ['javascript', 'react', 'node.js', 'express', 'mongodb', 'html', 'css', 'sql'],
    salary: '$90,000 - $140,000 / yr',
    growth: 'Very High'
  },
  {
    title: 'DevOps Engineer',
    requiredSkills: ['docker', 'kubernetes', 'aws', 'azure', 'linux', 'ci/cd', 'jenkins', 'bash'],
    salary: '$100,000 - $150,000 / yr',
    growth: 'Very High'
  },
  {
    title: 'Data Analyst',
    requiredSkills: ['python', 'sql', 'excel', 'tableau', 'power bi', 'data science'],
    salary: '$65,000 - $100,000 / yr',
    growth: 'Medium'
  },
  {
    title: 'AI/ML Engineer',
    requiredSkills: ['python', 'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch'],
    salary: '$110,000 - $160,000 / yr',
    growth: 'Extremely High'
  },
  {
    title: 'Cloud Engineer',
    requiredSkills: ['aws', 'azure', 'gcp', 'linux', 'docker', 'networking'],
    salary: '$105,000 - $155,000 / yr',
    growth: 'Very High'
  },
  {
    title: 'Software Engineer',
    requiredSkills: ['java', 'c++', 'python', 'javascript', 'agile', 'git', 'sql', 'docker'],
    salary: '$85,000 - $140,000 / yr',
    growth: 'High'
  },
  {
    title: 'Blockchain Developer',
    requiredSkills: ['rust', 'go', 'c++', 'javascript', 'solidity', 'blockchain', 'cryptography'],
    salary: '$120,000 - $180,000 / yr',
    growth: 'High'
  }
];

const CareerRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [user]);

  const generateRecommendations = () => {
    // Artificial slight delay for realistic processing feel
    setLoading(true);
    
    setTimeout(() => {
      const userSkills = (user.skills || []).map(s => s.toLowerCase());
      const userExp = (user.workExperience || []).join(' ').toLowerCase();
      const userProj = (user.projects || []).join(' ').toLowerCase();
      const userEdu = ((user.aboutMe || '') + ' ' + (user.college || '')).toLowerCase();
      
      const evaluatedRoles = rolesDB.map(role => {
        let matchedSkills = [];
        let missingSkills = [];
        
        // 1. Skill Matching
        role.requiredSkills.forEach(req => {
          if (userSkills.some(us => us.includes(req) || req.includes(us))) {
            matchedSkills.push(req);
          } else {
            missingSkills.push(req);
          }
        });
        
        let matchPercent = Math.round((matchedSkills.length / role.requiredSkills.length) * 100);
        
        // 2. Experience & Project Contextual Boosting
        const roleKeywords = role.title.toLowerCase().split(' ');
        roleKeywords.forEach(kw => {
          if (kw.length > 3) {
            if (userExp.includes(kw)) matchPercent += 10;
            if (userProj.includes(kw)) matchPercent += 5;
            if (userEdu.includes(kw)) matchPercent += 5;
          }
        });
        
        // Ensure cap at 99% for realism unless perfect
        if (matchPercent > 99) matchPercent = 99;
        if (missingSkills.length === 0) matchPercent = 100;
        
        // 3. Reason generator
        let whyMatch = '';
        if (matchPercent >= 80) {
            whyMatch = 'Excellent alignment with your existing technical skills, projects, and educational background.';
        } else if (matchPercent >= 50) {
            whyMatch = 'Good foundational skills present. Requires targeted upskilling in missing areas to become highly competitive.';
        } else {
            whyMatch = 'Low current match based on your profile. Significant upskilling and new projects required to pivot into this role.';
        }
  
        return {
          ...role,
          matchPercent,
          matchedSkills,
          missingSkills,
          whyMatch
        };
      });
      
      // Sort descending by match percent
      evaluatedRoles.sort((a, b) => b.matchPercent - a.matchPercent);
      
      // Return top 5
      setRecommendations(evaluatedRoles.slice(0, 5));
      setLoading(false);
      
      // Fire-and-forget telemetry
      try {
        api.post('/api/users/analytics/track', { type: 'career' }, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).catch(() => {}); // silently ignore errors to prevent UI breakage
      } catch (err) {}
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <svg style={{ width: '3rem', height: '3rem', animation: 'spin 1s linear infinite', color: 'var(--accent-blue)' }} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span style={{ color: 'var(--text-secondary)' }}>Analyzing your profile data against industry roles...</span>
      </div>
    );
  }

  return (
    <div className="career-recommendations-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Career Recommendations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Top 5 career roles matched using your parsed resume, skills, and projects.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {recommendations.map((role, index) => {
          const isBestMatch = index === 0;
          
          return (
            <div 
              key={index} 
              className="glass-card" 
              style={{ 
                position: 'relative', 
                border: isBestMatch ? '1px solid var(--accent-emerald)' : '1px solid rgba(255,255,255,0.05)',
                background: isBestMatch ? 'linear-gradient(145deg, rgba(16,185,129,0.05) 0%, rgba(255,255,255,0.02) 100%)' : 'var(--glass-bg)'
              }}
            >
              {isBestMatch && (
                <div style={{ position: 'absolute', top: '-12px', left: '1.5rem', background: 'var(--accent-emerald)', color: '#fff', padding: '0.2rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                  ★ BEST MATCH
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', marginTop: isBestMatch ? '0.5rem' : '0' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: isBestMatch ? 'var(--accent-emerald)' : 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {role.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {role.salary}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                      Growth: <strong style={{ color: 'var(--text-primary)' }}>{role.growth}</strong>
                    </span>
                  </div>
                </div>
                
                <div style={{ minWidth: '150px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span>Match Probability</span>
                    <span style={{ fontWeight: 'bold', color: role.matchPercent >= 80 ? 'var(--accent-emerald)' : role.matchPercent >= 50 ? '#eab308' : '#ef4444' }}>
                      {role.matchPercent}%
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${role.matchPercent}%`, 
                        background: role.matchPercent >= 80 ? 'var(--accent-emerald)' : role.matchPercent >= 50 ? '#eab308' : '#ef4444',
                        transition: 'width 1s ease-in-out'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Why this role matches your profile:</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {role.whyMatch}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginBottom: '0.8rem' }}>Matched Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {role.matchedSkills.length > 0 ? role.matchedSkills.map((s, i) => (
                      <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--accent-emerald)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                        {s}
                      </span>
                    )) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>}
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.8rem' }}>Missing Skills to Learn</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {role.missingSkills.length > 0 ? role.missingSkills.map((s, i) => (
                      <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', fontSize: '0.75rem', color: '#fca5a5' }}>
                        {s}
                      </span>
                    )) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerRecommendations;
