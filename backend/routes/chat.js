const express = require('express');
const xss = require('xss');
const { body, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const { getChatResponse } = require('../services/aiService');

const router = express.Router();
// Cache for 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// Input validation middleware
const validateChatInput = [
  body('message').isString().trim().notEmpty().withMessage('Message is required'),
  body('history').optional().isArray().withMessage('History must be an array'),
];

router.post('/', validateChatInput, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userMessage = xss(req.body.message);
    const history = req.body.history || [];

    // Cache key based on message and history length
    const cacheKey = `${userMessage}_${history.length}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      return res.json({ reply: cachedResponse });
    }

    const replyText = await getChatResponse(userMessage, history);
    const reply = replyText || "I'm sorry, I couldn't process that right now. Please try again.";
    
    cache.set(cacheKey, reply);
    res.json({ reply });
  } catch (error) {
    next(error); // Pass to global error handler
  }
});

module.exports = router;
