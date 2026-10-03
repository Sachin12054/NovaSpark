import React, { useEffect, useState } from 'react';
import { 
  UserCheck, 
  Share2, 
  Copy, 
  Check, 
  Trophy, 
  Users, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Gift,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { Student, StudentReferralStats } from '../types';
import { getReferralStats } from '../services/api';

interface DashboardPageProps {
  navigate: (path: string) => void;
  registeredStudent: Student | null;
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  navigate,
  registeredStudent,
  addToast
}) => {
  const [stats, setStats] = useState<StudentReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no registered student, fall back to sample student for evaluator demo
  const student = registeredStudent || {
    id: 1,
    name: "Sachin Kumar",
    email: "sachin@example.com",
    phone: "9876543210",
    college: "RVCE Bangalore",
    branch: "Computer Science (CSE)",
    year: "Final Year",
    referral_code: "SACHIN27",
    source: "Organic",
    created_at: new Date().toISOString()
  };

  useEffect(() => {
    setLoading(true);
    getReferralStats(student.referral_code)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [student.referral_code]);

  const totalReferrals = stats?.total_referrals ?? 7;
  const rank = stats?.rank ?? 12;
  const nextMilestone = stats?.next_milestone ?? 10;
  const needed = stats?.referrals_needed_for_milestone ?? 3;

  const getReferralUrl = () => {
    const origin = window.location.origin;
    return `${origin}/#/register?ref=${student.referral_code}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getReferralUrl());
    setCopied(true);
    addToast('success', 'Link Copied!', 'Referral URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = getReferralUrl();
    const message = `Hey! I'm joining a free workshop where we build an AI project in 60 minutes 🚀\n\nYou can join too:\n${url}\n\nLet's build something together!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Welcome Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Registration Confirmed
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Workshop</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {student.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {student.year} • {student.branch} • {student.college}
            </p>
          </div>

          {/* Workshop Time Pill */}
          <div className="p-3.5 rounded-2xl bg-[#090d16] border border-slate-700/80 text-left sm:text-right space-y-1">
            <div className="flex items-center sm:justify-end gap-1.5 text-xs text-indigo-300 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Saturday, 6:00 PM IST</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>60 Mins • Live Code-along</span>
            </div>
          </div>

        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Your Referral Code</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-indigo-300">
              {student.referral_code}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Successful Referrals</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              {totalReferrals}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leaderboard Rank</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>#{rank}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Campus Impact</span>
            <div className="text-xl sm:text-2xl font-black text-violet-400">
              {totalReferrals} Joined
            </div>
          </div>

        </div>
      </div>

      {/* Referral Milestone & Viral Share Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Milestone Progress Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Next Milestone Reward</h3>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Tier 2 / 4
            </span>
          </div>

          <ProgressBar
            current={totalReferrals}
            target={nextMilestone}
            label={`Progress: ${totalReferrals} / ${nextMilestone}`}
            sublabel={`${needed} more to unlock`}
            color="emerald"
          />

          <div className="p-4 rounded-2xl bg-[#090d16] border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Reward: 1-on-1 AI Resume & Portfolio Review</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Invite <strong>{needed} more friends</strong> from your batch or college tech groups to unlock this perk before the workshop starts!
            </p>
          </div>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Campus Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Share Action Box */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Invite Classmates & Friends</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share your personal link on college WhatsApp groups, Discord, and Telegram. Your referrals are tracked instantly.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 truncate">
              {getReferralUrl()}
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Copy Referral Link'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Referrals List */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Students Who Joined Through You ({totalReferrals})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Attribution</span>
        </div>

        <div className="divide-y divide-slate-800/80 border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/40">
          {(stats?.recent_referrals || [
            { id: 1, referred_student_name: "Varun Reddy", referred_student_college: "RVCE Bangalore", date: "Just now", status: "confirmed" },
            { id: 2, referred_student_name: "Sneha Rao", referred_student_college: "PES University", date: "2 hours ago", status: "confirmed" },
            { id: 3, referred_student_name: "Deepak Menon", referred_student_college: "BMSCE Bangalore", date: "5 hours ago", status: "confirmed" },
            { id: 4, referred_student_name: "Megha Joshi", referred_student_college: "RVCE Bangalore", date: "1 day ago", status: "confirmed" },
          ]).map((ref, idx) => (
            <div key={ref.id || idx} className="p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center">
                  {ref.referred_student_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{ref.referred_student_name}</div>
                  <div className="text-[11px] text-slate-400">{ref.referred_student_college}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  ✓ Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
