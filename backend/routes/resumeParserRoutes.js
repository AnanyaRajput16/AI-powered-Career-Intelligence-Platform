const express = require('express');
const router = express.Router();
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { protect } = require('../middleware/authMiddleware');

const extractResumeData = (text) => {
  const data = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    education: '',
    skills: '',
    certifications: '',
    projects: '',
    workExperience: ''
  };

  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  if (emailMatch) data.email = emailMatch[0];

  const phoneMatch = text.match(/(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) data.phone = phoneMatch[0];

  const sectionKeywords = {
    summary: ['summary', 'professional summary', 'profile', 'about', 'about me', 'executive summary', 'objective', 'career objective'],
    education: ['education', 'academic background', 'academic qualifications', 'educational background', 'academics'],
    skills: ['skills', 'technical skills', 'core skills', 'key skills', 'competencies', 'technologies', 'it skills', 'proficiencies'],
    certifications: ['certifications', 'certification', 'certificates', 'professional certifications', 'licenses certifications', 'licenses and certifications', 'achievements', 'awards'],
    workExperience: ['work experience', 'experience', 'professional experience', 'employment history', 'career history', 'work history', 'employment', 'internship', 'internships'],
    projects: ['projects', 'academic projects', 'personal projects', 'key projects', 'technical projects']
  };
  
  const lines = text.split('\n');
  let currentSection = null;
  let sectionContent = {
    summary: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    workExperience: []
  };

  for (let line of lines) {
    const rawLine = line.trim().toLowerCase();
    
    // Normalize line by keeping only letters and spaces to safely match headers regardless of bullets, numbers, or symbols
    const normalizedLine = rawLine
    .replace(/[^a-z& ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
    
    let isHeader = false;
    
    // Detect section headers dynamically independent of layout order
    for (const [sectionKey, keywords] of Object.entries(sectionKeywords)) {
      const wordCount = normalizedLine.split(' ').filter(Boolean).length;
      if (
        wordCount > 0 && wordCount <= 4 &&
        keywords.some(kw => 
          normalizedLine === kw || 
          normalizedLine === `${kw}s` || 
          (normalizedLine.includes(kw) && wordCount <= 3)
        )
      ) {
        currentSection = sectionKey;
        isHeader = true;
        break;
      }
    }
    
    // Append content to the currently active section
    if (!isHeader && currentSection && line.trim()) {
      sectionContent[currentSection].push(line.trim());
    }
    
    // Guess name from the first few non-empty lines (before any section is found)
    if (!data.name && !currentSection && line.trim().length > 1 && line.trim().split(' ').length <= 4 && !rawLine.includes('resume') && !rawLine.includes('cv') && !emailMatch?.includes(line.trim()) && !phoneMatch?.includes(line.trim())) {
      data.name = line.trim();
    }
  }

  data.summary = sectionContent.summary.join('\n');
  data.education = sectionContent.education.join('\n');
  
  // Education extraction heuristics
  data.educationDetails = {
    collegeName: '',
    degree: '',
    branch: '',
    passingYear: '',
    cgpa: ''
  };
  
  const eduText = data.education;
  
  // Degree
  const degreeMatch = eduText.match(/(B\.?Tech|M\.?Tech|B\.?E\.?|B\.?Sc|M\.?Sc|B\.?C\.?A|M\.?C\.?A|B\.?B\.?A|M\.?B\.?A|Bachelor(?:'s)?|Master(?:'s)?|Ph\.?D)/i);
  if (degreeMatch) data.educationDetails.degree = degreeMatch[0];
  
  // Branch
  const branchMatch = eduText.match(/(Computer Science|Information Technology|Electronics|Electrical|Mechanical|Civil|Software Engineering|Data Science|Artificial Intelligence|Machine Learning|CSE|IT|ECE|EEE)/i);
  if (branchMatch) data.educationDetails.branch = branchMatch[0];
  
  // College/University
  const collegeMatch = eduText.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*\s(?:College|University|Institute|Academy|School)(?:\sof\s[A-Z][a-z]+)*)/);
  if (collegeMatch) data.educationDetails.collegeName = collegeMatch[0];
  
  // Passing Year
  const yearMatch = eduText.match(/(?:19|20)\d{2}/);
  if (yearMatch) data.educationDetails.passingYear = yearMatch[0];
  
  // CGPA / Percentage
  const cgpaMatch = eduText.match(/(\b\d{1,2}\.\d{1,2}\b|\b\d{2,3}(?:\.\d{1,2})?%)/);
  if (cgpaMatch) data.educationDetails.cgpa = cgpaMatch[0];

  data.skills = sectionContent.skills.join(', ');
  data.certifications = sectionContent.certifications
    .join('\n')
    .replace(/\s{2,}/g, '\n');
  data.projects = sectionContent.projects.join('\n');
  data.workExperience = sectionContent.workExperience.join('\n');

  return data;
};

// @desc    Parse uploaded resume base64 string
// @route   POST /api/resume/parse
// @access  Private
router.post('/parse', protect, async (req, res) => {
  try {
    const { fileData, fileType } = req.body;
    if (!fileData) return res.status(400).json({ message: 'No file data provided' });

    // Extract base64 part
    const base64Data = fileData.split(',')[1] || fileData;
    const buffer = Buffer.from(base64Data, 'base64');
    let extractedText = '';

    if (fileType.includes('pdf')) {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (fileType.includes('word') || fileType.includes('docx')) {
      const docxData = await mammoth.extractRawText({ buffer });
      extractedText = docxData.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file type for parsing. Use PDF or DOCX.' });
    }


    const parsedData = extractResumeData(extractedText);
    
    try {
      const Activity = require('../models/Activity');
      await Activity.create({ user: req.user._id, action: 'Resume Parsed' });
    } catch (err) {
      console.error('Activity Log Error:', err.message);
    }

    res.json({ message: 'Resume parsed successfully', data: parsedData });
  } catch (error) {
    console.error(`Parse Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during parsing' });
  }
});

module.exports = router;
