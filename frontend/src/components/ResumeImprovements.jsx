import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ResumeImprovements = () => {
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  const analyzeResumeHeuristics = (atsResult) => {
    let score = 100;
    const items = {
      summary: [],
      techSkills: [],
      softSkills: [],
      keywords: [],
      projects: [],
      experience: [],
      education: [],
      atsTips: []
    };

    // 1. Summary Improvements
    const summary = user.aboutMe || '';
    if (!summary || summary.length < 50) {
      items.summary.push({ text: 'Your professional summary is missing or too brief. Expand it to 3-4 impactful sentences.', priority: 'High' });
      score -= 10;
    } else if (!/\\d/.test(summary)) {
      items.summary.push({ text: 'Your summary lacks numbers or metrics. Try adding years of experience or quantified achievements.', priority: 'Medium' });
      score -= 5;
    } else {
      items.summary.push({ text: 'Your summary length and metric usage looks good!', priority: 'Low' });
    }

    // 2. Technical Skills
    if (atsResult.missingSkills.length > 0) {
      items.techSkills.push({ text: `You are missing critical technical skills required for this role: ${atsResult.missingSkills.slice(0, 5).join(', ')}.`, priority: 'High' });
      score -= Math.min(15, atsResult.missingSkills.length * 3);
    } else {
      items.techSkills.push({ text: 'Your technical skills perfectly match this job description.', priority: 'Low' });
    }

    // 3. Soft Skills
    const fullProfileText = JSON.stringify(user).toLowerCase();
    const commonSoftSkills = ['communication', 'leadership', 'teamwork', 'agile', 'problem solving', 'collaboration'];
    const missingSoft = commonSoftSkills.filter(sk => !fullProfileText.includes(sk));
    if (missingSoft.length > 3) {
      items.softSkills.push({ text: `Consider adding standard soft skill keywords like: ${missingSoft.slice(0, 3).join(', ')}.`, priority: 'Medium' });
      score -= 5;
    } else {
      items.softSkills.push({ text: 'Good balance of soft skill keywords detected.', priority: 'Low' });
    }

    // 4. Missing Keywords
    if (atsResult.missingKeywords && atsResult.missingKeywords.length > 0) {
      items.keywords.push({ text: `Missing contextual ATS keywords: ${atsResult.missingKeywords.slice(0, 6).join(', ')}.`, priority: 'Medium' });
      score -= 5;
    } else {
      items.keywords.push({ text: 'Contextual keyword density is excellent.', priority: 'Low' });
    }

    // 5. Projects
    const projects = user.projects || [];
    if (projects.length === 0) {
      items.projects.push({ text: 'You have no projects listed. Add at least 2 relevant technical projects.', priority: 'High' });
      score -= 15;
    } else {
      const projText = projects.join(' ').toLowerCase();
      if (!projText.includes('github') && !projText.includes('http')) {
        items.projects.push({ text: 'Your projects lack repository links or live URLs. Add links to prove your work.', priority: 'Medium' });
        score -= 5;
      }
      if (projects.length < 2) {
        items.projects.push({ text: 'Consider adding more projects. A minimum of 2-3 is recommended.', priority: 'Low' });
      }
    }

    // 6. Experience
    const exp = user.workExperience || [];
    if (exp.length === 0) {
      items.experience.push({ text: 'No work experience found. If you are a fresher, add internships or freelance work.', priority: 'High' });
      score -= 15;
    } else {
      const expText = exp.join(' ');
      if (expText.length < 150) {
        items.experience.push({ text: 'Your experience descriptions are very brief. Use the XYZ formula to flesh them out.', priority: 'Medium' });
        score -= 5;
      }
      if (!/\\d/.test(expText)) {
        items.experience.push({ text: 'Your experience bullet points lack quantifiable numbers (e.g. "Increased performance by 20%").', priority: 'High' });
        score -= 10;
      }
    }

    // 7. Education
    const edu = user.college || '';
    if (!edu || edu.length < 5) {
      items.education.push({ text: 'Education details are missing. Add your degree, major, and university name.', priority: 'High' });
      score -= 10;
    } else {
      if (!edu.toLowerCase().includes('university') && !edu.toLowerCase().includes('college') && !edu.toLowerCase().includes('institute')) {
        items.education.push({ text: 'Ensure your institution name is fully spelled out.', priority: 'Low' });
      }
    }

    // 8. ATS Tips
    items.atsTips.push({ text: 'Ensure your raw uploaded resume avoids multi-column layouts which break ATS parsers.', priority: 'Medium' });
    items.atsTips.push({ text: 'Save and upload your final resume strictly as a PDF format.', priority: 'Low' });

    // Final bounded score
    if (score < 20) score = 20;
    if (score > 99 && atsResult.missingSkills.length > 0) score = 95;

    return { score, items };
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a target job description to contextualize the suggestions.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Reuse ATS analysis logic to base suggestions upon
      const response = await axios.post('/api/ats/analyze', { jobDescription });
      const analysisData = analyzeResumeHeuristics(response.data);
      setSuggestions(analysisData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error generating improvement suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = (priority) => {
    const colors = {
      'High': { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', text: '#fca5a5' },
      'Medium': { bg: 'rgba(234, 179, 8, 0.1)', border: '#eab308', text: '#fde047' },
      'Low': { bg: 'rgba(16, 185, 129, 0.1)', border: 'var(--accent-emerald)', text: 'var(--accent-emerald)' }
    };
    const c = colors[priority];
    return (
      <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {priority} Priority
      </span>
    );
  };

  const renderSection = (title, itemsArray) => (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: itemsArray.some(i => i.priority === 'High') ? '3px solid #ef4444' : '1px solid rgba(255,255,255,0.05)' }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {itemsArray.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ marginTop: '0.1rem' }}>
              {renderBadge(item.priority)}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4', margin: 0, flexGrow: 1 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="resume-improvements-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Resume Improvement Suggestions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Actionable advice based on your parsed profile, skill gaps, and ATS analysis.</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="form-input"
            rows="4"
            placeholder="Paste a job description to anchor the suggestions against a specific role..."
            style={{ width: '100%', resize: 'vertical', minHeight: '100px' }}
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          className="btn btn-primary"
          disabled={loading || !user}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Running AI Diagnostics...' : 'Generate Improvement Report'}
        </button>
      </div>

      {suggestions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
          
          {/* Quality Score Hero */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', background: 'linear-gradient(145deg, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0.2) 100%)' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Overall Resume Quality Score</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Based on section completeness, keyword density, and quantifiable achievements.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: suggestions.score >= 80 ? 'var(--accent-emerald)' : suggestions.score >= 60 ? '#eab308' : '#ef4444' }}>
                 {suggestions.score}%
               </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {renderSection('Resume Summary Improvements', suggestions.items.summary)}
            {renderSection('Missing Technical Skills', suggestions.items.techSkills)}
            {renderSection('Missing Soft Skills', suggestions.items.softSkills)}
            {renderSection('Missing Keywords', suggestions.items.keywords)}
            {renderSection('Project Improvement Suggestions', suggestions.items.projects)}
            {renderSection('Experience Improvement Suggestions', suggestions.items.experience)}
            {renderSection('Education Improvement Suggestions', suggestions.items.education)}
            {renderSection('ATS Optimization Tips', suggestions.items.atsTips)}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ResumeImprovements;
