const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const pollController = require('../controllers/pollController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limiting: strictly 1 vote per IP every hour to prevent spamming
const voteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Increased slightly since we verify by user ID now
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Validation Middleware
const validateVoteInput = [
  body('partyId').isString().trim().notEmpty().withMessage('Party selection is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

router.get('/standings', pollController.getPollResults);
router.get('/candidates', pollController.getCandidates);
router.post('/vote', requireAuth, voteLimiter, validateVoteInput, pollController.submitVote);

module.exports = router;
