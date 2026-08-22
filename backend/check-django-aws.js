const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

async function checkSkills() {
  await connectDB();
  const users = await User.find({});
  for (const user of users) {
    const userSkillsLower = user.skills.map(s => s.toLowerCase());
    const hasEmpty = userSkillsLower.includes('');
    const hasSpace = userSkillsLower.includes(' ');
    const hasSingleLetter = userSkillsLower.some(s => s.length === 1);
    
    // Test against 'django' and 'aws'
    const matchDjango = userSkillsLower.some(us => us.includes('django') || 'django'.includes(us));
    const matchAws = userSkillsLower.some(us => us.includes('aws') || 'aws'.includes(us));
    
    if (matchDjango || matchAws) {
       console.log(`User ${user.email} matched django (${matchDjango}) or aws (${matchAws})`);
       if (matchDjango) {
          console.log(`  django matched because of:`, userSkillsLower.find(us => us.includes('django') || 'django'.includes(us)));
       }
       if (matchAws) {
          console.log(`  aws matched because of:`, userSkillsLower.find(us => us.includes('aws') || 'aws'.includes(us)));
       }
    }
  }
  process.exit(0);
}

checkSkills();
