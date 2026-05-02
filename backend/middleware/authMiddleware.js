const { OAuth2Client } = require('google-auth-library');
const db = require('../services/mockFirebase');

const client = new OAuth2Client(); // Client ID is not strictly needed for basic token verification if we accept any valid Google token, but it's recommended.

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Bypass Google Verification for Admin Token
    if (token === 'admin-secret-token') {
      req.user = { id: 'admin_user_001', role: 'admin', name: 'Administrator' };
      return next();
    }
    
    // Verify the Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: token,
      // audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    
    const payload = ticket.getPayload();
    const userId = payload['sub']; // Google user ID
    const email = payload['email'];
    
    // Check if user exists in our DB, if not add them
    if (!db.collections.users.find(u => u.id === userId)) {
      db.collections.users.push({
        id: userId,
        email: email,
        name: payload['name'],
        picture: payload['picture'],
        createdAt: new Date().toISOString()
      });
      db.saveData();
    }

    // Attach user payload to request
    req.user = {
      id: userId,
      email: email,
      name: payload['name'],
      role: 'voter'
    };
    
    next();
  } catch (error) {
    console.error('Error verifying Google auth token:', error);
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

module.exports = { requireAuth };
