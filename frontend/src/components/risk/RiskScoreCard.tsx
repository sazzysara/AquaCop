import React from 'react';
import { RiskBreakdown } from '../../types';
import { ShieldAlert, Info } from 'lucide-react';

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
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-500'
        };
      case 'HIGH':
        return {
          bg: 'bg-rose-50/70',
          border: 'border-rose-200',
          text: 'text-rose-700',
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-500'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          badge: 'bg-amber-500 text-white font-bold',
          bar: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
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
    { label: 'Construction Growth Score', score: constructionGrowthScore, max: 20 },
    { label: 'Detection Confidence Score', score: confidenceScore, max: 20 }
  ];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 space-y-3.5 shadow-sm`}>
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className={`w-4 h-4 ${colors.text}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Inspection Priority Risk Score
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Evaluates ecological proximity, buffer overlap & construction velocity
          </p>
        </div>

        {/* Big Badge */}
        <div className="text-right">
          <div className="flex items-baseline space-x-1 justify-end">
            <span className="text-3xl font-black font-mono tracking-tight text-slate-900">
              {totalScore}
            </span>
            <span className="text-xs font-mono text-slate-400">/100</span>
          </div>
          <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${colors.badge}`}>
            {riskLevel} RISK
          </span>
        </div>
      </div>

      {/* Progress Bars */}
      {!compact && (
        <div className="space-y-2 pt-2 border-t border-slate-200/60">
          {factors.map((factor, idx) => {
            const pct = (factor.score / factor.max) * 100;
            return (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">{factor.label}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {factor.score}/{factor.max}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Narrative Explanation */}
      {explanation && (
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start space-x-2">
          <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
};
