import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  color?: 'indigo' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  sublabel,
  showPercentage = true,
  color = 'indigo'
}) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));

  const gradientColors = {
    indigo: 'from-indigo-600 via-indigo-500 to-violet-500 shadow-indigo-500/20',
    emerald: 'from-emerald-600 via-emerald-500 to-teal-400 shadow-emerald-500/20',
    amber: 'from-amber-500 via-orange-500 to-yellow-400 shadow-amber-500/20',
  };

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{label}</span>
            {sublabel && <span className="text-slate-400 text-xs">({sublabel})</span>}
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-white font-bold">{current}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{target}</span>
            {showPercentage && (
              <span className="ml-1 text-indigo-400 font-semibold">({percentage}%)</span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar Track */}
      <div className="h-3.5 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60 relative">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientColors[color]} shadow-lg transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};
