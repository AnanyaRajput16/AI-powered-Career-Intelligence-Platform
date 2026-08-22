const mongoose = require('mongoose');
const User = require('./models/User');
const { analyzeResume } = require('./controllers/atsController');
const connectDB = require('./config/db');
require('dotenv').config();

async function checkAllUsers() {
  await connectDB();
  const users = await User.find({});
  const jd = 'We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of Data Structures and experience building web applications.';
  
  for (const user of users) {
    const req = {
      user: { id: user._id },
      body: { jobDescription: jd }
    };
    
    let result = null;
    const res = {
      json: function(data) { result = data; },
      status: function() { return this; }
    };
    
    await analyzeResume(req, res);
    if (result) {
      console.log(`User: ${user.email}`);
      console.log(`  Matching:`, result.matchingSkills);
      console.log(`  Missing:`, result.missingSkills);
    }
  }
  process.exit(0);
}

checkAllUsers();
