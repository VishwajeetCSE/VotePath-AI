import { Link } from "react-router-dom";
import { ArrowRight, Bot, Map } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] text-center px-4">
      <div className="max-w-3xl space-y-8 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Your Smart <span className="text-blue-600 dark:text-blue-400">Election Assistant</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Navigate the Indian election process with ease. Whether you're a first-time voter, shifted cities, or lost your ID, VotePath AI provides a personalized, step-by-step guide.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/journey" 
            className="group flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Map className="w-5 h-5 mr-2" />
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/assistant" 
            className="group flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
          >
            <Bot className="w-5 h-5 mr-2 text-blue-500" />
            Ask the AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
