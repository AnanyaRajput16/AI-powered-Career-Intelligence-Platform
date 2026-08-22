const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user email already exists (duplicate email check)
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Email address already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      try {
        await Activity.create({ user: user._id, action: 'User Registered' });
      } catch (err) {
        console.error('Activity Log Error:', err.message);
      }
      
      try {
        const Notification = require('../models/Notification');
        await Notification.create({
          user: user._id,
          message: 'Welcome to the Career Intelligence Platform! Start by uploading your resume.',
          type: 'info'
        });
      } catch (err) {
        console.error('Notification Log Error:', err.message);
      }

      return res.status(201).json({
        message: 'User registered successfully',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error(`Register Error: ${error.message}`);
    return res.status(500).json({ message: 'Server registration error. Please try again.' });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    // Match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    // Login successful
    try {
      await Activity.create({ user: user._id, action: 'User Logged In' });
    } catch (err) {
      console.error('Activity Log Error:', err.message);
    }
    return res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    return res.status(500).json({ message: 'Server login error. Please try again.' });
  }
};

// @desc    Get user profile data (Protected)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error(`Profile Error: ${error.message}`);
    res.status(500).json({ message: 'Server profile fetch error' });
  }
};

// @desc    Update user profile data (Protected)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.dateOfBirth = req.body.dateOfBirth !== undefined ? req.body.dateOfBirth : user.dateOfBirth;
      user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
      user.collegeName = req.body.collegeName !== undefined ? req.body.collegeName : user.collegeName;
      user.degree = req.body.degree !== undefined ? req.body.degree : user.degree;
      user.branch = req.body.branch !== undefined ? req.body.branch : user.branch;
      user.passingYear = req.body.passingYear !== undefined ? req.body.passingYear : user.passingYear;
      user.cgpa = req.body.cgpa !== undefined ? req.body.cgpa : user.cgpa;
      user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
      user.certifications = req.body.certifications !== undefined ? req.body.certifications : user.certifications;
      user.projects = req.body.projects !== undefined ? req.body.projects : user.projects;
      user.workExperience = req.body.workExperience !== undefined ? req.body.workExperience : user.workExperience;
      user.careerInterests = req.body.careerInterests !== undefined ? req.body.careerInterests : user.careerInterests;
      user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
      user.github = req.body.github !== undefined ? req.body.github : user.github;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.aboutMe = req.body.aboutMe !== undefined ? req.body.aboutMe : user.aboutMe;

      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        collegeName: updatedUser.collegeName,
        degree: updatedUser.degree,
        branch: updatedUser.branch,
        passingYear: updatedUser.passingYear,
        cgpa: updatedUser.cgpa,
        skills: updatedUser.skills,
        certifications: updatedUser.certifications,
        projects: updatedUser.projects,
        workExperience: updatedUser.workExperience,
        careerInterests: updatedUser.careerInterests,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        location: updatedUser.location,
        aboutMe: updatedUser.aboutMe,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      });
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error(`Update Profile Error: ${error.message}`);
    res.status(500).json({ message: 'Server profile update error' });
  }
};

// @desc    Upload user resume
// @route   POST /api/users/resume
// @access  Private
const uploadResume = async (req, res) => {
  try {
    const { fileName, fileType, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ message: 'File data is missing' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resume = {
      fileName,
      fileType,
      fileData,
      uploadedAt: new Date()
    };

    await user.save();
    
    try {
      await Activity.create({ user: user._id, action: 'Resume Uploaded' });
    } catch (err) {
      console.error('Activity Log Error:', err.message);
    }
    
    res.json({ message: 'Resume uploaded successfully', resume: { fileName: user.resume.fileName, fileType: user.resume.fileType, uploadedAt: user.resume.uploadedAt } });
  } catch (error) {
    console.error(`Upload Resume Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during resume upload' });
  }
};

// @desc    Get user resume file data
// @route   GET /api/users/resume/download
// @access  Private
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+resume.fileData');
    if (!user || !user.resume || !user.resume.fileData) {
      return res.status(404).json({ message: 'No resume found' });
    }
    res.json({
      fileName: user.resume.fileName,
      fileType: user.resume.fileType,
      fileData: user.resume.fileData
    });
  } catch (error) {
    console.error(`Get Resume Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching resume' });
  }
};

// @desc    Delete user resume
// @route   DELETE /api/users/resume
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resume = undefined;
    await user.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(`Delete Resume Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during resume deletion' });
  }
};

// @desc    Track recommendation analytics
// @route   POST /api/users/analytics/track
// @access  Private
const trackAnalytics = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) return res.status(400).json({ message: 'Analytics type is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.analytics = user.analytics || {};
    
    if (type === 'career') user.analytics.careerRecCount = (user.analytics.careerRecCount || 0) + 1;
    else if (type === 'job') user.analytics.jobRecCount = (user.analytics.jobRecCount || 0) + 1;
    else if (type === 'course') user.analytics.courseRecCount = (user.analytics.courseRecCount || 0) + 1;
    
    await user.save();
    res.json({ message: 'Analytics tracked successfully' });
  } catch (error) {
    console.error(`Track Analytics Error: ${error.message}`);
    res.status(500).json({ message: 'Server error during analytics tracking' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadResume,
  getResume,
  deleteResume,
  trackAnalytics
};
