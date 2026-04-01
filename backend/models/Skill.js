const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Skill title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['tech', 'creative', 'music', 'language', 'fitness', 'business', 'other']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  lookingFor: {
    type: String,
    required: [true, 'Please specify what skill you want in exchange'],
    trim: true
  },
  tags: [{ type: String, trim: true }],
  availability: {
    type: String,
    enum: ['weekdays', 'weekends', 'evenings', 'flexible'],
    default: 'flexible'
  },
  format: {
    type: String,
    enum: ['online', 'in-person', 'both'],
    default: 'both'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  requests: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ===== TEXT INDEX for search =====
skillSchema.index({ title: 'text', description: 'text', tags: 'text', lookingFor: 'text' });
skillSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Skill', skillSchema);
