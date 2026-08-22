const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadResume,
  getResume,
  deleteResume,
  trackAnalytics
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Define API routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/resume', protect, uploadResume);
router.get('/resume/download', protect, getResume);
router.delete('/resume', protect, deleteResume);
router.post('/analytics/track', protect, trackAnalytics);

module.exports = router;
