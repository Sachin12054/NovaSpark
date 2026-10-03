import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export const SimulatedBanner: React.FC<{ customText?: string }> = ({ customText }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-y border-amber-500/20 py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-300/90 font-medium">
        <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>
          {customText || "SIMULATION MODE ACTIVE: 500 engineering student registration campaign & ₹2,000 budget challenge for NxtWave Growth Intern."}
        </span>
        <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
          Evaluator Ready
        </span>
      </div>
    </div>
  );
};
