import { Link } from "react-router-dom";
import { ArrowRight, Bot, Map, BarChart3, CheckCircle2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Landing() {
  const [leadingParty, setLeadingParty] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await axios.get(`${apiUrl}/api/polls/standings`);
        if (res.data.success && res.data.data.parties.length > 0) {
          setLeadingParty(res.data.data.parties[0]);
          setTotalVotes(res.data.data.totalVotes);
        }
      } catch (err) {
        console.error("Failed to load poll summary");
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-73px)] px-4 pt-16 pb-24">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-8 animate-fade-in-up text-center mb-24">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Your Smart <span className="text-blue-600 dark:text-blue-400">Election Assistant</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Navigate the Indian election process with ease. Whether you're a first-time voter, shifted cities, or lost your ID, VotePath AI provides a personalized, step-by-step guide.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/journey" 
            className="group flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Map className="w-5 h-5 mr-2" />
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/assistant" 
            className="group flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
          >
            <Bot className="w-5 h-5 mr-2 text-blue-500" />
            Ask the AI Assistant
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl w-full mb-24 animate-fade-in-up delay-100">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Cast Your Vote</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Securely verify your mobile number and participate in the live public poll.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Get Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">View real-time, state-wise election statistics and AI-driven analysis.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Explore Guidance</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask the AI assistant for personalized help regarding your voting process.</p>
          </div>
        </div>
      </div>

      {/* Live Poll Summary Widget */}
      {leadingParty && totalVotes > 0 && (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 animate-fade-in-up transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-3 uppercase tracking-wide text-sm">
                <BarChart3 className="w-5 h-5" />
                Live Election Poll
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Current Leader: {leadingParty.name.split(' (')[0]}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Based on {totalVotes.toLocaleString()} real user votes nationwide.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 min-w-[180px] text-center border border-gray-100 dark:border-gray-600">
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
                {leadingParty.percentage}%
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                of total vote
              </p>
            </div>
            
            <div className="w-full md:w-auto flex justify-center">
              <Link 
                to="/poll"
                className="flex items-center gap-2 px-6 py-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors w-full md:w-auto justify-center"
              >
                View State-wise Data
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
