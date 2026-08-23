const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');

// @desc    Get all internships with filters
// @route   GET /api/internships
// @access  Private
exports.getInternships = async (req, res) => {
  try {
    const { search, paid, type, location } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requirements: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (paid === 'true') query.paid = true;
    if (paid === 'false') query.paid = false;
    
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    const internships = await Internship.find(query).sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get internship by ID
// @route   GET /api/internships/:id
// @access  Private
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user's internship applications/saved
// @route   GET /api/internships/applications/me
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await InternshipApplication.find({ user: req.user._id })
      .populate('internship')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Save or update internship application status
// @route   POST /api/internships/:id/apply
// @access  Private
exports.saveOrApplyInternship = async (req, res) => {
  try {
    const { status, notes, appliedDate } = req.body;
    const internshipId = req.params.id;
    
    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    
    let application = await InternshipApplication.findOne({ user: req.user._id, internship: internshipId });
    
    if (application) {
      if (status) application.status = status;
      if (notes !== undefined) application.notes = notes;
      if (appliedDate) application.appliedDate = appliedDate;
      await application.save();
    } else {
      application = await InternshipApplication.create({
        user: req.user._id,
        internship: internshipId,
        status: status || 'Saved',
        notes: notes || '',
        appliedDate: appliedDate || null
      });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update specific application
// @route   PUT /api/internships/applications/:id
// @access  Private
exports.updateApplication = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await InternshipApplication.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;
    
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get dashboard statistics for internships
// @route   GET /api/internships/stats/me
// @access  Private
exports.getInternshipStats = async (req, res) => {
  try {
    const applications = await InternshipApplication.find({ user: req.user._id });
    
    const stats = {
      totalSaved: applications.filter(a => a.status === 'Saved').length,
      totalApplied: applications.filter(a => ['Applied', 'Interview', 'Selected', 'Rejected', 'Withdrawn'].includes(a.status)).length,
      interviewing: applications.filter(a => a.status === 'Interview').length,
      offers: applications.filter(a => a.status === 'Selected').length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// @desc    Create an internship
// @route   POST /api/internships
// @access  Private/Admin
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update an internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    res.json({ message: "Internship removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

