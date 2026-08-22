const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(`Get Jobs Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { title, company, location, type, experience, requiredSkills, salary, applyLink } = req.body;

    if (!title || !company || !location || !type || !experience || !requiredSkills || !salary) {
      return res.status(400).json({ message: 'Please provide all required job fields' });
    }

    if (!Array.isArray(requiredSkills)) {
      return res.status(400).json({ message: 'requiredSkills must be an array of strings' });
    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      experience,
      requiredSkills,
      salary,
      applyLink: applyLink || ''
    });

    try {
      const Activity = require('../models/Activity');
      await Activity.create({ user: req.user._id, action: 'Admin Added Job' });
    } catch (err) {
      console.error('Activity Log Error:', err.message);
    }

    res.status(201).json(job);
  } catch (error) {
    console.error(`Create Job Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while creating job' });
  }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedJob);
  } catch (error) {
    console.error(`Update Job Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating job' });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error(`Delete Job Error: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});

module.exports = router;
