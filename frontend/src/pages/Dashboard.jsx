import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Info, Building2, ChevronRight, Award, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await axios.get(`${apiUrl}/api/polls/candidates`);
        if (res.data.success) {
          setCandidates(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch candidates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8" role="main">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Election <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your central hub for political insights. Explore current ruling parties, research candidates, and understand the electoral landscape.
        </p>
      </header>

      {/* Primary Status Banner */}
      <section className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden" aria-labelledby="ruling-party-heading">
        <div className="relative z-10 md:w-2/3">
          <div className="flex items-center gap-2 text-indigo-200 font-semibold tracking-wider uppercase text-sm mb-4">
            <Building2 className="w-5 h-5" aria-hidden="true" />
            <span>Current Status</span>
          </div>
          <h2 id="ruling-party-heading" className="text-3xl md:text-4xl font-bold mb-4">
            National Democratic Alliance (NDA)
          </h2>
          <p className="text-indigo-100 text-lg md:text-xl leading-relaxed mb-8">
            Led by the Bharatiya Janata Party (BJP), the NDA is the current ruling coalition in the Parliament of India, forming the government after securing a majority in the most recent Lok Sabha elections.
          </p>
          <Link 
            to="/poll"
            className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors focus-visible:ring-4 focus-visible:ring-indigo-300 outline-none"
          >
            View Live Public Poll <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Candidates Section */}
          <section aria-labelledby="candidates-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="candidates-heading" className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                Key Political Figures
              </h2>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-100 dark:bg-gray-800 h-40 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {candidates.map(candidate => (
                  <article 
                    key={candidate.id} 
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{candidate.name}</h3>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">{candidate.party}</p>
                      </div>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded font-medium">
                        {candidate.region}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {candidate.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Educational Content */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800" aria-labelledby="education-heading">
            <h2 id="education-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              How the Process Works
            </h2>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <p>
                India operates under a parliamentary system. At the national level, citizens vote for Members of Parliament (MPs) to represent their constituency in the Lok Sabha (Lower House).
              </p>
              <ul>
                <li>The party or coalition securing a majority (272+ seats) forms the government.</li>
                <li>The leader of the majority party becomes the Prime Minister.</li>
                <li>Elections are held every 5 years unless the Parliament is dissolved earlier.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Quick Facts
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Largest Democracy:</strong> India conducts the largest democratic exercise in the world, with over 900 million eligible voters.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">EVMs:</strong> Electronic Voting Machines have been used nationwide since 2004 to ensure fast and accurate counting.</p>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-500" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              <div className="border-l-2 border-purple-500 pl-4 py-1">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">State Elections</p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Maharashtra Assembly</p>
              </div>
              <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 py-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">By-Elections</p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Various Constituencies</p>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
