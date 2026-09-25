import React, { useState } from 'react';
import { ObservationProgress } from '../../types';
import { History, TrendingUp, AlertTriangle } from 'lucide-react';

interface TemporalProgressProps {
  timeline: ObservationProgress[];
}

export const TemporalProgress: React.FC<TemporalProgressProps> = ({ timeline }) => {
  const [selectedObsIndex, setSelectedObsIndex] = useState<number>(timeline.length - 1);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-xs text-slate-400 py-3 text-center">
        No multi-observation historical timeline available.
      </div>
    );
  }

  const activeObs = timeline[selectedObsIndex];
  const maxArea = Math.max(...timeline.map(t => t.changeAreaSqM), 1);

  return (
    <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            Temporal Progression Model
          </h4>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>Persistent Growth Tracked</span>
        </div>
      </div>

      {/* Progression Flow Summary (0 m² → 85 m² → 210 m² → 420 m²) */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded p-2 text-xs">
        <span className="text-[11px] font-semibold text-slate-400">Change Footprint:</span>
        <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-slate-200 overflow-x-auto">
          {timeline.map((obs, idx) => (
            <React.Fragment key={obs.observationId}>
              <button
                onClick={() => setSelectedObsIndex(idx)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  selectedObsIndex === idx
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Click to view ${obs.label}`}
              >
                {obs.changeAreaSqM} m²
              </button>
              {idx < timeline.length - 1 && (
                <span className="text-slate-400 font-normal">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Timeline Stepper */}
      <div className="relative pt-2">
        <div className="absolute top-5 left-3 right-3 h-0.5 bg-slate-800" />
        <div className="grid grid-cols-4 gap-2 relative">
          {timeline.map((obs, index) => {
            const isSelected = selectedObsIndex === index;
            const isLast = index === timeline.length - 1;
            const areaPct = Math.round((obs.changeAreaSqM / maxArea) * 100);

            return (
              <button
                key={obs.observationId}
                onClick={() => setSelectedObsIndex(index)}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                {/* Step Node */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-110'
                      : isLast
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400/40'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Date / Label */}
                <span
                  className={`mt-2 text-[10px] font-semibold leading-tight ${
                    isSelected ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  {obs.label}
                </span>

                {/* Footprint Indicator */}
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {obs.changeAreaSqM} m²
                </span>

                {/* Mini Bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.max(areaPct, 6)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Observation Detail Card */}
      {activeObs && (
        <div className="mt-3 p-2.5 rounded bg-slate-900/90 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">
              Observation #{selectedObsIndex + 1} ({activeObs.date})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {activeObs.stageBadge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeObs.description}
          </p>
        </div>
      )}

      {/* Innovation Note */}
      <div className="flex items-start space-x-2 pt-1 text-[10px] text-slate-400 italic">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Key Insight:</strong> Ongoing temporal progression over 4 consecutive satellite passes differentiates active construction from temporary seasonal vegetation variations.
        </span>
      </div>
    </div>
  );
};
