import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Share2, 
  Bot, 
  Sparkles, 
  Zap, 
  Layers, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowUpRight,
  ShieldAlert,
  Flame,
  MessageCircle,
  Award
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { GrowthAnalyticsResponse, GrowthCopilotResponse } from '../types';
import { getGrowthAnalytics, getGrowthCopilot } from '../services/api';

interface GrowthAdminPageProps {
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const GrowthAdminPage: React.FC<GrowthAdminPageProps> = ({ addToast }) => {
  const [stats, setStats] = useState<GrowthAnalyticsResponse | null>(null);
  const [copilotData, setCopilotData] = useState<GrowthCopilotResponse | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copiedCopy, setCopiedCopy] = useState(false);

  useEffect(() => {
    getGrowthAnalytics().then(setStats).catch(() => {});
    loadCopilot('insights');
  }, []);

  const loadCopilot = async (actionType: string) => {
    setCopilotLoading(true);
    try {
      const data = await getGrowthCopilot(actionType);
      setCopilotData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleCopyGeneratedText = () => {
    if (!copilotData?.generated_copy) return;
    navigator.clipboard.writeText(copilotData.generated_copy);
    setCopiedCopy(true);
    addToast('success', 'Copied to Clipboard!', 'WhatsApp campaign broadcast copy copied.');
    setTimeout(() => setCopiedCopy(false), 2500);
  };

  const totalRegs = stats?.total_registrations || 327;
  const targetRegs = stats?.target_registrations || 500;
  const regRate = stats?.registration_rate_pct || 65.4;
  const spent = stats?.budget_spent_inr || 1250.0;
  const totalBudget = stats?.budget_total_inr || 2000.0;
  const cpa = stats?.cost_per_reg_overall || 3.82;
  const viralK = stats?.viral_coefficient_k || 0.26;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Campaign Growth Operations
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold">
              SIMULATION MODE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            NxtWave Growth Challenge Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulated campaign: 500 final-year engineering students in 7 days with ₹2,000 budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadCopilot('insights')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Registrations</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalRegs}</span>
            <span className="text-xs text-slate-400 font-mono">/ 500</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{regRate}% to campaign target</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Budget Utilization</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">₹{spent}</span>
            <span className="text-xs text-slate-400 font-mono">/ ₹{totalBudget}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>₹{totalBudget - spent} budget remaining</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cost per Registration</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">₹{cpa}</span>
            <span className="text-xs text-slate-400">/ student</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span>Target was &lt; ₹4.00 (Exceeding efficiency)</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Viral Referral K-Factor</span>
            <Share2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-400 font-mono">{viralK}</span>
            <span className="text-xs text-slate-400 font-mono">k-coef</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>84 registrations via peer codes (₹0 CPA)</span>
          </div>
        </div>

      </div>

      {/* Campaign Target Velocity & 7-Day Trajectory */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>7-Day Registration Velocity vs 500 Target</span>
            </h3>
            <p className="text-xs text-slate-400">Daily actuals vs planned sprint pace</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 self-start sm:self-auto">
            Day 6 of 7 Active
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={totalRegs}
          target={targetRegs}
          label="Overall 500 Goal Progress"
          sublabel="173 needed to hit target"
          color="indigo"
        />

        {/* 7-Day Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 text-center">
          {(stats?.daily_trends || []).map((d) => {
            const isToday = d.day_number === 6;
            const isRemaining = d.day_number === 7;
            const heightPct = isRemaining ? 0 : Math.min(100, Math.round((d.actual_cumulative / 500) * 100));

            return (
              <div key={d.day_number} className="flex flex-col items-center justify-end space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  {isRemaining ? '-' : d.actual_cumulative}
                </span>

                <div className="w-full h-32 sm:h-40 bg-slate-900 rounded-xl p-1 flex items-end border border-slate-800 relative">
                  {/* Target reference line */}
                  <div
                    className="absolute w-full border-t border-dashed border-slate-600 left-0"
                    style={{ bottom: `${(d.target_cumulative / 500) * 100}%` }}
                    title={`Target: ${d.target_cumulative}`}
                  />
                  
                  <div
                    className={`w-full rounded-lg transition-all duration-700 ${
                      isToday
                        ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-emerald-400 shadow-lg shadow-indigo-500/30'
                        : isRemaining
                        ? 'bg-transparent border border-dashed border-slate-700'
                        : 'bg-indigo-600/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <div className="text-[10px] sm:text-xs">
                  <div className={`font-semibold ${isToday ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                    {d.day}
                  </div>
                  {!isRemaining && (
                    <div className="text-[9px] text-slate-500 font-mono">+{d.daily_registrations}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acquisition Sources Breakdown & Channel Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Source Breakdown Donut/Bar */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Registrations by Source</span>
            </h3>
            <p className="text-xs text-slate-400">Total: {totalRegs} students</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Organic / Direct', count: stats?.organic_registrations || 121, pct: 37, color: 'bg-blue-500' },
              { name: 'WhatsApp Groups', count: stats?.whatsapp_registrations || 96, pct: 29, color: 'bg-emerald-500' },
              { name: 'Campus Referrals', count: stats?.referral_registrations || 84, pct: 26, color: 'bg-violet-500' },
              { name: 'College Tech Clubs', count: stats?.college_clubs_registrations || 51, pct: 16, color: 'bg-amber-500' },
              { name: 'Email Newsletters', count: stats?.email_registrations || 35, pct: 11, color: 'bg-pink-500' },
              { name: 'Social / Other', count: stats?.other_registrations || 24, pct: 7, color: 'bg-slate-500' },
            ].map((src) => (
              <div key={src.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{src.name}</span>
                  <span className="font-mono text-white font-semibold">{src.count} ({Math.round((src.count/totalRegs)*100)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${src.color} rounded-full`} style={{ width: `${Math.min(100, (src.count / 150) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Channel Efficiency & Unit Economics</h3>
              <p className="text-xs text-slate-400">Conversion rates and Cost Per Registration breakdown</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-2">Channel</th>
                  <th className="py-2.5 px-2 text-right">Registrations</th>
                  <th className="py-2.5 px-2 text-right">Conversion</th>
                  <th className="py-2.5 px-2 text-right">Cost</th>
                  <th className="py-2.5 px-2 text-right">Cost / Reg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(stats?.channel_performance || []).map((ch) => (
                  <tr key={ch.channel} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2 font-medium text-white">{ch.channel}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-200 font-semibold">{ch.registrations}</td>
                    <td className="py-3 px-2 text-right font-mono text-indigo-300">{ch.conversion_rate}%</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-300">₹{ch.cost_inr}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-emerald-400">
                      ₹{ch.cost_per_reg.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>💡 <strong>Growth Insight:</strong> Referrals and WhatsApp deliver 55% of all signups at ₹1.64 blended CPA.</span>
          </div>
        </div>

      </div>

      {/* AI Growth Copilot Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#070b13] shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Growth Copilot</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  Live Strategy Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">Automated campaign intelligence and viral sprint generator</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadCopilot('experiment')}
              disabled={copilotLoading}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Experiment</span>
            </button>

            <button
              onClick={() => loadCopilot('whatsapp_copy')}
              disabled={copilotLoading}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Generate WhatsApp Message</span>
            </button>
          </div>
        </div>

        {copilotLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>AI Copilot is analyzing campaign telemetry...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Analysis Block */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-100 leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Campaign Diagnosis</span>
              </div>
              <p>{copilotData?.analysis}</p>
            </div>

            {/* Key Findings */}
            {copilotData?.key_findings && copilotData.key_findings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Key Metric Discoveries
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {copilotData.key_findings.map((finding, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      • {finding}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Experiments */}
            {copilotData?.recommended_experiments && copilotData.recommended_experiments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Suggested Growth Experiments to Reach 500 Registrations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {copilotData.recommended_experiments.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{exp.title}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">
                          {exp.estimated_impact}
                        </span>
                      </div>
                      <p className="text-slate-300">{exp.hypothesis}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Channel: <strong className="text-indigo-300">{exp.target_channel}</strong></span>
                        <span>Budget: <strong className="text-emerald-300">{exp.budget_needed}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated WhatsApp Broadcast Copy */}
            {copilotData?.generated_copy && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>Generated High-CTR WhatsApp Broadcast Message</span>
                  </h4>
                  <button
                    onClick={handleCopyGeneratedText}
                    className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedCopy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCopy ? 'Copied!' : 'Copy Broadcast'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#090d16] border border-emerald-500/30 text-xs font-mono text-emerald-200 whitespace-pre-wrap leading-relaxed">
                  {copilotData.generated_copy}
                </pre>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
