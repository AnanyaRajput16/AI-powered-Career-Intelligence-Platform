const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const Feedback = require('../models/Feedback');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private/Admin
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error(`Get Feedback Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
});

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      subject,
      message
    });

    try {
      const Activity = require('../models/Activity');
      await Activity.create({ user: req.user._id, action: 'Feedback Submitted' });
    } catch (err) {
      console.error('Activity Log Error:', err.message);
    }
    
    try {
      const Notification = require('../models/Notification');
      await Notification.create({
        user: req.user._id,
        message: 'Your feedback has been successfully submitted and received by our team.',
        type: 'success'
      });
    } catch (err) {
      console.error('Notification Log Error:', err.message);
    }

    res.status(201).json(feedback);
  } catch (error) {
    console.error(`Create Feedback Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
});

module.exports = router;
