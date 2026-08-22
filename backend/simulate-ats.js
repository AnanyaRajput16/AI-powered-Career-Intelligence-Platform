const mongoose = require('mongoose');
const User = require('./models/User');
const { analyzeResume } = require('./controllers/atsController');
const connectDB = require('./config/db');
require('dotenv').config();

async function simulateATS() {
  await connectDB();
  const req = {
    user: { id: '6681b4382e70e30d087053de' }, // Need the actual ID
    body: {
      jobDescription: 'We are looking for a Python developer with Python, Django, REST APIs, SQL, Git and AWS skills. The candidate should have knowledge of data structures and experience building web applications.'
    }
  };
  
  const user = await User.findOne({ email: '2k23cs2313737@gmail.com' });
  req.user.id = user._id;

  const res = {
    json: function(data) {
      console.log(JSON.stringify(data, null, 2));
    },
    status: function(code) {
      console.log('Status:', code);
      return this;
    }
  };

  await analyzeResume(req, res);
  process.exit(0);
}

simulateATS();
