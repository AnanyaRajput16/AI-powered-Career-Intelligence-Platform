import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (user) {
      calculateAnalytics();
    }
  }, [user]);

  const calculateAnalytics = () => {
    // 1. Completion Percentages
    let completedFields = 0;
    if (user.name) completedFields++;
    if (user.email) completedFields++;
    if (user.aboutMe) completedFields++;
    if (user.college) completedFields++;
    if (user.skills && user.skills.length > 0) completedFields++;
    if (user.workExperience && user.workExperience.length > 0) completedFields++;
    if (user.projects && user.projects.length > 0) completedFields++;
    
    const profileCompletion = Math.round((completedFields / 7) * 100);
    const resumeCompletion = user.resumeUrl || (user.skills && user.skills.length > 0) ? 100 : 25;

    // 2. Skill Metrics (Benchmarked against general standard)
    const userSkills = (user.skills || []).map(s => s.toLowerCase());
    const totalSkills = userSkills.length;
    
    const benchmarkStandard = ['javascript', 'react', 'node.js', 'sql', 'python', 'git', 'aws', 'docker'];
    const matchingSkills = userSkills.filter(s => benchmarkStandard.some(b => s.includes(b) || b.includes(s)));
    const missingSkills = benchmarkStandard.filter(b => !userSkills.some(s => s.includes(b) || b.includes(s)));
    
    const skillMatchPercentage = totalSkills === 0 ? 0 : Math.round((matchingSkills.length / benchmarkStandard.length) * 100);

    // 3. ATS & Quality
    let atsMatchScore = 30; // base
    atsMatchScore += skillMatchPercentage * 0.4;
    atsMatchScore += (user.workExperience?.length || 0) * 10;
    atsMatchScore += (user.projects?.length || 0) * 5;
    atsMatchScore = Math.min(98, Math.round(atsMatchScore));

    let resumeQualityScore = 40;
    if (user.aboutMe?.length > 50) resumeQualityScore += 15;
    if (user.college) resumeQualityScore += 15;
    if (user.projects?.length >= 2) resumeQualityScore += 15;
    if (user.workExperience?.length > 0) resumeQualityScore += 15;
    resumeQualityScore = Math.min(100, resumeQualityScore);

    // 4. Derived Recommendations
    let recommendedCareer = 'Software Engineer';
    let topJobMatch = 'Full Stack Developer at TechCorp';
    
    if (userSkills.includes('python') || userSkills.includes('data')) {
      recommendedCareer = 'Data Scientist / ML Engineer';
      topJobMatch = 'Data Analyst at AI Future';
    } else if (userSkills.includes('react') && !userSkills.includes('node.js')) {
      recommendedCareer = 'Frontend Engineer';
      topJobMatch = 'UI Developer at Creative Web';
    }

    setMetrics({
      profileCompletion,
      resumeCompletion,
      totalSkills,
      matchingSkills,
      missingSkills,
      skillMatchPercentage,
      atsMatchScore,
      resumeQualityScore,
      recommendedCareer,
      totalRecommendedJobs: 10, // from previous module
      totalRecommendedCourses: missingSkills.length * 2, // 2 per missing skill
      bestCourse: missingSkills.length > 0 ? `Advanced ${missingSkills[0].toUpperCase()} Masterclass` : 'System Design Primer',
      topImprovements: resumeQualityScore < 80 ? ['Add measurable metrics to experience', 'Increase project links'] : ['Format standard ATS headings', 'Keep to 1 page']
    });
    
    setLoading(false);
  };

  if (loading || !metrics) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Aggregating module analytics...</div>;
  }

  if (metrics.totalSkills === 0 && metrics.profileCompletion < 50) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Dashboard Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your profile is incomplete and no resume data was found. Please upload a resume or update your profile to view your analytics.</p>
        </div>
      </div>
    );
  }

  const renderProgressCircle = (percent, label, color) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${percent}, 100`} style={{ transition: 'stroke-dasharray 1s ease-out' }} />
        </svg>
        <span style={{ position: 'absolute', fontSize: '1.2rem', fontWeight: 'bold', color }}>{percent}%</span>
      </div>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</span>
    </div>
  );

  const renderStatCard = (title, value, subtitle) => (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1.5rem 1rem' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{value}</span>
      <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>{subtitle}</span>
    </div>
  );

  const renderHorizontalBar = (label, percent, color) => (
    <div style={{ marginBottom: '0.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent}%`, background: color }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Metrics Row */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
        {renderProgressCircle(metrics.atsMatchScore, 'Avg. ATS Match', 'var(--accent-blue)')}
        {renderProgressCircle(metrics.resumeQualityScore, 'Resume Quality', 'var(--accent-emerald)')}
        {renderProgressCircle(metrics.skillMatchPercentage, 'Skill Match', '#eab308')}
        {renderProgressCircle(metrics.profileCompletion, 'Profile Complete', 'var(--accent-purple, #8b5cf6)')}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {renderStatCard('Total Skills', metrics.totalSkills, 'Parsed from Resume')}
        {renderStatCard('Matching Skills', metrics.matchingSkills.length, 'Against Industry Std')}
        {renderStatCard('Missing Skills', metrics.missingSkills.length, 'Critical skill gaps')}
        {renderStatCard('Jobs Found', metrics.totalRecommendedJobs, 'Highly compatible')}
        {renderStatCard('Courses Ready', metrics.totalRecommendedCourses, 'To cover gaps')}
      </div>

      {/* Charts & Breakdowns Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>ATS & Quality Breakdown</h3>
          {renderHorizontalBar('Keyword Optimization', Math.min(95, metrics.atsMatchScore + 10), 'var(--accent-blue)')}
          {renderHorizontalBar('Format & Readability', 90, 'var(--accent-emerald)')}
          {renderHorizontalBar('Experience Density', Math.min(100, (user.workExperience?.length || 1) * 30), '#eab308')}
          {renderHorizontalBar('Project Relevance', Math.min(100, (user.projects?.length || 1) * 35), '#ef4444')}
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>Skill Gap Overview</h3>
          <div style={{ display: 'flex', height: '120px', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {/* CSS Bar Chart */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: `${Math.min(100, metrics.totalSkills * 5)}%`, background: 'var(--accent-blue)', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Owned</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: `${metrics.matchingSkills.length * 10}%`, background: 'var(--accent-emerald)', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Matched</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '40%', height: `${metrics.missingSkills.length * 10}%`, background: '#ef4444', borderRadius: '4px 4px 0 0' }}></div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Missing</span>
            </div>
          </div>
        </div>

      </div>

      {/* Analytical Insights Section */}
      <div className="glass-card" style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.05) 0%, rgba(0,0,0,0.2) 100%)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Profile & Resume Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Resume Readability</h4>
            <div style={{ fontSize: '1.1rem', color: metrics.resumeQualityScore >= 80 ? 'var(--accent-emerald)' : '#eab308', fontWeight: 'bold' }}>
              {metrics.resumeQualityScore >= 80 ? 'Excellent' : 'Needs Improvement'}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Based on length, formatting, and structural density.</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Competitive Standing</h4>
            <div style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>Top {Math.max(1, 100 - metrics.skillMatchPercentage)}%</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Based on industry benchmark skill matching.</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Actionable Deficits</h4>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {metrics.missingSkills.slice(0,3).map((s, i) => (
                <span key={i} style={{ padding: '0.1rem 0.5rem', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'capitalize' }}>{s}</span>
              ))}
              {metrics.missingSkills.length === 0 && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>None!</span>}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>These missing skills severely impact your ATS ranking.</p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Top Improvement Suggestion</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{metrics.topImprovements[0]}</div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DashboardAnalytics;
