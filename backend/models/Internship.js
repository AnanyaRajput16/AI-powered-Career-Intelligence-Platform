const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Remote, On-site, Hybrid
  paid: { type: Boolean, default: false },
  stipend: { type: String, default: '' },
  duration: { type: String, default: '' },
  requirements: { type: [String], default: [] },
  description: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  responsibilities: { type: [String], default: [] },
  eligibility: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  postedDate: { type: Date, default: Date.now },
  applyLink: { type: String, default: '' },
  deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Internship', InternshipSchema);