const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

async function checkUsers() {
  await connectDB();
  const users = await User.find({});
  console.log(`Found ${users.length} users`);
  for (const user of users) {
    console.log(`User ${user.email} skills type: ${typeof user.skills}, isArray: ${Array.isArray(user.skills)}, length: ${user.skills?.length}`);
    if (user.skills) {
      console.log(`Skills:`, user.skills);
    }
  }
  process.exit(0);
}

checkUsers();
