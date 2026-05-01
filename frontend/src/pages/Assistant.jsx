import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Send, Bot, Loader2, Mic, MicOff } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Assistant() {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Namaste! I am VotePath AI. How can I guide you with your voting process today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const toggleListen = useCallback(() => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev + " " + transcript).trim());
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Microphone is not supported in this browser.");
    }
  }, [isListening]);

  const sendMessage = useCallback(async (presetMessage = null) => {
    const textToSend = typeof presetMessage === 'string' ? presetMessage : input;
    if (!textToSend.trim()) return;

    const userMsg = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      
      const res = await axios.post(`${apiUrl}/chat`, {
        message: textToSend,
        history: messages
      });

      const botMsg = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", text: "Oops! I couldn't connect to my brain. Please make sure the backend server is running." }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages]);

  const suggestions = useMemo(() => ["Lost Voter ID", "New Registration", "Correction", "Find Booth"], []);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 h-[calc(100vh-73px)] flex flex-col" role="main">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-grow flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full" aria-hidden="true">
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">VotePath AI Assistant</h1>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium" aria-live="polite">Online</p>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          className="flex-grow overflow-y-auto p-4 space-y-4" 
          aria-live="polite" 
          aria-atomic="false"
          role="log"
          aria-label="Chat messages"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex animate-fade-in-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
                <div className={`max-w-[80%] rounded-2xl p-4 flex gap-3 ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
                }`}>
                  {msg.role === "bot" ? (
                    <>
                      <Bot className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="text-sm md:text-base leading-relaxed overflow-hidden">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors shadow-sm w-full text-center border border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-500 outline-none" />,
                            ul: ({...props}) => <ul {...props} className="list-disc pl-5 my-2 space-y-1" />,
                            ol: ({...props}) => <ol {...props} className="list-decimal pl-5 my-2 space-y-1" />,
                            li: ({...props}) => <li {...props} className="mb-1" />,
                            p: ({...props}) => <p {...props} className="mb-2 last:mb-0 whitespace-pre-wrap" />,
                            strong: ({...props}) => <strong {...props} className="font-semibold" />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm p-4 flex gap-2 items-center" aria-label="Assistant is typing...">
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
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide" role="group" aria-label="Quick suggestions">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => sendMessage(s)}
                className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleListen}
              className={`p-3 rounded-xl transition-colors shrink-0 w-12 h-12 flex items-center justify-center border focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${isListening ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              aria-pressed={isListening}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
            </button>
            <input
              className="flex-grow p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500 outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your election question..."
              aria-label="Chat input field"
              disabled={isTyping}
            />
            <button 
              onClick={sendMessage} 
              disabled={isTyping || !input.trim()}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 w-12 h-12 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
              aria-label="Send message"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
