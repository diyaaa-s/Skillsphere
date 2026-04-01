const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

// ===== GET /api/users — list all users =====
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ rating: -1, exchanges: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      total,
      users: users.map(u => u.toPublicJSON())
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ===== GET /api/users/:id — user profile =====
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Get their skills
    const skills = await Skill.find({ user: req.params.id, isActive: true });

    res.json({
      success: true,
      user: user.toPublicJSON(),
      skills
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
