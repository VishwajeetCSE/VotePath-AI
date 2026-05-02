const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const feedbackController = require('../controllers/feedbackController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limiting: max 5 feedbacks per IP per hour
const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many feedback submissions. Try again later.' }
});

const validateFeedbackInput = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
  body('comment').isString().trim().notEmpty().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

router.post('/', requireAuth, feedbackLimiter, validateFeedbackInput, feedbackController.submitFeedback);
router.get('/', feedbackController.getFeedback);

module.exports = router;
