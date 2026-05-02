const db = require('../services/mockFirebase');
const NodeCache = require('node-cache');
const xss = require('xss');

// Cache poll results for 30 seconds to handle high traffic efficiently
const pollCache = new NodeCache({ stdTTL: 30 });

exports.getPollResults = async (req, res, next) => {
  try {
    const cachedResults = pollCache.get('poll_standings');
    if (cachedResults) {
      return res.json({ success: true, source: 'cache', data: cachedResults });
    }

    const partiesSnapshot = await db.collection('parties').get();
    const results = partiesSnapshot.docs.map(doc => doc.data());
    
    // Calculate total votes and percentages
    const totalVotes = results.reduce((sum, party) => sum + party.votes, 0);
    const resultsWithPercentages = results.map(party => ({
      ...party,
      percentage: totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(1) : 0
    })).sort((a, b) => b.votes - a.votes); // Sort by highest votes

    pollCache.set('poll_standings', { totalVotes, parties: resultsWithPercentages });

    res.json({ success: true, source: 'db', data: { totalVotes, parties: resultsWithPercentages } });
  } catch (error) {
    next(error);
  }
};

exports.submitVote = async (req, res, next) => {
  try {
    const { partyId } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login with Google.' });
    }

    const userId = req.user.id;
    
    // Check if user already voted based on Google User ID
    const votesSnapshot = await db.collection('votes').get();
    const hasVoted = votesSnapshot.docs.some(doc => doc.data().userId === userId);
    
    if (hasVoted) {
      return res.status(429).json({ success: false, message: 'You have already cast your vote.' });
    }

    // Record the vote
    await db.collection('votes').add({
      userId: userId,
      partyId: xss(partyId),
      timestamp: new Date().toISOString()
    });

    // Increment party tally
    const success = await db.incrementPartyVote(xss(partyId));

    if (!success) {
      return res.status(404).json({ success: false, message: 'Invalid party selection.' });
    }

    // Invalidate cache immediately so next user sees fresh data
    pollCache.del('poll_standings');

    res.json({ success: true, message: 'Your vote has been securely recorded.' });
  } catch (error) {
    next(error);
  }
};

exports.getCandidates = async (req, res, next) => {
  try {
    const candidatesSnapshot = await db.collection('candidates').get();
    const candidates = candidatesSnapshot.docs.map(doc => doc.data());
    res.json({ success: true, data: candidates });
  } catch (error) {
    next(error);
  }
};
