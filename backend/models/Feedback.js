const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
