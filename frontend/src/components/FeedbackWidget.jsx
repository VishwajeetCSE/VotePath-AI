import { useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Send, CheckCircle2, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  
  const { user } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim() || !user) return;

    setStatus('loading');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await axios.post(`${apiUrl}/api/feedback`, { rating, comment }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setRating(0);
        setComment('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all z-50 focus-visible:ring-4 focus-visible:ring-indigo-300 outline-none"
        aria-label="Open Feedback form"
        aria-expanded={isOpen}
      >
        <MessageSquare className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 z-50 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Rate Your Experience</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded outline-none"
              aria-label="Close Feedback form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-6 text-green-600 dark:text-green-400 animate-fade-in-up" role="alert">
              <CheckCircle2 className="w-12 h-12 mb-2" />
              <p className="font-medium">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4" role="radiogroup" aria-label="Select a rating from 1 to 5 stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus-visible:ring-2 focus-visible:ring-indigo-500 rounded outline-none transition-transform hover:scale-110"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoveredRating || rating) >= star
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <div>
                <label htmlFor="feedback-comment" className="sr-only">Your comments</label>
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved or how we can improve..."
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none resize-none h-24"
                  required
                />
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm" role="alert">Failed to submit. Please try again.</p>
              )}

              {/* Submit Button */}
              {user ? (
                <button
                  type="submit"
                  disabled={status === 'loading' || rating === 0 || !comment.trim()}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none flex justify-center items-center gap-2"
                >
                  {status === 'loading' ? 'Sending...' : (
                    <>Submit Feedback <Send className="w-4 h-4" /></>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in to Feedback
                </Link>
              )}
            </form>
          )}
        </div>
      )}
    </>
  );
}
