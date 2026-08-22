import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CareerPrediction = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    if (user) {
      generatePredictions();
    }
  }, [user]);

  const generatePredictions = () => {
    const userSkills = (user.skills || []).map(s => s.toLowerCase());
    const hasPython = userSkills.some(s => s.includes('python'));
    const hasReact = userSkills.some(s => s.includes('react'));
    const hasNode = userSkills.some(s => s.includes('node'));
    const hasData = userSkills.some(s => s.includes('data') || s.includes('sql') || s.includes('machine learning'));
    const hasCloud = userSkills.some(s => s.includes('aws') || s.includes('docker'));

    const roles = [];

    // Base rules for prediction
    if (hasReact && hasNode) {
      roles.push({
        title: 'Full Stack Developer',
        match: 95,
        growth: '+22% (High Growth)',
        description: 'You have solid frontend and backend skills. Perfect fit for full-stack web application development.',
        nextSteps: 'Focus on System Design and Cloud Deployment.'
      });
    } else if (hasReact) {
      roles.push({
        title: 'Frontend Engineer',
        match: 85,
        growth: '+15% (Stable)',
        description: 'Your React and UI skills make you a strong candidate for user-facing applications.',
        nextSteps: 'Learn State Management (Redux/Zustand) and Next.js.'
      });
    }

    if (hasPython && hasData) {
      roles.push({
        title: 'Data Engineer / Scientist',
        match: 90,
        growth: '+35% (Very High Growth)',
        description: 'Combining Python with data tools aligns you perfectly with the explosive data science market.',
        nextSteps: 'Deepen knowledge in Pandas, PyTorch, and Data Pipelines.'
      });
    } else if (hasPython) {
      roles.push({
        title: 'Backend Developer (Python)',
        match: 80,
        growth: '+18% (Stable)',
        description: 'Your Python skills are highly sought after for backend microservices and APIs.',
        nextSteps: 'Master Django or FastAPI and relational databases.'
      });
    }

    if (hasCloud) {
      roles.push({
        title: 'DevOps / Cloud Engineer',
        match: 75,
        growth: '+28% (High Growth)',
        description: 'Your knowledge of infrastructure tools positions you well for cloud automation roles.',
        nextSteps: 'Learn Terraform, CI/CD pipelines, and Kubernetes.'
      });
    }

    if (userSkills.length === 0) {
      setPredictions({ emptyState: 'We need more information about your skills to predict your career outlook. Please update your profile or parse a resume.' });
      return;
    }

    // Fallback if no specific skills match
    if (roles.length === 0) {
      roles.push({
        title: 'Software Developer (Generalist)',
        match: 60,
        growth: '+10% (Stable)',
        description: 'You are building foundational programming skills.',
        nextSteps: 'Pick a specialization (Frontend, Backend, or Data) and build projects.'
      });
    }

    // Sort by match percentage
    roles.sort((a, b) => b.match - a.match);
    
    setPredictions(roles);
  };

  if (!predictions) return <div style={{ padding: '2rem', textAlign: 'center' }}>Analyzing career trajectories...</div>;

  if (predictions.emptyState) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Career Prediction & Outlook</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{predictions.emptyState}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Career Prediction & Outlook</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Based on your current skill profile, here are the career paths you are best positioned for.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {predictions.map((role, idx) => (
            <div key={idx} className="glass-card" style={{ background: idx === 0 ? 'linear-gradient(145deg, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0.02) 100%)' : 'var(--glass-bg)', border: idx === 0 ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.05)' }}>
              {idx === 0 && (
                <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: 'var(--accent-blue)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '99px', marginBottom: '1rem' }}>TOP MATCH</span>
              )}
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{role.title}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Match Score</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: role.match >= 85 ? 'var(--accent-emerald)' : '#eab308' }}>{role.match}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Industry Growth</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{role.growth}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                {role.description}
              </p>

              <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Recommended Next Step</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>{role.nextSteps}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPrediction;
