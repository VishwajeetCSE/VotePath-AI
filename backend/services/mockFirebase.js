const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'db.json');

const defaultData = {
  feedback: [],
  votes: [],
  users: [], // To store registered users from Google Login
  candidates: [
    { id: '1', name: 'Narendra Modi', party: 'BJP', region: 'Varanasi', description: 'Incumbent Prime Minister of India.' },
    { id: '2', name: 'Rahul Gandhi', party: 'INC', region: 'Wayanad', description: 'Leader of the Indian National Congress.' },
    { id: '3', name: 'Arvind Kejriwal', party: 'AAP', region: 'New Delhi', description: 'Chief Minister of Delhi and AAP convener.' },
    { id: '4', name: 'Mamata Banerjee', party: 'TMC', region: 'West Bengal', description: 'Chief Minister of West Bengal and TMC founder.' }
  ],
  parties: [
    { id: 'bjp', name: 'Bharatiya Janata Party (BJP)', votes: 0 },
    { id: 'inc', name: 'Indian National Congress (INC)', votes: 0 },
    { id: 'aap', name: 'Aam Aadmi Party (AAP)', votes: 0 },
    { id: 'tmc', name: 'Trinamool Congress (TMC)', votes: 0 },
    { id: 'other', name: 'Other / Independent', votes: 0 }
  ]
};

class MockFirebase {
  constructor() {
    this.loadData();
  }

  loadData() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.collections = JSON.parse(raw);
      } catch (e) {
        this.collections = JSON.parse(JSON.stringify(defaultData));
      }
    } else {
      this.collections = JSON.parse(JSON.stringify(defaultData));
      this.saveData();
    }
  }

  saveData() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.collections, null, 2));
  }

  // Simulate Firestore collection reference
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    
    return {
      get: async () => {
        return {
          docs: this.collections[name].map(data => ({
            id: data.id || Math.random().toString(36).substr(2, 9),
            data: () => data
          }))
        };
      },
      add: async (data) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newDoc = { id, ...data, createdAt: new Date().toISOString() };
        this.collections[name].push(newDoc);
        this.saveData();
        return { id };
      },
      doc: (docId) => ({
        get: async () => {
          const doc = this.collections[name].find(d => d.id === docId);
          return {
            exists: !!doc,
            data: () => doc
          };
        },
        update: async (data) => {
          const index = this.collections[name].findIndex(d => d.id === docId);
          if (index !== -1) {
            this.collections[name][index] = { ...this.collections[name][index], ...data };
            this.saveData();
            return true;
          }
          throw new Error('Document not found');
        }
      })
    };
  }

  async incrementPartyVote(partyId, state = 'Unknown') {
    const partyIndex = this.collections.parties.findIndex(p => p.id === partyId);
    if (partyIndex !== -1) {
      this.collections.parties[partyIndex].votes += 1;
      
      // Track state-wise votes
      if (!this.collections.parties[partyIndex].stateVotes) {
        this.collections.parties[partyIndex].stateVotes = {};
      }
      if (!this.collections.parties[partyIndex].stateVotes[state]) {
        this.collections.parties[partyIndex].stateVotes[state] = 0;
      }
      this.collections.parties[partyIndex].stateVotes[state] += 1;
      
      this.saveData();
      return true;
    }
    return false;
  }
}

const db = new MockFirebase();
module.exports = db;
