const mongoose = require('mongoose');
const User = require('./models/User');
const { analyzeResume } = require('./controllers/atsController');
const connectDB = require('./config/db');
require('dotenv').config();

async function simulate() {
  await connectDB();
  const user = await User.findOne({ email: '2k23cs2313737@gmail.com' });
  const req = {
    user: { id: user._id },
    body: { jobDescription: 'We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of Data Structures and experience building web applications.' }
  };
  
  let result;
  const res = {
    json: (data) => { result = data; },
    status: () => res
  };
  
  await analyzeResume(req, res);
  
  console.log("API RESPONSE:");
  console.log("matchingSkills:", result.matchingSkills);
  console.log("missingSkills:", result.missingSkills);
  console.log("score:", result.score);
  
  const courses = result.missingSkills.slice(0,5).map(s => ({ title: s }));
  console.log("UI CONDITION TRIGGERED:");
  if (courses.length === 0 && result.matchingSkills.length === 0 && result.missingSkills.length === 0) {
    console.log("No recognized skills found");
  } else if (courses.length === 0 && result.matchingSkills.length > 0 && result.missingSkills.length === 0) {
    console.log("No Skill Gaps Detected!");
  } else if (courses.length > 0) {
    console.log("Course Grid");
  } else {
    console.log("NONE OF THE ABOVE! (courses.length=" + courses.length + ", matching=" + result.matchingSkills.length + ", missing=" + result.missingSkills.length + ")");
  }
  
  process.exit(0);
}

simulate();
