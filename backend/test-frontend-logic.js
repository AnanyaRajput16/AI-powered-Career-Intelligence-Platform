const courseDB = {
  'react': [
    { title: 'React - The Complete Guide', platform: 'Udemy', difficulty: 'Intermediate', duration: '40 Hours', isFree: 'Paid', link: 'https://www.udemy.com', reason: 'Industry standard course for mastering React and Hooks.' },
  ],
  'node.js': [
    { title: 'NodeJS - The Complete Guide', platform: 'Udemy', difficulty: 'Intermediate', duration: '35 Hours', isFree: 'Paid', link: 'https://www.udemy.com', reason: 'Deep dive into Express, REST APIs, and backend concepts.' },
  ],
  'python': [
    { title: 'Python for Everybody', platform: 'Coursera', difficulty: 'Beginner', duration: '30 Hours', isFree: 'Free', link: 'https://coursera.org', reason: 'Best university-backed Python introduction by Univ of Michigan.' },
  ],
  'aws': [
    { title: 'AWS Certified Solutions Architect', platform: 'Udemy', difficulty: 'Intermediate', duration: '25 Hours', isFree: 'Paid', link: 'https://www.udemy.com', reason: 'Essential certification prep for cloud deployment.' },
  ],
  'docker': [
    { title: 'Docker Mastery', platform: 'Udemy', difficulty: 'Intermediate', duration: '20 Hours', isFree: 'Paid', link: 'https://www.udemy.com', reason: 'Complete guide to containers and Docker Compose.' },
  ],
  'sql': [
    { title: 'The Complete SQL Bootcamp', platform: 'Udemy', difficulty: 'Beginner', duration: '9 Hours', isFree: 'Paid', link: 'https://www.udemy.com', reason: 'Master complex queries and database design.' },
  ]
};

const getFallbackCourses = (skill) => [
  { 
    title: `Introduction to ${skill.toUpperCase()}`, 
    platform: 'Coursera', 
    difficulty: 'Beginner', 
    duration: '10 Hours', 
    isFree: 'Free', 
    link: 'https://coursera.org', 
    reason: `Build foundational knowledge of ${skill} required by ATS.` 
  }
];

async function test() {
  try {
    const ts = Date.now();
    const regRes = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${ts}@example.com`,
        password: 'password123'
      })
    });
    
    if (!regRes.ok) {
        throw new Error('Register failed');
    }
    const token = (await regRes.json()).token;

    const analyzeRes = await fetch('http://localhost:5000/api/ats/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        jobDescription: 'We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of data structures and experience building web applications.'
      })
    });
    
    if (!analyzeRes.ok) {
        throw new Error(`API failed with status ${analyzeRes.status}`);
    }

    const responseData = await analyzeRes.json();
    
    // Simulate CourseRecommendations.jsx try block
    try {
      const missingSkills = responseData.missingSkills || [];
      let generatedCourses = [];
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
      console.log('Successfully generated courses:', generatedCourses.length);
      console.dir(generatedCourses, { depth: null });
    } catch (err) {
      console.error('CRASH IN PROCESSING LOGIC:', err);
    }
    
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
