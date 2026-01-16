import React, { useState, useEffect } from 'react';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { askLibrarianAI } from '../services/geminiService';
import { Book } from '../types';
import { Language, translations } from '../utils/i18n';

interface AIAssistantProps {
  books: Book[];
  language?: Language;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ books, language = 'en' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize greeting based on language
  useEffect(() => {
    setMessages([
        { role: 'ai', content: t.aiGreeting }
    ]);
  }, [language, t.aiGreeting]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setLoading(true);

    const response = await askLibrarianAI(userMsg, { books });
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto my-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
             <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.smartLibrarian}</h2>
            <p className="text-indigo-100 text-sm">{t.poweredBy}</p>
          </div>
        </div>
        <Sparkles className="text-yellow-300 w-5 h-5 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-slate-500 text-sm">{t.thinking}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder={t.askPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
