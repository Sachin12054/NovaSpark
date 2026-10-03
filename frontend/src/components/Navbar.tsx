import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Compass, 
  Trophy, 
  BarChart3, 
  UserCheck, 
  Menu, 
  X,
  Flame,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  registeredStudent: any;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, registeredStudent }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: Sparkles },
    { label: 'AI Project Finder', path: '/project', icon: Compass },
    { label: 'Nova AI Assistant', path: '/chat', icon: Bot },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Growth Admin', path: '/growth', icon: BarChart3, badge: '500 Goal' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080b11]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  AI Project Hub
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded">
                  NxtWave
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Build in 60 Mins Challenge</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {registeredStudent ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 transition-all shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>My Dashboard</span>
                <span className="px-1.5 py-0.5 text-[11px] font-mono bg-indigo-500/20 rounded text-indigo-200">
                  {registeredStudent.referral_code}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5"
              >
                <span>Claim Free Seat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c101a] px-4 pt-2 pb-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-2">
            {registeredStudent ? (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-900/50 border border-indigo-500/40 text-indigo-200 text-sm font-semibold"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>My Dashboard ({registeredStudent.referral_code})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/register');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
              >
                <span>Claim Free Workshop Seat</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
