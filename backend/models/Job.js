const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  type: {
    type: String,
    required: [true, 'Please add a job type (e.g., Remote, On-site, Hybrid)']
  },
  experience: {
    type: String,
    required: [true, 'Please add experience requirements']
  },
  requiredSkills: {
    type: [String],
    default: [],
    required: true
  },
  salary: {
    type: String,
    required: [true, 'Please add a salary range']
  },
  applyLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
