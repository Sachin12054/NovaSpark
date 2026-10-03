import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Sparkles, 
  Flame, 
  Users, 
  Award, 
  Code, 
  Zap, 
  ArrowRight,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { LeaderboardResponse, Student } from '../types';
import { getLeaderboard } from '../services/api';
import { ProgressBar } from '../components/ProgressBar';

interface LeaderboardPageProps {
  navigate: (path: string) => void;
  registeredStudent: Student | null;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  navigate,
  registeredStudent
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const studentCode = registeredStudent?.referral_code || 'SACHIN27';

  useEffect(() => {
    setIsLoading(true);
    getLeaderboard(studentCode)
      .then(setLeaderboard)
      .finally(() => setIsLoading(false));
  }, [studentCode]);

  const userReferrals = registeredStudent ? (registeredStudent.referral_count ?? 7) : 7;
  const userRank = registeredStudent?.rank ?? 7;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Campus Growth Challenge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Campus Referral Challenge
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Help your batchmates get started with AI. Top referrers win direct mentor portfolio reviews and fast-track interview recommendations.
        </p>
      </div>

      {/* User's Sticky Rank Highlight Banner */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#0d1222] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-extrabold text-lg">
              #{userRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {registeredStudent?.name || "Sachin Kumar"} (You)
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-semibold">
                  {studentCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {userReferrals} successful referrals • 3 more referrals to reach Milestone 3 (10 Referrals)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share & Invite More</span>
            </button>
          </div>

        </div>

        {/* Mini progress bar */}
        <ProgressBar
          current={userReferrals}
          target={10}
          label="Next Milestone: 1-on-1 AI Resume & Portfolio Review"
          sublabel="3 referrals remaining"
          color="amber"
        />
      </div>

      {/* Milestone Tiers Display */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Milestone Unlock Tiers</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { level: '3 Referrals', perk: 'AI Starter Toolkit & Certificate of Participation', unlocked: userReferrals >= 3, icon: Award },
            { level: '5 Referrals', perk: 'Production Python AI Boilerplate Repository', unlocked: userReferrals >= 5, icon: Code },
            { level: '10 Referrals', perk: '1-on-1 AI Resume & Portfolio Review', unlocked: userReferrals >= 10, icon: Sparkles },
            { level: '20 Referrals', perk: 'Fast-Track Interview Recommendation', unlocked: userReferrals >= 20, icon: Zap },
          ].map((tier, i) => {
            const Icon = tier.icon;
            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border transition-all ${
                  tier.unlocked
                    ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-100'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${tier.unlocked ? 'text-emerald-400' : 'text-slate-500'}`} />
                    {tier.level}
                  </span>
                  {tier.unlocked ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                      Unlocked ✓
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{tier.perk}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Top Campus Referrers</span>
            </h3>
            <p className="text-xs text-slate-400">Live rankings based on verified student registrations</p>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {leaderboard?.total_participants || 327} Active Participants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800/80">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">College</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3 text-right">Referrals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {(leaderboard?.top_referrers || []).map((entry) => {
                const isTop3 = entry.rank <= 3;
                const medalColors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
                return (
                  <tr
                    key={entry.rank}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      entry.is_current_user ? 'bg-indigo-950/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 font-bold">
                        {isTop3 ? (
                          <Medal className={`w-4 h-4 ${medalColors[entry.rank - 1]}`} />
                        ) : (
                          <span className="text-slate-400 pl-1 font-mono">#{entry.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{entry.student_name}</span>
                        {entry.is_current_user && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{entry.college}</td>
                    <td className="py-3.5 px-3 text-slate-400 text-xs">{entry.branch}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {entry.referral_count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
