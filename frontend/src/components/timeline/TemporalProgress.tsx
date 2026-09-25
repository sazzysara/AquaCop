import React, { useState } from 'react';
import { ObservationProgress } from '../../types';
import { History, TrendingUp } from 'lucide-react';

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
    <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Temporal Progression Model
          </h4>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-blue-600 font-bold">
          <TrendingUp className="w-3 h-3" />
          <span>Persistent Growth Tracked</span>
        </div>
      </div>

      {/* Progression Flow Summary */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 text-xs">
        <span className="text-[11px] font-semibold text-slate-500">Change Footprint:</span>
        <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-slate-800 overflow-x-auto">
          {timeline.map((obs, idx) => (
            <React.Fragment key={obs.observationId}>
              <button
                onClick={() => setSelectedObsIndex(idx)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  selectedObsIndex === idx
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title={`Click to view ${obs.label}`}
              >
                {obs.changeAreaSqM} m²
              </button>
              {idx < timeline.length - 1 && (
                <span className="text-slate-300 font-normal">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Timeline Stepper */}
      <div className="relative pt-2">
        <div className="absolute top-5 left-3 right-3 h-0.5 bg-slate-200" />
        <div className="grid grid-cols-4 gap-2 relative">
          {timeline.map((obs, index) => {
            const isSelected = selectedObsIndex === index;
            const isLast = index === timeline.length - 1;

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
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110 shadow-sm'
                      : isLast
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400/40'
                      : 'bg-white border border-slate-300 text-slate-600 group-hover:bg-slate-100'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Date / Label */}
                <span
                  className={`mt-2 text-[10px] font-semibold leading-tight ${
                    isSelected ? 'text-blue-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {obs.label}
                </span>

                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {obs.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selected Observation Detail Card */}
      {activeObs && (
        <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{activeObs.stageBadge}</span>
            <span className="font-mono text-[11px] font-bold text-blue-600">
              {activeObs.changeAreaSqM} m² ({((activeObs.changeAreaSqM) / 10000).toFixed(2)} ha)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {activeObs.description}
          </p>
        </div>
      )}
    </div>
  );
};
