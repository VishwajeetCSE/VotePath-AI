import { useLocation, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function FloatingChatbot() {
  const location = useLocation();

  // Hide the floating button if already on the assistant page
  if (location.pathname === '/assistant') return null;

  return (
    <Link
      to="/assistant"
      className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-transform transform hover:scale-110 z-50 flex items-center justify-center animate-bounce-slow"
      aria-label="Chat with VotePath AI"
    >
      <MessageCircle className="w-8 h-8" />
      <span className="absolute -top-2 -right-2 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
      </span>
    </Link>
  );
}
