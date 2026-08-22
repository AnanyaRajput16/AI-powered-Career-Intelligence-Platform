const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeResume } = require('../controllers/atsController');

// @route   POST /api/ats/analyze
// @desc    Analyze user resume against a Job Description
// @access  Private
router.post('/analyze', protect, analyzeResume);

module.exports = router;
