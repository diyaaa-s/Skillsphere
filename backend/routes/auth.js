const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'skillsphere_secret_key_2024';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// Helper: generate token
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ===== POST /api/auth/register =====
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, teach, learn, category, bio, location } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !teach || !learn) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      teach,
      learn,
      category: category || 'other',
      bio: bio || '',
      location: location || ''
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: user.toPublicJSON()
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ===== POST /api/auth/login =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: user.toPublicJSON()
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ===== GET /api/auth/me — protected =====
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
});

// ===== PUT /api/auth/me — update profile =====
router.put('/me', protect, async (req, res) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'bio', 'teach', 'learn', 'category', 'level', 'location'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated!', user: user.toPublicJSON() });

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
