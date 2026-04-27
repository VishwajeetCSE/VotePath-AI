import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Loader2 } from "lucide-react";

export default function Assistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Namaste! I am VotePath AI. How can I guide you with your voting process today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (presetMessage = null) => {
    const textToSend = presetMessage || input;
    if (!textToSend.trim()) return;

    const userMsg = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(`${apiUrl}/chat`, {
        message: textToSend,
      });

      const botMsg = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Oops! I couldn't connect to my brain. Please make sure the backend server is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = ["How to vote?", "Lost voter ID", "First time voter"];

  const formatMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors shadow-sm w-full text-center border border-blue-200 dark:border-blue-800">
            Open Link
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 h-[calc(100vh-73px)] flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-grow flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">VotePath AI Assistant</h2>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Online</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 flex gap-3 ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-br-sm" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
              }`}>
                {msg.role === "bot" ? (
                  <>
                    <Bot className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="whitespace-pre-line text-sm md:text-base leading-relaxed">{formatMessage(msg.text)}</div>
                  </>
                ) : (
                  <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm p-4 flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => sendMessage(s)}
                className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-grow p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your election question..."
            />
            <button 
              onClick={() => sendMessage()} 
              disabled={isTyping || !input.trim()}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 w-12 h-12"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
