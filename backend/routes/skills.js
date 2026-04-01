const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect, optionalAuth } = require('../middleware/auth');

// ===== GET /api/skills — list with search & filter =====
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, level, format, availability, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (level)        query.level = level;
    if (format)       query.format = format;
    if (availability) query.availability = availability;

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Skill.countDocuments(query);
    const skills = await Skill.find(query)
      .populate('user', 'firstName lastName email bio location rating exchanges')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: skills.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      skills
    });

  } catch (err) {
    console.error('Get skills error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ===== GET /api/skills/:id =====
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('user', 'firstName lastName email bio location rating exchanges level');

    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });

    res.json({ success: true, skill });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ===== POST /api/skills — create (protected) =====
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, level, lookingFor, tags, availability, format } = req.body;

    if (!title || !description || !category || !lookingFor) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const skill = await Skill.create({
      user: req.user._id,
      title,
      description,
      category,
      level: level || 'Intermediate',
      lookingFor,
      tags: tags || [],
      availability: availability || 'flexible',
      format: format || 'both'
    });

    await skill.populate('user', 'firstName lastName email');

    res.status(201).json({ success: true, message: 'Skill listed successfully!', skill });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Create skill error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ===== PUT /api/skills/:id =====
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this skill.' });
    }

    const allowedFields = ['title', 'description', 'category', 'level', 'lookingFor', 'tags', 'availability', 'format', 'isActive'];
    allowedFields.forEach(f => { if (req.body[f] !== undefined) skill[f] = req.body[f]; });
    await skill.save();

    res.json({ success: true, message: 'Skill updated!', skill });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ===== DELETE /api/skills/:id =====
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await skill.deleteOne();
    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
