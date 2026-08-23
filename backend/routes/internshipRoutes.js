const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  getUserApplications,
  saveOrApplyInternship,
  updateApplication,
  getInternshipStats,
  createInternship,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Routes
router.route('/').get(protect, getInternships).post(protect, isAdmin, createInternship);
router.route('/applications/me').get(protect, getUserApplications);
router.route('/stats/me').get(protect, getInternshipStats);
router.route('/:id')
  .get(protect, getInternshipById)
  .put(protect, isAdmin, updateInternship)
  .delete(protect, isAdmin, deleteInternship);
router.route('/:id/apply').post(protect, saveOrApplyInternship);
router.route('/applications/:id').put(protect, updateApplication);

module.exports = router;