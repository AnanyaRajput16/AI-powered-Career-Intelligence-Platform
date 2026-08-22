const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = process.argv[2];
    if (!email) {
      console.log('\n❌ Please provide an email address.');
      console.log('Usage: node makeAdmin.js <user-email>');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`\n❌ User not found with email: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`\n✅ Successfully granted ADMIN role to: ${email}`);
    console.log('You can now log out and log back in to access the Admin Dashboard.\n');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

makeAdmin();
