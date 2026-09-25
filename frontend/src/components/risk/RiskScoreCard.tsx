import React from 'react';
import { RiskBreakdown } from '../../types';
import { ShieldAlert, Info, HelpCircle } from 'lucide-react';

interface RiskScoreCardProps {
  breakdown: RiskBreakdown;
  compact?: boolean;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ breakdown, compact = false }) => {
  const {
    totalScore,
    riskLevel,
    waterProximityScore,
    bufferOverlapScore,
    recentChangeScore,
    constructionGrowthScore,
    confidenceScore,
    explanation
  } = breakdown;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'VERY HIGH':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-500'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-600 text-white',
          bar: 'bg-amber-500'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          badge: 'bg-yellow-600 text-slate-950 font-bold',
          bar: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-600 text-white',
          bar: 'bg-emerald-500'
        };
    }
  };

  const colors = getRiskColor(riskLevel);

  const factors = [
    { label: 'Water Proximity Score', score: waterProximityScore, max: 20 },
    { label: 'Buffer Overlap Score', score: bufferOverlapScore, max: 20 },
    { label: 'Recent Change Area Score', score: recentChangeScore, max: 20 },
    { label: 'Construction Progression Score', score: constructionGrowthScore, max: 20 },
    { label: 'Detection Confidence Score', score: confidenceScore, max: 20 }
  ];

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} p-3.5 space-y-3`}>
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className={`w-4 h-4 ${colors.text}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Inspection Priority / Risk Score
            </h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Objective algorithm evaluating ecological proximity & construction dynamics
          </p>
        </div>

        {/* Big Badge */}
        <div className="text-right">
          <div className="flex items-baseline space-x-1 justify-end">
            <span className="text-2xl font-black font-mono tracking-tight text-white">
              {totalScore}
            </span>
            <span className="text-xs font-mono text-slate-400">/100</span>
          </div>
          <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded shadow-sm ${colors.badge}`}>
            {riskLevel} RISK
          </span>
        </div>
      </div>

      {/* Progress Bars for the 5 Individual Components */}
      {!compact && (
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span>Factor Breakdown</span>
            <span className="text-[10px] font-mono text-slate-400">Component Weight (Max 20 ea)</span>
          </div>

          <div className="space-y-1.5">
            {factors.map(f => {
              const pct = (f.score / f.max) * 100;
              return (
                <div key={f.label} className="text-xs">
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">{f.label}</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {f.score}/{f.max}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rationale & Legal Disclaimer Notice */}
      <div className="pt-2 border-t border-slate-800/60 text-[10px] space-y-1 text-slate-400">
        <p className="leading-relaxed">
          <strong className="text-slate-300">Assessment: </strong>
          {explanation}
        </p>
        <div className="flex items-center space-x-1 text-slate-400 text-[9px] pt-1">
          <HelpCircle className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>
            Notice: This score prioritizes physical inspection logistics and does not constitute a judicial/statutory determination of illegality.
          </span>
        </div>
      </div>
    </div>
  );
};
