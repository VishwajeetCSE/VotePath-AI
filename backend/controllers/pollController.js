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
    const { partyId, state, name, mobile, age } = req.body;
    
    // Check if user already voted based on mobile number
    const votesSnapshot = await db.collection('votes').get();
    const hasVoted = votesSnapshot.docs.some(doc => doc.data().mobile === mobile);
    
    if (hasVoted) {
      return res.status(429).json({ success: false, message: 'This mobile number has already cast a vote.' });
    }

    // Record the vote
    await db.collection('votes').add({
      name: xss(name),
      mobile: xss(mobile),
      age: parseInt(age, 10),
      partyId: xss(partyId),
      state: xss(state || 'Unknown'),
      timestamp: new Date().toISOString()
    });

    // Increment party tally
    const success = await db.incrementPartyVote(xss(partyId), xss(state || 'Unknown'));

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
