import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const courseDB = {
  'react': [
    { title: 'React - The Complete Guide', platform: 'Udemy', difficulty: 'Intermediate', duration: '40 Hours', isFree: 'Paid', link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', reason: 'Industry standard course for mastering React and Hooks.' },
    { title: 'Learn React for Free', platform: 'freeCodeCamp', difficulty: 'Beginner', duration: '12 Hours', isFree: 'Free', link: 'https://www.freecodecamp.org/news/search/?query=react', reason: 'Best free hands-on tutorial with interactive challenges.' }
  ],
  'node.js': [
    { title: 'NodeJS - The Complete Guide', platform: 'Udemy', difficulty: 'Intermediate', duration: '35 Hours', isFree: 'Paid', link: 'https://www.udemy.com/course/nodejs-the-complete-guide/', reason: 'Deep dive into Express, REST APIs, and backend concepts.' },
    { title: 'Node.js Crash Course', platform: 'YouTube', difficulty: 'Beginner', duration: '3 Hours', isFree: 'Free', link: 'https://www.youtube.com/results?search_query=node.js+crash+course', reason: 'Quick start for building your first backend server.' }
  ],
  'python': [
    { title: 'Python for Everybody', platform: 'Coursera', difficulty: 'Beginner', duration: '30 Hours', isFree: 'Free', link: 'https://www.coursera.org/specializations/python', reason: 'Best university-backed Python introduction by Univ of Michigan.' },
    { title: '100 Days of Code: Python', platform: 'Udemy', difficulty: 'Advanced', duration: '60 Hours', isFree: 'Paid', link: 'https://www.udemy.com/course/100-days-of-code/', reason: 'Highly practical project-based learning.' }
  ],
  'aws': [
    { title: 'AWS Certified Solutions Architect', platform: 'Udemy', difficulty: 'Intermediate', duration: '25 Hours', isFree: 'Paid', link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', reason: 'Essential certification prep for cloud deployment.' },
    { title: 'AWS Cloud Practitioner Basics', platform: 'YouTube', difficulty: 'Beginner', duration: '5 Hours', isFree: 'Free', link: 'https://www.youtube.com/results?search_query=aws+cloud+practitioner+basics', reason: 'Great overview of EC2, S3, and IAM for beginners.' }
  ],
  'docker': [
    { title: 'Docker Mastery', platform: 'Udemy', difficulty: 'Intermediate', duration: '20 Hours', isFree: 'Paid', link: 'https://www.udemy.com/course/docker-mastery/', reason: 'Complete guide to containers and Docker Compose.' },
    { title: 'Docker Tutorial for Beginners', platform: 'YouTube', difficulty: 'Beginner', duration: '2 Hours', isFree: 'Free', link: 'https://www.youtube.com/results?search_query=docker+tutorial+for+beginners', reason: 'Quick implementation guide to get your first container running.' }
  ],
  'sql': [
    { title: 'The Complete SQL Bootcamp', platform: 'Udemy', difficulty: 'Beginner', duration: '9 Hours', isFree: 'Paid', link: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', reason: 'Master complex queries and database design.' },
    { title: 'SQL Basics', platform: 'freeCodeCamp', difficulty: 'Beginner', duration: '4 Hours', isFree: 'Free', link: 'https://www.freecodecamp.org/news/search/?query=sql', reason: 'Interactive intro to relational databases.' }
  ]
};

const getFallbackCourses = (skill) => [
  { 
    title: `Introduction to ${skill.toUpperCase()}`, 
    platform: 'Coursera', 
    difficulty: 'Beginner', 
    duration: '10 Hours', 
    isFree: 'Free', 
    link: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`, 
    reason: `Build foundational knowledge of ${skill} required by ATS.` 
  },
  { 
    title: `Advanced ${skill.toUpperCase()} Masterclass`, 
    platform: 'Udemy', 
    difficulty: 'Intermediate', 
    duration: '15 Hours', 
    isFree: 'Paid', 
    link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`, 
    reason: `Deep dive into advanced concepts to close your skill gap.` 
  }
];

const CourseRecommendations = () => {
  const { user, token } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [atsResult, setAtsResult] = useState({ matchingSkills: [], missingSkills: [] });
  
  // Filters
  const [platformFilter, setPlatformFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first to identify missing skills.');
      return;
    }
    
    setLoading(true);
    setError('');
    setAnalyzed(false);
    
    try {
      // Reuse the ATS API to get accurate missing skills
      const response = await axios.post('/api/ats/analyze', { jobDescription }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('latestAtsResult', JSON.stringify(response.data));
      const missingSkills = response.data.missingSkills || [];
      
      let generatedCourses = [];
      
      // Limit to top 5 missing skills to avoid overwhelming
      const prioritySkills = missingSkills.slice(0, 5);
      
      prioritySkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        let skillCourses = courseDB[skillLower];
        if (!skillCourses) {
          skillCourses = getFallbackCourses(skill);
        }
        
        skillCourses.forEach(c => {
          generatedCourses.push({
            ...c,
            targetSkill: skill
          });
        });
      });
      
      setCourses(generatedCourses);
      setAtsResult(response.data);
      setAnalyzed(true);
      
      // Fire-and-forget telemetry
      try {
        axios.post('/api/users/analytics/track', { type: 'course' }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      } catch (err) {}
    } catch (err) {
      console.error(err);
      setError('Error analyzing profile for courses.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    if (platformFilter !== 'All' && c.platform !== platformFilter) return false;
    if (difficultyFilter !== 'All' && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="course-recommendations-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Course Recommendations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Targeted learning resources based on your Skill Gap and ATS Analysis.</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Job Description (For Skill Gap Context)</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="form-input"
            rows="5"
            placeholder="Paste your target job description here to analyze missing skills and generate courses..."
            style={{ width: '100%', resize: 'vertical', minHeight: '100px' }}
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          className="btn btn-primary"
          disabled={loading || !user}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Generating Curriculums...' : 'Find Courses to Close Skill Gap'}
        </button>
      </div>

      {analyzed && courses.length === 0 && atsResult.matchingSkills?.length === 0 && atsResult.missingSkills?.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', animation: 'fadeIn 0.5s ease', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No recognized skills found</h3>
          <p style={{ color: 'var(--text-muted)' }}>We couldn't identify any technical skills in this job description. Try pasting a different one.</p>
        </div>
      )}

      {analyzed && courses.length === 0 && atsResult.matchingSkills?.length > 0 && atsResult.missingSkills?.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', animation: 'fadeIn 0.5s ease', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--accent-emerald)' }}>No Skill Gaps Detected!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You already possess all the technical skills recognized in this job description. No fallback courses are needed!</p>
        </div>
      )}

      {courses.length > 0 && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <select 
              className="form-input" 
              style={{ width: 'auto', minWidth: '150px', color: 'var(--text-primary, #1e293b)', backgroundColor: 'var(--bg-primary, #ffffff)' }}
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
            >
              <option value="All" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>All Platforms</option>
              <option value="Udemy" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Udemy</option>
              <option value="Coursera" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Coursera</option>
              <option value="YouTube" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>YouTube</option>
              <option value="freeCodeCamp" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>freeCodeCamp</option>
            </select>
            
            <select 
              className="form-input" 
              style={{ width: 'auto', minWidth: '150px', color: 'var(--text-primary, #1e293b)', backgroundColor: 'var(--bg-primary, #ffffff)' }}
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
            >
              <option value="All" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>All Difficulties</option>
              <option value="Beginner" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Beginner</option>
              <option value="Intermediate" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Intermediate</option>
              <option value="Advanced" style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>Advanced</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredCourses.map((course, index) => {
              const isPriority = index < 2; // Highlight top 2 as priority
              return (
                <div 
                  key={index} 
                  className="glass-card"
                  style={{ 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    border: isPriority ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.05)',
                    background: isPriority ? 'linear-gradient(145deg, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0.01) 100%)' : 'var(--glass-bg)'
                  }}
                >
                  {isPriority && (
                    <div style={{ position: 'absolute', top: '-10px', left: '1.5rem', background: 'var(--accent-blue)', color: '#fff', padding: '0.2rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      HIGH PRIORITY
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', marginTop: isPriority ? '0.5rem' : '0' }}>
                      <h3 style={{ fontSize: '1.2rem', color: isPriority ? 'var(--accent-blue)' : 'var(--text-primary)', lineHeight: '1.3' }}>
                        {course.title}
                      </h3>
                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                        {course.platform}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.6rem', borderRadius: '99px', color: 'var(--text-secondary)' }}>
                        Target: <strong style={{ color: 'var(--accent-emerald)', textTransform: 'capitalize' }}>{course.targetSkill}</strong>
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.6rem', borderRadius: '99px', color: course.difficulty === 'Beginner' ? '#eab308' : '#ef4444' }}>
                        {course.difficulty}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.6rem', borderRadius: '99px', color: 'var(--text-secondary)' }}>
                        ⏱ {course.duration}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: course.isFree === 'Free' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: course.isFree === 'Free' ? '1px solid var(--accent-emerald)' : '1px solid #ef4444', padding: '0.2rem 0.6rem', borderRadius: '99px', color: course.isFree === 'Free' ? 'var(--accent-emerald)' : '#fca5a5' }}>
                        {course.isFree}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                      <strong>Why recommend:</strong> {course.reason}
                    </p>
                  </div>

                  <a 
                    href={course.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                    style={{ width: '100%', textAlign: 'center', padding: '0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
                  >
                    View Course
                    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>

                </div>
              );
            })}
            
            {filteredCourses.length === 0 && (
              <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                No courses match your filter criteria. Try changing the platform or difficulty.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRecommendations;
