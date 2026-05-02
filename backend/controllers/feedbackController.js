const db = require('../services/mockFirebase');
const xss = require('xss');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // Sanitize the comment to prevent Cross-Site Scripting (XSS)
    const sanitizedComment = xss(comment);

    // Save to our Mock Firestore Database
    const result = await db.collection('feedback').add({
      userId: 'anonymous',
      rating: parseInt(rating, 10),
      comment: sanitizedComment,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been recorded securely.',
      feedbackId: result.id
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const feedbackSnapshot = await db.collection('feedback').get();
    const feedback = feedbackSnapshot.docs.map(doc => doc.data());
    
    // Calculate average rating
    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = feedback.length > 0 ? (totalRating / feedback.length).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalReviews: feedback.length,
        averageRating,
        recentFeedback: feedback.slice(-5).reverse() // Send last 5 reviews
      }
    });
  } catch (error) {
    next(error);
  }
};
