const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

async function inspectSkills() {
  await connectDB();
  const user = await User.findOne({ email: '2k23cs2313737@gmail.com' });
  const userSkillsLower = user.skills.map(s => s.toLowerCase());
  console.log("userSkillsLower:", JSON.stringify(userSkillsLower));
  
  const skill = "django";
  const matching = userSkillsLower.some(us => us.includes(skill) || skill.includes(us));
  console.log("Does it match django?", matching);
  
  if (matching) {
     const matchingUs = userSkillsLower.find(us => us.includes(skill) || skill.includes(us));
     console.log("Matched because of:", matchingUs);
  }
  
  process.exit(0);
}

inspectSkills();
