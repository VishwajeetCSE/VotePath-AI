import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingChatbot from './components/FloatingChatbot';

// Lazy load pages for efficiency
const Landing = React.lazy(() => import('./pages/Landing'));
const Journey = React.lazy(() => import('./pages/Journey'));
const Assistant = React.lazy(() => import('./pages/Assistant'));
const Scenarios = React.lazy(() => import('./pages/Scenarios'));

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
            </Routes>
          </Suspense>
        </main>
        <FloatingChatbot />
      </div>
    </Router>
  );
}
