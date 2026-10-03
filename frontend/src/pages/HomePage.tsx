import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Gift, 
  Users, 
  Code2, 
  Flame, 
  Share2, 
  Layers, 
  Zap,
  TrendingUp,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { getGrowthAnalytics } from '../services/api';
import { GrowthAnalyticsResponse } from '../types';

interface HomePageProps {
  navigate: (path: string) => void;
  referralCodeFromUrl?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, referralCodeFromUrl }) => {
  const [stats, setStats] = useState<GrowthAnalyticsResponse | null>(null);

  useEffect(() => {
    getGrowthAnalytics().then(setStats).catch(() => {});
  }, []);

  const totalRegs = stats?.total_registrations || 327;
  const targetRegs = stats?.target_registrations || 500;

  return (
    <div className="space-y-16 pb-12">
      
      {/* Referral Invited Banner if incoming with ?ref=... */}
      {referralCodeFromUrl && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/60 border border-indigo-500/40 flex items-center justify-between gap-4 text-sm text-indigo-200">
            <div className="flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>
                You were invited with referral code <strong className="font-mono text-white bg-indigo-500/20 px-1.5 py-0.5 rounded">{referralCodeFromUrl}</strong>. Register to join the challenge!
              </span>
            </div>
            <button
              onClick={() => navigate(`/register?ref=${referralCodeFromUrl}`)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg whitespace-nowrap transition-colors"
            >
              Claim Spot →
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 overflow-hidden">
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Exclusive Live Workshop for Final-Year Engineers</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Build Your First AI Project <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              in 60 Minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Tell us what you're interested in. We'll help you find an AI project you can actually build and showcase on your resume.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/project')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Discover My AI Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Chat with Nova AI</span>
            </button>
          </div>

          {/* Live Progress towards 500 Registrations */}
          <div className="max-w-xl mx-auto pt-6">
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-2xl space-y-3 text-left">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-white">Live Workshop Enrollment</span>
                </div>
                <div className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {500 - totalRegs} Seats Remaining
                </div>
              </div>

              <ProgressBar
                current={totalRegs}
                target={targetRegs}
                label="Campaign Goal"
                sublabel="7-Day Sprint"
                color="indigo"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>⚡ {totalRegs} students already registered</span>
                <span className="text-emerald-400 font-medium">Free Workshop • 100% Online</span>
              </div>
            </div>
          </div>

          {/* Key Workshop Highlights Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>60 Minutes Live Build</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>100% Free Access</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Code2 className="w-4 h-4 text-violet-400" />
              <span>Beginner Friendly</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Verified Certificate</span>
            </div>
          </div>

        </div>
      </section>

      {/* "Stop Watching AI Tutorials. Build Something." Philosophy Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-[#0c101a] border border-indigo-500/30 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold font-mono">
                THE STUDENT REALITY CHECK
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Stop watching 10-hour AI tutorials. <br />
                <span className="text-indigo-400">Build something real today.</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Most final-year engineering students get stuck in "tutorial hell." In this 60-minute live workshop, you’ll clone starter repositories, connect live LLM APIs, and deploy a working AI application to your GitHub.
              </p>
              
              <div className="pt-2 flex flex-col gap-2.5 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No heavy machine learning math required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free sandbox API keys provided for all attendees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Stand out in campus placement interviews with working demos</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Reserve Your Seat</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="space-y-3">
              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Find Your Personalized AI Project</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Answer 4 quick questions about your branch and interests.</p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Claim 100% Free Workshop Seat</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Reserve your spot and get instant access to starter kits.</p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Invite Friends & Unlock Rewards</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Share your referral link on WhatsApp to climb the campus leaderboard.</p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Build & Ship in 60 Minutes</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Follow the live code-along and deploy your AI project to GitHub.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Project Examples Preview */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">What You Can Build</h3>
          <p className="text-sm text-slate-400">Tailored starter projects designed for final-year engineering domains.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  Beginner Friendly
                </span>
                <span className="text-xs font-mono text-slate-400">60 Mins</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                AI Resume Analyzer & ATS Score Matcher
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract PDF text, compare candidate skills with job descriptions, and generate tailored ATS match scores with LLM reasoning.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Python', 'FastAPI', 'LLM API', 'React UI'].map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/project')}
              className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Explore this project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                  Intermediate
                </span>
                <span className="text-xs font-mono text-slate-400">60 Mins</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Real-Time Campus Vision & Mask Detector
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Webcam computer vision feed detecting student faces, verifying IDs, and logging verified timestamps into SQLite.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Python', 'OpenCV', 'MediaPipe', 'SQLite'].map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/project')}
              className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Explore this project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group sm:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-md">
                  Conversational AI
                </span>
                <span className="text-xs font-mono text-slate-400">60 Mins</span>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                College Syllabus Knowledge RAG Bot
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask questions about syllabus, exam dates, and course credits with grounded vector embeddings and zero hallucinations.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Python', 'LangChain', 'Embeddings', 'Streamlit'].map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/project')}
              className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Explore this project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Campus Referral Challenge Highlight */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Campus Referral Challenge</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Invite 3 batchmates to unlock the <strong>Verified Participation Certificate</strong> & <strong>AI Starter Kit</strong>. Top referrers get direct interview recommendations!
            </p>
          </div>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 whitespace-nowrap transition-all"
          >
            View Campus Leaderboard →
          </button>
        </div>
      </section>

    </div>
  );
};
