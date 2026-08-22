import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LearningPath = () => {
  const { user } = useAuth();
  const [learningPlan, setLearningPlan] = useState(null);

  useEffect(() => {
    if (user) {
      generatePath();
    }
  }, [user]);

  const generatePath = () => {
    // Try to load latest ATS result for actual JD-based skill gaps
    const savedAts = localStorage.getItem('latestAtsResult');
    
    if (!savedAts) {
      setLearningPlan({ emptyState: 'No ATS or Skill Gap analysis found. Please run an ATS Analysis or Skill Gap check on a Job Description first to generate a personalized Learning Path.' });
      return;
    }

    let parsedAts;
    try {
      parsedAts = JSON.parse(savedAts);
    } catch (e) {
      setLearningPlan({ emptyState: 'Invalid saved skill gap data. Please run ATS Analysis again.' });
      return;
    }

    const missingSkills = parsedAts.missingSkills || [];
    
    if (missingSkills.length === 0) {
      setLearningPlan({ emptyState: 'You currently have no major skill gaps based on the analyzed job description. Continue strengthening your existing skills.' });
      return;
    }

    const steps = [];
    
    // Step 1: Core Fundamentals (Beginner)
    const beginnerSkills = missingSkills.filter(s => ['javascript', 'python', 'git', 'sql', 'html', 'css', 'java', 'c++'].includes(s.toLowerCase()));
    steps.push({
      phase: 'Phase 1: Core Fundamentals',
      description: 'Build a strong foundation in essential programming languages and tools.',
      skills: beginnerSkills.length > 0 ? beginnerSkills : ['Proficient (No gaps detected)'],
      resources: 'freeCodeCamp, YouTube Crash Courses',
      difficulty: 'Beginner',
      duration: '2–3 Weeks',
      outcome: 'Build a strong understanding of programming and core technical fundamentals.'
    });

    // Step 2: Advanced & Frameworks (Intermediate)
    const intermediateSkills = missingSkills.filter(s => ['react', 'node', 'express', 'django', 'mongodb', 'postgresql', 'spring boot', 'rest api', 'api'].includes(s.toLowerCase()));
    steps.push({
      phase: 'Phase 2: Frameworks & Application Dev',
      description: 'Learn modern frameworks to build robust web applications.',
      skills: intermediateSkills.length > 0 ? intermediateSkills : ['Proficient (No gaps detected)'],
      resources: 'Udemy, Coursera Specializations',
      difficulty: 'Intermediate',
      duration: '3–4 Weeks',
      outcome: 'Build practical applications using relevant frameworks and development tools.'
    });

    // Step 3: Infrastructure & Cloud (Advanced)
    const advancedSkills = missingSkills.filter(s => ['aws', 'docker', 'kubernetes', 'ci/cd', 'linux', 'azure'].includes(s.toLowerCase()));
    steps.push({
      phase: 'Phase 3: Cloud & Deployment',
      description: 'Master deployment, containerization, and cloud infrastructure.',
      skills: advancedSkills.length > 0 ? advancedSkills : ['Proficient (No gaps detected)'],
      resources: 'AWS Skill Builder, Official Documentation',
      difficulty: 'Advanced',
      duration: '2–3 Weeks',
      outcome: 'Learn deployment, cloud concepts, and how to take applications into production.'
    });

    // Catch any uncategorized missing skills
    const categorized = new Set([...beginnerSkills, ...intermediateSkills, ...advancedSkills]);
    const remaining = missingSkills.filter(s => !categorized.has(s));
    
    steps.push({
      phase: 'Phase 4: Domain-Specific Tools',
      description: 'Acquire the specific specialized tools requested in the job description.',
      skills: remaining.length > 0 ? remaining : ['Proficient (No gaps detected)'],
      resources: 'Specific Documentation & Tutorials',
      difficulty: 'Variable',
      duration: '2–4 Weeks',
      outcome: "Gain hands-on familiarity with domain-specific tools required for the user's target career."
    });

    setLearningPlan({
      steps,
      totalGaps: missingSkills.length
    });
  };

  if (!learningPlan) return <div style={{ padding: '2rem', textAlign: 'center' }}>Generating learning path...</div>;

  if (learningPlan.emptyState) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Learning Path</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{learningPlan.emptyState}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Your Learning Path</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          An ordered progression plan based on your current skill gaps ({learningPlan.totalGaps} core skills missing).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
          {/* Vertical line connecting steps */}
          <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '20px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
          
          {learningPlan.steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, border: '4px solid var(--bg-primary)' }}>
                {index + 1}
              </div>
              <div className="glass-card" style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: '1 1 60%', minWidth: '280px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>{step.phase}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{step.description}</p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skills to Master</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {step.skills.map((s, i) => (
                        <span key={i} style={{ padding: '0.2rem 0.6rem', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', borderRadius: '4px', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Recommended Resources</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{step.resources}</span>
                  </div>
                </div>

                <div style={{ flex: '1 1 30%', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span style={{ fontWeight: '500' }}>{step.duration}</span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem', marginTop: 'auto' }}>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Outcome</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', margin: 0 }}>{step.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
