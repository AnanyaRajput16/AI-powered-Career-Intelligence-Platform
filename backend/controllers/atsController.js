const User = require('../models/User');

const commonSkillsDict = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust', 'typescript',
  'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'nosql', 'firebase',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'git', 'github', 'gitlab',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'graphql', 'rest api', 'machine learning', 'ai',
  'data science', 'agile', 'scrum', 'linux', 'unix', 'bash', 'excel', 'tableau', 'power bi'
];

const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ message: 'Job description is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const jdLower = jobDescription.toLowerCase();

    // 1. Skills (40%)
    let matchingSkills = [];
    let missingSkills = [];
    
    const normalizeSkill = (s) => {
      let norm = s.trim().toLowerCase();
      if (norm.includes(':')) norm = norm.split(':').pop().trim();
      if (norm === 'rest apis') return 'rest api';
      if (norm === 'react.js') return 'react';
      if (norm === 'node.js') return 'node';
      if (norm === 'express.js') return 'express';
      if (norm === 'vue.js') return 'vue';
      return norm;
    };

    const jdSkills = [];
    commonSkillsDict.forEach(skill => {
      const norm = normalizeSkill(skill);
      // For skill extraction from text, allow standard variants
      let regexStr = `\\b${norm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`;
      if (norm === 'react') regexStr = `\\breact(?:\\.js)?\\b`;
      if (norm === 'node') regexStr = `\\bnode(?:\\.js)?\\b`;
      if (norm === 'express') regexStr = `\\bexpress(?:\\.js)?\\b`;
      if (norm === 'vue') regexStr = `\\bvue(?:\\.js)?\\b`;
      
      const regex = new RegExp(regexStr, 'i');
      if (regex.test(jobDescription)) {
        jdSkills.push(skill);
      }
    });

    const normalizedUserSkills = user.skills.map(normalizeSkill);

    jdSkills.forEach(skill => {
      const normSkill = normalizeSkill(skill);
      if (normalizedUserSkills.includes(normSkill)) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const totalJdSkills = jdSkills.length > 0 ? jdSkills.length : Math.max(1, matchingSkills.length);
    let skillsScore = Math.min(100, Math.round((matchingSkills.length / totalJdSkills) * 100));
    if (jdSkills.length === 0 && matchingSkills.length > 0) skillsScore = 100;
    if (jdSkills.length === 0 && matchingSkills.length === 0) skillsScore = 50; // Neutral if no tech skills found in JD

    // 2. Experience (25%)
    let experienceScore = 0;
    const userExp = (user.workExperience || []).join(' ').toLowerCase();
    if (userExp.length > 50) experienceScore += 50;
    if (jdLower.includes('experience') || jdLower.includes('years')) {
        if (userExp.length > 100) experienceScore += 50;
    } else {
        if (userExp.length > 0) experienceScore = 100;
    }
    
    // 3. Projects (15%)
    let projectsScore = 0;
    const userProj = (user.projects || []).join(' ').toLowerCase();
    if (userProj.length > 50) projectsScore = 100;
    else if (userProj.length > 10) projectsScore = 50;

    // 4. Education (10%)
    let educationScore = 0;
    const userEdu = (user.aboutMe || '') + ' ' + (user.college || '');
    if (userEdu.toLowerCase().includes('bachelor') || userEdu.toLowerCase().includes('degree') || userEdu.toLowerCase().includes('b.tech') || userEdu.toLowerCase().includes('bsc') || userEdu.toLowerCase().includes('university') || userEdu.length > 20) {
      educationScore = 100;
    } else {
      educationScore = 40;
    }

    // 5. Keywords (10%)
    const jdWords = jdLower.split(/[\s,.\n]+/).filter(w => w.length > 4);
    const uniqueJdWords = [...new Set(jdWords)];
    const userFullText = `${user.name} ${user.aboutMe} ${user.skills.join(' ')} ${userProj} ${userExp}`.toLowerCase();
    
    let matchingKeywords = [];
    let missingKeywords = [];
    
    uniqueJdWords.slice(0, 40).forEach(word => {
      if (commonSkillsDict.includes(word)) return;
      if (userFullText.includes(word)) {
        matchingKeywords.push(word);
      } else {
        missingKeywords.push(word);
      }
    });
    
    const keywordsScore = Math.min(100, Math.round((matchingKeywords.length / (matchingKeywords.length + missingKeywords.length || 1)) * 100));

    // Weighted Formula
    const finalScore = Math.round(
      (skillsScore * 0.40) +
      (experienceScore * 0.25) +
      (projectsScore * 0.15) +
      (educationScore * 0.10) +
      (keywordsScore * 0.10)
    );

    let rating = 'Needs Improvement';
    if (finalScore >= 90) rating = 'Excellent';
    else if (finalScore >= 75) rating = 'Good';
    else if (finalScore >= 60) rating = 'Average';

    // Generate Strengths and Weaknesses
    let strengths = [];
    let weaknesses = [];
    let suggestions = [];

    if (skillsScore >= 80) strengths.push('Strong technical skill alignment with the job description.');
    else {
      weaknesses.push('Missing key technical skills required for this role.');
      if (missingSkills.length > 0) suggestions.push(`Consider learning and adding: ${missingSkills.slice(0, 3).join(', ')}.`);
    }

    if (experienceScore >= 80) strengths.push('Sufficient work experience documented.');
    else {
      weaknesses.push('Work experience section could be expanded.');
      suggestions.push('Detail your past roles, focusing on measurable achievements and keywords from the JD.');
    }

    if (projectsScore >= 80) strengths.push('Good project portfolio demonstrated.');
    else {
      weaknesses.push('Lack of substantial projects.');
      suggestions.push('Add academic or personal projects relevant to the job to boost your ATS score.');
    }

    if (educationScore >= 80) strengths.push('Educational background meets typical standards.');

    if (keywordsScore < 50) {
      weaknesses.push('Low general keyword match.');
      suggestions.push('Integrate more industry-specific terminology from the job description into your experience bullet points.');
    }

    const result = {
      score: finalScore,
      rating,
      categoryScores: {
        skills: skillsScore,
        experience: experienceScore,
        projects: projectsScore,
        education: educationScore,
        keywords: keywordsScore
      },
      matchingSkills,
      missingSkills,
      matchingKeywords: matchingKeywords.slice(0, 15),
      missingKeywords: missingKeywords.slice(0, 15),
      strengths,
      weaknesses,
      suggestions
    };

    try {
      user.analytics = user.analytics || {};
      user.analytics.atsScore = finalScore;
      user.analytics.atsCount = (user.analytics.atsCount || 0) + 1;

      // Persist module specific data
      const { module } = req.body;
      if (module && user.analysisHistory && user.analysisHistory[module]) {
        user.analysisHistory[module] = {
          jobDescription,
          result,
          updatedAt: new Date()
        };
      }

      await user.save();
    } catch (saveErr) {
      console.error('Failed to save ATS analytics:', saveErr.message);
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during ATS analysis' });
  }
};

module.exports = { analyzeResume };
