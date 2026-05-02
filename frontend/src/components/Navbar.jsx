import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Vote, LogIn, LogOut } from "lucide-react";
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const { user, logout } = useAuth();

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
        <Link to="/dashboard" className={`transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${isActive('/dashboard')}`}>Dashboard</Link>
        <Link to="/poll" className={`transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 ${isActive('/poll')}`}>Poll</Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">{user.name.split(' ')[0]}</span>
            <button 
              onClick={logout}
              className="text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        )}
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
