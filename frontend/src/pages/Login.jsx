import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCog, Lock, User } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('voter'); // 'voter' or 'admin'
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const [testUsername, setTestUsername] = useState('');
  const [testPassword, setTestPassword] = useState('');

  const handleTestLogin = (e) => {
    e.preventDefault();
    const userData = {
      id: 'test_user_' + Date.now(),
      name: testUsername || 'Test User',
      email: 'test@votepath.ai',
      picture: `https://ui-avatars.com/api/?name=${testUsername || 'Test+User'}&background=random`,
      token: 'dummy_testing_token', 
      role: 'voter'
    };
    login(userData);
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await axios.post(`${apiUrl}/api/auth/admin`, {
        username: adminUsername,
        password: adminPassword
      });
      
      if (res.data.success) {
        login(res.data.user);
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      setAdminError(error.response?.data?.message || "Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900" role="main">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md border border-gray-100 dark:border-gray-700">
        
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setActiveTab('voter')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'voter' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Voter Login
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'admin' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Admin Login
          </button>
        </div>

        {activeTab === 'voter' ? (
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Secure Authentication</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
              Use any test credentials to access the user dashboard. (Google Login is optional and currently disabled for testing).
            </p>

            <form onSubmit={handleTestLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username / Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={testUsername}
                    onChange={(e) => setTestUsername(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                    placeholder="testuser"
                    required
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors mt-2"
              >
                Access Account
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCog className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Admin Portal</h1>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
              
              {adminError && <p className="text-red-500 text-sm text-center">{adminError}</p>}
              
              <button 
                type="submit"
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors mt-2"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
