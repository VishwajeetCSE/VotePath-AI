import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Users, MessageSquare, Database } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ feedback: [], users: [], votes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await axios.get(`${apiUrl}/api/auth/admin/data`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.users.length}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Votes</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.votes.length}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Feedback Items</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.feedback.length}</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Feedback</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm">
                    <th className="p-4 font-medium">User ID</th>
                    <th className="p-4 font-medium">Rating</th>
                    <th className="p-4 font-medium">Comment</th>
                    <th className="p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {data.feedback.map((f, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 text-sm text-gray-900 dark:text-gray-300 font-mono text-xs">{f.userId || 'Anonymous'}</td>
                      <td className="p-4 text-sm font-bold text-yellow-500">{f.rating} ★</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-md truncate">{f.comment}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(f.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {data.feedback.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">No feedback submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
