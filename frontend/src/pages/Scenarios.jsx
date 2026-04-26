import { Link } from "react-router-dom";
import { UserPlus, MapPin, CreditCard, ArrowRight } from "lucide-react";

export default function Scenarios() {
  const scenarios = [
    {
      title: "First-time Voter",
      icon: <UserPlus className="w-8 h-8 text-blue-500" />,
      desc: "Turned 18 recently? Learn how to register for the first time and get your Voter ID.",
      color: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800"
    },
    {
      title: "Shifted City",
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      desc: "Moved to a new place? Find out how to transfer your vote to your new constituency.",
      color: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-100 dark:border-green-800"
    },
    {
      title: "Lost Voter ID",
      icon: <CreditCard className="w-8 h-8 text-orange-500" />,
      desc: "Misplaced your card? Don't panic. See how to download an e-EPIC or order a duplicate.",
      color: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-100 dark:border-orange-800"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Common Scenarios</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select the situation that best describes you, and we'll guide you through the exact steps you need to take.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => (
          <div key={index} className={`rounded-2xl p-6 border ${scenario.border} ${scenario.color} transition-all hover:shadow-md hover:-translate-y-1`}>
            <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              {scenario.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{scenario.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[80px]">
              {scenario.desc}
            </p>
            <Link to="/journey" className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
              Start Guide
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
