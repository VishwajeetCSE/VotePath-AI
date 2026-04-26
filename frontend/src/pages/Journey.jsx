import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function Journey() {
  const [formData, setFormData] = useState({ age: '', voterType: 'first-time' });
  const [showTimeline, setShowTimeline] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTimeline(true);
  };

  const steps = [
    { title: "Registration", desc: "Register on NVSP portal via Form 6.", link: "https://voters.eci.gov.in/", linkText: "Go to NVSP Portal" },
    { title: "Verification", desc: "BLO (Booth Level Officer) verifies your details." },
    { title: "Approval", desc: "Name gets added to Electoral Roll." },
    { title: "Download ID", desc: "Download e-EPIC online or receive card by post.", link: "https://voters.eci.gov.in/Home/DownloadPdf?Type=EPIC", linkText: "Download e-EPIC" },
    { title: "Vote", desc: "Visit your polling booth on Election Day.", link: "https://electoralsearch.eci.gov.in/", linkText: "Find your polling booth" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Your Voter Journey</h2>
      
      {!showTimeline ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How old are you?</label>
            <input 
              type="number" 
              required
              min="18"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="e.g. 19"
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What is your situation?</label>
            <select 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.voterType}
              onChange={(e) => setFormData({...formData, voterType: e.target.value})}
            >
              <option value="first-time">First-time Voter</option>
              <option value="shifted">Shifted City/Constituency</option>
              <option value="lost">Lost Voter ID</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition-colors">
            Generate My Timeline
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Action Plan</h3>
            <button onClick={() => setShowTimeline(false)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Start Over</button>
          </div>
          
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-6">
            {steps.map((step, index) => (
              <div key={index} className="mb-10 ml-8 relative group">
                <span className="absolute -left-11 flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-800 rounded-full ring-4 ring-white dark:ring-gray-800">
                  {index === 0 ? (
                    <Circle className="w-6 h-6 text-blue-600 dark:text-blue-400 fill-current animate-pulse" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  )}
                </span>
                <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Step {index + 1}: {step.title}
                </h4>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">{step.desc}</p>
                {step.link && (
                  <a href={step.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    {step.linkText}
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
