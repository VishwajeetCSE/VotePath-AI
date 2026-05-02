import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCog, Lock } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('voter'); // 'voter' or 'admin'
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        token: credentialResponse.credential, 
        role: 'voter'
      };
      login(userData);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed parsing token", error);
    }
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
              Verify your identity with Google to participate in live polls and leave feedback.
            </p>

            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                shape="pill"
                theme="filled_blue"
                size="large"
                text="continue_with"
              />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-xs text-left mb-4">
              <strong>Note:</strong> If you see an "Access blocked: Authorization Error", you need to replace the default Google Client ID in <code>App.jsx</code> with your own from the Google Cloud Console.
            </div>
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
