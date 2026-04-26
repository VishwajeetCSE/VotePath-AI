import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Journey from './pages/Journey';
import Assistant from './pages/Assistant';
import Scenarios from './pages/Scenarios';

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
      <div className="min-h-screen flex flex-col">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/scenarios" element={<Scenarios />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
