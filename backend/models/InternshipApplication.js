const mongoose = require('mongoose');

const InternshipApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status: { 
    type: String, 
    enum: ['Saved', 'Applied', 'Interview', 'Selected', 'Rejected', 'Withdrawn'],
    default: 'Saved'
  },
  appliedDate: { type: Date },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('InternshipApplication', InternshipApplicationSchema);