import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Vote } from "lucide-react";
import PropTypes from 'prop-types';

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-blue-500 font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400";
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white" aria-label="VotePath AI Home">
        <Vote className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
        VotePath AI
      </Link>
      <div className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main Navigation">
        <Link to="/" className={`transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${isActive('/')}`}>Home</Link>
        <Link to="/journey" className={`transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${isActive('/journey')}`}>Journey</Link>
        <Link to="/assistant" className={`transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${isActive('/assistant')}`}>Assistant</Link>
        <Link to="/scenarios" className={`transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${isActive('/scenarios')}`}>Scenarios</Link>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-pressed={darkMode}
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" aria-hidden="true" /> : <Moon className="w-5 h-5 text-gray-600" aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};
