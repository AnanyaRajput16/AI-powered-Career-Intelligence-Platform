const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, default: '' },
  collegeName: { type: String, default: '' },
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },
  passingYear: { type: String, default: '' },
  cgpa: { type: String, default: '' },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  projects: { type: [String], default: [] },
  workExperience: { type: [String], default: [] },
  careerInterests: { type: [String], default: [] },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  location: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  resume: {
    fileName: { type: String },
    fileType: { type: String },
    fileData: { type: String, select: false },
    uploadedAt: { type: Date }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  analytics: {
    atsScore: { type: Number, default: null },
    atsCount: { type: Number, default: 0 },
    careerRecCount: { type: Number, default: 0 },
    jobRecCount: { type: Number, default: 0 },
    courseRecCount: { type: Number, default: 0 }
  },
  analysisHistory: {
    ats: {
      jobDescription: { type: String, default: '' },
      result: { type: Object, default: null },
      updatedAt: { type: Date, default: null }
    },
    skillGap: {
      jobDescription: { type: String, default: '' },
      result: { type: Object, default: null },
      updatedAt: { type: Date, default: null }
    },
    courseRecommendations: {
      jobDescription: { type: String, default: '' },
      result: { type: Object, default: null },
      updatedAt: { type: Date, default: null }
    },
    resumeImprovements: {
      jobDescription: { type: String, default: '' },
      result: { type: Object, default: null },
      updatedAt: { type: Date, default: null }
    }
  },
  resumeParsingHistory: [{
    fileName: { type: String },
    parsedAt: { type: Date, default: Date.now },
    parsedData: { type: Object }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Custom method on user schema to check if password matches
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
