const express = require('express');
const router = express.Router();
const db = require('../services/mockFirebase');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/admin', (req, res) => {
  const { username, password } = req.body;

  // Simple hardcoded admin credentials
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      user: {
        id: 'admin_user_001',
        name: 'Administrator',
        email: 'admin@votepath.ai',
        role: 'admin',
        token: 'admin-secret-token', // Dummy token for simple validation
        picture: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff'
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
});

router.get('/admin/data', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }

  res.json({
    success: true,
    data: {
      users: db.collections.users,
      votes: db.collections.votes,
      feedback: db.collections.feedback.reverse()
    }
  });
});

module.exports = router;
