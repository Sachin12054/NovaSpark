import React from 'react';
import { Sparkles, Heart, Shield, Terminal, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06090e] text-slate-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">AI Project Challenge Hub</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              A student-centric viral growth application designed to help final-year engineering students transition from passive tutorial watching to deploying their first production AI project in 60 minutes.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono pt-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>NxtWave Growth Intern Challenge — 500 Registrations / ₹2,000 Budget Simulation</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Student Hub</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/project" className="hover:text-indigo-400 transition-colors">AI Project Recommender</a></li>
              <li><a href="#/chat" className="hover:text-indigo-400 transition-colors">Nova AI Assistant</a></li>
              <li><a href="#/register" className="hover:text-indigo-400 transition-colors">Workshop Registration</a></li>
              <li><a href="#/leaderboard" className="hover:text-indigo-400 transition-colors">Campus Leaderboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Growth Analytics</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/growth" className="hover:text-indigo-400 transition-colors">Campaign Funnel Dashboard</a></li>
              <li><a href="#/growth" className="hover:text-indigo-400 transition-colors">AI Growth Copilot</a></li>
              <li><span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><Zap className="w-3 h-3" /> 100% Mock AI Fallback Ready</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AI Project Challenge Hub. Built as a prototype for NxtWave Growth Intern evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian Tech Campuses
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
