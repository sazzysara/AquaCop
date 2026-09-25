import React from 'react';
import { Alert } from '../../types';
import { ImageSlider } from './ImageSlider';
import { TemporalProgress } from '../timeline/TemporalProgress';
import { RiskScoreCard } from '../risk/RiskScoreCard';
import {
  X,
  MapPin,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  FilePlus,
  Compass,
  AlertCircle
} from 'lucide-react';

interface AlertDetailsDrawerProps {
  alert: Alert | null;
  onClose: () => void;
  onCreateCase: (alert: Alert) => void;
}

export const AlertDetailsDrawer: React.FC<AlertDetailsDrawerProps> = ({
  alert,
  onClose,
  onCreateCase
}) => {
  if (!alert) return null;

  return (
    <div className="w-96 md:w-[440px] bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-20 overflow-hidden flex-shrink-0 animate-slideLeft">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-sky-400">{alert.id}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  alert.status === 'New'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : alert.status === 'Inspection Assigned'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : alert.status === 'Field Verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {alert.status}
              </span>
            </div>
            <h3 className="text-xs font-semibold text-slate-200 truncate max-w-[280px]">
              {alert.locationName}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-200">
        {/* Risk Score Card */}
        <RiskScoreCard breakdown={alert.riskBreakdown} />

        {/* Spatial & Physical Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>Water Body</span>
            </div>
            <div className="font-semibold text-slate-200 truncate">{alert.waterBodyName}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>Distance to Water</span>
            </div>
            <div className="font-mono font-bold text-slate-200">
              {alert.distanceToWaterMeters} meters
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Buffer Status</span>
            </div>
            <div className="font-bold flex items-center space-x-1">
              {alert.insideBuffer ? (
                <span className="text-rose-400">INSIDE BUFFER (VIOLATION)</span>
              ) : (
                <span className="text-emerald-400">Outside Core Buffer</span>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Percent className="w-3 h-3 text-sky-400" />
              <span>Change Footprint</span>
            </div>
            <div className="font-mono font-bold text-slate-200">
              {alert.changedAreaSqM} m² (+{alert.confidence}% conf)
            </div>
          </div>
        </div>

        {/* Observation Dates */}
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Detection: <strong className="text-slate-200">{alert.detectionDate}</strong></span>
          </div>
          <div className="text-[11px] text-slate-400">
            Prev: <strong className="text-slate-300">{alert.previousObservationDate}</strong>
          </div>
        </div>

        {/* Change Type & Caution Terminology Tag */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Categorization:</span>
            <span className="font-bold text-sky-400 font-mono">{alert.changeType}</span>
          </div>
          <div className="flex items-start space-x-1.5 text-[11px] text-slate-300 pt-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Flagged as <strong>Potential Unauthorized Construction</strong>. Field inspection is recommended to confirm building sanctions or revenue titles.
            </span>
          </div>
        </div>

        {/* Interactive Satellite Before/After Slider */}
        <ImageSlider
          beforeImage={alert.beforeImage}
          afterImage={alert.afterImage}
          beforeDate={alert.previousObservationDate}
          afterDate={alert.detectionDate}
          changedAreaSqM={alert.changedAreaSqM}
          changeType={alert.changeType}
        />

        {/* Multi-Stage Temporal Progression Timeline */}
        <TemporalProgress timeline={alert.timeline} />
      </div>

      {/* Footer Action: Create Inspection Case */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex-shrink-0">
        {alert.associatedCaseId ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inspection Dispatched</span>
            </div>
            <span className="font-mono text-emerald-300 font-bold">{alert.associatedCaseId}</span>
          </div>
        ) : (
          <button
            onClick={() => onCreateCase(alert)}
            className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <FilePlus className="w-4 h-4" />
            <span>Create Inspection Case</span>
          </button>
        )}
      </div>
    </div>
  );
};
