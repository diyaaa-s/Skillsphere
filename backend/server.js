const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsphere';

// ===== MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: false // Allow loading Google Fonts in frontend
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== SERVE STATIC FRONTEND =====
app.use(express.static(path.join(__dirname, '../frontend')));

// ===== DB CONNECTION =====
mongoose.connect(MONGO_URI)
.then(() => console.log('✅ MongoDB connected:', MONGO_URI))
.catch(err => console.error('❌ MongoDB error:', err.message));

// ===== ROUTES =====
const authRoutes  = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const userRoutes  = require('./routes/users');

app.use('/api/auth',   authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/users',  userRoutes);

// ===== HEALTH CHECK — must be BEFORE catch-all =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillSphere API',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ===== CATCH-ALL — SERVE FRONTEND =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ===== START =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SkillSphere server running on http://localhost:${PORT}`);
});

module.exports = app;
