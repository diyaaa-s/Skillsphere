const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  teach: {
    type: String,
    required: [true, 'Please specify what skill you can teach'],
    trim: true
  },
  learn: {
    type: String,
    required: [true, 'Please specify what skill you want to learn'],
    trim: true
  },
  category: {
    type: String,
    enum: ['tech', 'creative', 'music', 'language', 'fitness', 'business', 'other'],
    default: 'other'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  exchanges: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: ''
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github:   { type: String, default: '' },
    twitter:  { type: String, default: '' }
  }
}, {
  timestamps: true
});

// ===== VIRTUAL: Full Name =====
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// ===== PRE-SAVE: Hash Password =====
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ===== METHOD: Compare Password =====
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ===== METHOD: To Public JSON =====
userSchema.methods.toPublicJSON = function() {
  return {
    id:        this._id,
    firstName: this.firstName,
    lastName:  this.lastName,
    fullName:  this.fullName,
    email:     this.email,
    bio:       this.bio,
    teach:     this.teach,
    learn:     this.learn,
    category:  this.category,
    level:     this.level,
    rating:    this.rating,
    exchanges: this.exchanges,
    location:  this.location,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
