const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  getUserApplications,
  saveOrApplyInternship,
  updateApplication,
  getInternshipStats
} = require('../controllers/internshipController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/').get(protect, getInternships);
router.route('/applications/me').get(protect, getUserApplications);
router.route('/stats/me').get(protect, getInternshipStats);
router.route('/:id').get(protect, getInternshipById);
router.route('/:id/apply').post(protect, saveOrApplyInternship);
router.route('/applications/:id').put(protect, updateApplication);

module.exports = router;