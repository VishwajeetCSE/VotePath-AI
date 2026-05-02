import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingChatbot from './components/FloatingChatbot';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for efficiency
const Landing = React.lazy(() => import('./pages/Landing'));
const Journey = React.lazy(() => import('./pages/Journey'));
const Assistant = React.lazy(() => import('./pages/Assistant'));
const Scenarios = React.lazy(() => import('./pages/Scenarios'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Poll = React.lazy(() => import('./pages/Poll'));
const Login = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Import widget normally as it should be available immediately
import FeedbackWidget from './components/FeedbackWidget';

// Simple loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" aria-label="Loading..."></div>
  </div>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    // NOTE: In production, replace with your actual Google Client ID from the Developer Console
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/journey" element={<Journey />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/scenarios" element={<Scenarios />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/poll" element={<Poll />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </main>
            <FloatingChatbot />
            <FeedbackWidget />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
