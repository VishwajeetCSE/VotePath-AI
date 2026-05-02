import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info, AlertTriangle, TrendingUp, LogIn, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Poll() {
  const [standings, setStandings] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedState, setSelectedState] = useState('');
  
  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  
  const { user } = useAuth();
  const location = useLocation();

  // Fetch initial standings
  const fetchStandings = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await axios.get(`${apiUrl}/api/polls/standings`);
      if (res.data.success) {
        setStandings(res.data.data.parties);
        setTotalVotes(res.data.data.totalVotes);
      }
    } catch (error) {
      console.error("Failed to fetch poll standings", error);
    }
  }, []);

  useEffect(() => {
    fetchStandings();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStandings, 30000);
    return () => clearInterval(interval);
  }, [fetchStandings]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedParty || !user) return;

    setStatus('loading');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await axios.post(`${apiUrl}/api/polls/vote`, {
        partyId: selectedParty,
        state: selectedState || 'Unknown',
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      setStatus('success');
      setMessage(res.data.message);
      fetchStandings(); // Refresh data immediately
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to submit vote. Please try again.');
    }
  };

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    return standings.map(party => ({
      name: party.name.split(' ')[0], // Short name for X-axis
      fullName: party.name,
      votes: party.votes,
      percentage: party.percentage,
      fill: party.id === 'bjp' ? '#F97316' : party.id === 'inc' ? '#06B6D4' : party.id === 'aap' ? '#10B981' : '#6366F1'
    }));
  }, [standings]);

  // Compute state-wise leaders
  const stateLeaders = useMemo(() => {
    const stateMap = {};
    
    standings.forEach(party => {
      if (party.stateVotes) {
        Object.entries(party.stateVotes).forEach(([state, votes]) => {
          if (!stateMap[state] || votes > stateMap[state].votes) {
            stateMap[state] = { 
              partyName: party.name.split(' (')[0],
              partyFullName: party.name,
              votes: votes,
              fill: party.id === 'bjp' ? '#F97316' : party.id === 'inc' ? '#06B6D4' : party.id === 'aap' ? '#10B981' : '#6366F1'
            };
          }
        });
      }
    });
    
    return Object.entries(stateMap).map(([state, data]) => ({
      state,
      ...data
    })).sort((a, b) => b.votes - a.votes);
  }, [standings]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white">{data.fullName}</p>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{data.votes} votes ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-[calc(100vh-73px)]" role="main">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Live Political Poll 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          Who do you think will win the next major election? Cast your secure, verified vote and see the live public sentiment.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Voting Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Cast Your Vote
          </h2>

          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-fade-in-up" role="alert">
              <p className="text-green-800 dark:text-green-300 font-medium text-lg">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleVote} className="space-y-4">
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select your state...</option>
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div role="radiogroup" aria-labelledby="poll-question" className="space-y-3">
                <p id="poll-question" className="sr-only">Select a political party</p>
                {standings.map((party) => (
                  <label 
                    key={party.id}
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedParty === party.id 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-200 dark:ring-indigo-800' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="party"
                      value={party.id}
                      checked={selectedParty === party.id}
                      onChange={(e) => setSelectedParty(e.target.value)}
                      className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      aria-label={`Vote for ${party.name}`}
                    />
                    <span className="ml-3 font-medium text-gray-900 dark:text-white">{party.name}</span>
                  </label>
                ))}
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm" role="alert">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              {user ? (
                <button
                  type="submit"
                  disabled={!selectedParty || !selectedState || status === 'loading'}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors focus-visible:ring-4 focus-visible:ring-indigo-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {status === 'loading' ? 'Submitting securely...' : 'Submit Secure Vote'}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors mt-4"
                >
                  <LogIn className="w-5 h-5" />
                  Sign in with Google to Vote
                </Link>
              )}
            </form>
          )}
          
          <div className="mt-6 flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
            <p>Your vote is entirely anonymous but strictly limited to one per verified Google account to prevent bot manipulation.</p>
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Results</h2>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              {totalVotes.toLocaleString()} Total Votes
            </span>
          </div>

          <div className="flex-grow min-h-[300px]" aria-label="Bar chart showing live poll results">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.25" />
                    </filter>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    hide={true} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar 
                    dataKey="votes" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                    minPointSize={15}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} filter="url(#shadow)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </div>
            {/* State-wise Breakdown */}
            {stateLeaders.length > 0 && (
              <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Leading Party by State
                </h3>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {stateLeaders.map((item) => (
                    <div key={item.state} className="flex flex-col p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{item.state}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm truncate" title={item.partyFullName}>
                          {item.partyName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </section>

      </div>
    </div>
  );
}
