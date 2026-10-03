import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Code, 
  Clock, 
  Layers, 
  Gift, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { ChatMessage, ProjectRecommendation } from '../types';
import { sendChatMessage } from '../services/api';

interface ChatPageProps {
  navigate: (path: string) => void;
  registeredStudent: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ navigate, registeredStudent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hi! I'm **Nova**, your AI Workshop Assistant. 👋\n\nI'm here to help you explore what you can build in our upcoming free **'Build Your First AI Project in 60 Minutes'** workshop, answer any doubts, and help you get started.\n\nWhat would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_actions: [
        "I'm a CSE student and I'm a beginner in AI.",
        "What will I build?",
        "Is it really free?",
        "How do referrals work?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const text = userText || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await sendChatMessage(text, messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: resp.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: resp.suggested_actions,
        recommended_project: resp.recommended_project,
        quick_cta: resp.quick_cta
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: "I can definitely help with that! In our 60-minute workshop, you will build and deploy a working AI project step-by-step with free API access.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: ["Find My AI Project", "Register Now"],
        quick_cta: { label: "Discover My Project →", action: "/project" }
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 h-[calc(100vh-140px)] flex flex-col">
      
      {/* Chat Header */}
      <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#080b11] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Nova</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                AI Workshop Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400">Always online • Ask about projects, prerequisites & rewards</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {registeredStudent ? (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Seat Confirmed</span>
              <p className="text-xs font-mono text-slate-300 font-semibold">{registeredStudent.referral_code}</p>
            </div>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Claim Free Seat
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 glass-card p-4 rounded-2xl border border-slate-800 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            <div className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-indigo-600 text-white shadow-sm'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                {/* Markdown-style simple formatted text */}
                <div className="space-y-2 whitespace-pre-line">
                  {msg.content.split('**').map((part, i) => (
                    i % 2 === 1 ? <strong key={i} className="text-indigo-300 font-semibold">{part}</strong> : part
                  ))}
                </div>

                {/* Inline Recommended Project Card if provided */}
                {msg.recommended_project && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#0c1220] border border-indigo-500/30 space-y-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded">
                        Recommended Build
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {msg.recommended_project.estimated_build_time}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">
                      {msg.recommended_project.project_title}
                    </h4>

                    <p className="text-xs text-slate-400">
                      {msg.recommended_project.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {msg.recommended_project.tech_stack.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate('/register')}
                      className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Build this at the workshop →</span>
                    </button>
                  </div>
                )}

                {/* Quick CTA button */}
                {msg.quick_cta && !msg.recommended_project && (
                  <div className="mt-3 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => navigate(msg.quick_cta!.action)}
                      className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 hover:text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <span>{msg.quick_cta.label}</span>
                    </button>
                  </div>
                )}

                <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>

            {/* Quick Action Suggestion Chips */}
            {msg.suggested_actions && msg.suggested_actions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pl-9 pt-1">
                {msg.suggested_actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(act)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/50 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 text-xs transition-colors"
                  >
                    {act}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 pl-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-card p-2 rounded-2xl border border-slate-800 flex items-center gap-2 shrink-0 shadow-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nova anything about the workshop, project ideas, or referrals..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/30 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
