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
  AlertCircle,
  Eye,
  Send
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
    <div className="w-96 md:w-[460px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-[1500] overflow-hidden flex-shrink-0 animate-slideLeft">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-blue-600">#{alert.id}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  alert.status === 'New'
                    ? 'bg-blue-100 text-blue-700'
                    : alert.status === 'Inspection Assigned'
                    ? 'bg-amber-100 text-amber-800'
                    : alert.status === 'Field Verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {alert.status}
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 truncate max-w-[300px]">
              {alert.locationName}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800">
        {/* Risk Score Card */}
        <RiskScoreCard breakdown={alert.riskBreakdown} />

        {/* Spatial & Physical Attributes Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Water Body</span>
            </div>
            <div className="font-bold text-slate-900 truncate">{alert.waterBodyName}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <Compass className="w-3 h-3 text-blue-600" />
              <span>Distance to Water</span>
            </div>
            <div className="font-mono font-bold text-slate-900">
              {alert.distanceToWaterMeters} meters
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <Layers className="w-3 h-3 text-blue-600" />
              <span>Changed Footprint</span>
            </div>
            <div className="font-mono font-bold text-slate-900">
              {alert.changedAreaSqM.toLocaleString()} m² ({((alert.changedAreaSqM) / 10000).toFixed(2)} ha)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <Percent className="w-3 h-3 text-blue-600" />
              <span>Detection Confidence</span>
            </div>
            <div className="font-mono font-bold text-emerald-600">
              {(alert.confidence * 100).toFixed(0)}% AI Verified
            </div>
          </div>
        </div>

        {/* Before / After Split Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Satellite Observation (Jan 2025 vs Apr 2025)</span>
            <span className="text-[10px] text-slate-500 font-mono">Interactive Split Slider</span>
          </div>
          <ImageSlider
            beforeImage={alert.beforeImage}
            afterImage={alert.afterImage}
            beforeLabel={alert.previousObservationDate || 'Jan 2025 (Baseline)'}
            afterLabel={alert.detectionDate || 'Apr 2025 (Encroachment)'}
          />
        </div>

        {/* 4-Stage Construction Progression Timeline */}
        {alert.timeline && alert.timeline.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Temporal Construction Progression</span>
              <span className="text-[10px] text-blue-600 font-semibold">4 Observation Passes</span>
            </div>
            <TemporalProgress timeline={alert.timeline} />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={() => onCreateCase(alert)}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Dispatch Field Verification</span>
        </button>
      </div>
    </div>
  );
};
