const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get minimal stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalResumes = await User.countDocuments({ 'resume.fileName': { $exists: true, $ne: null } });
    const totalParsedResumes = await User.countDocuments({ 'skills.0': { $exists: true } });
    
    res.json({
      totalUsers,
      totalResumes,
      totalParsedResumes
    });
  } catch (error) {
    console.error(`Admin Stats Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching admin stats' });
  }
});

// @desc    Get all users for admin dashboard
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('_id name email role createdAt resume.fileName resume.uploadedAt skills')
      .sort({ createdAt: -1 });
    
    // Format response safely without exposing raw objects directly
    const formattedUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      hasResume: !!(u.resume && u.resume.fileName),
      fileName: u.resume?.fileName || null,
      uploadedAt: u.resume?.uploadedAt || null,
      isParsed: !!(u.skills && u.skills.length > 0)
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(`Admin Users Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalResumes = await User.countDocuments({ 'resume.fileName': { $exists: true, $ne: null } });
    const parsedResumeCount = await User.countDocuments({ 'skills.0': { $exists: true } });
    
    // Aggregate top skills
    const topSkillsResult = await User.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: { $toLower: "$skills" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const topSkills = topSkillsResult.map(s => ({ skill: s._id, count: s.count }));

    // Aggregate ATS stats
    const atsStatsResult = await User.aggregate([
      { $match: { "analytics.atsScore": { $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: "$analytics.atsScore" }, count: { $sum: 1 } } }
    ]);
    
    let averageATSScore = null;
    let usersWithATSAnalysis = 0;
    
    if (atsStatsResult.length > 0) {
      averageATSScore = Math.round(atsStatsResult[0].avgScore);
      usersWithATSAnalysis = atsStatsResult[0].count;
    }
    // Aggregate Recommendation Stats
    const recStatsResult = await User.aggregate([
      { 
        $group: { 
          _id: null, 
          careerCount: { $sum: "$analytics.careerRecCount" }, 
          jobCount: { $sum: "$analytics.jobRecCount" }, 
          courseCount: { $sum: "$analytics.courseRecCount" } 
        } 
      }
    ]);
    
    let careerRecommendationCount = 0;
    let jobRecommendationCount = 0;
    let courseRecommendationCount = 0;
    
    if (recStatsResult.length > 0) {
      careerRecommendationCount = recStatsResult[0].careerCount || 0;
      jobRecommendationCount = recStatsResult[0].jobCount || 0;
      courseRecommendationCount = recStatsResult[0].courseCount || 0;
    }
    
    res.json({
      totalUsers,
      totalResumes,
      parsedResumeCount,
      topSkills,
      averageATSScore,
      usersWithATSAnalysis,
      careerRecommendationCount,
      jobRecommendationCount,
      courseRecommendationCount
    });
  } catch (error) {
    console.error(`Admin Analytics Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
});

// @desc    Get platform activity log
// @route   GET /api/admin/activity
// @access  Private/Admin
router.get('/activity', protect, isAdmin, async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    console.error(`Admin Activity Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching activity log' });
  }
});

module.exports = router;
