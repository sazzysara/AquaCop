import React, { useState } from 'react';
import { Alert } from '../../types';
import { X, ClipboardCheck, User, FileText, AlertTriangle } from 'lucide-react';

interface CreateInspectionModalProps {
  alert: Alert;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    alertId: string;
    assignedInspector: string;
    remarks: string;
  }) => Promise<void>;
}

export const CreateInspectionModal: React.FC<CreateInspectionModalProps> = ({
  alert,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [inspector, setInspector] = useState('Er. R. Senthil Kumar (AE, Water Resources Dept)');
  const [remarks, setRemarks] = useState(
    `Field verification recommended for ${alert.changeType} detected ${alert.distanceToWaterMeters}m from ${alert.waterBodyName} boundary. Footprint: ${alert.changedAreaSqM} m².`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const inspectorsList = [
    'Er. R. Senthil Kumar (AE, Water Resources Dept)',
    'Smt. M. Kanimozhi (Tahsildar, Sholinganallur)',
    'Dr. V. Ramanathan (Forest Ranger, Nanmangalam Wetland Range)',
    'Thiru. K. Prabhakaran (District Revenue Officer)',
    'Er. S. Anbarasan (Executive Engineer, WRD Basin Circle)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        alertId: alert.id,
        assignedInspector: inspector,
        remarks
      });
      onClose();
    } catch (err) {
      console.error('Failed to create inspection case:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Create Field Inspection Case
              </h3>
              <p className="text-[11px] text-slate-400">
                Official dispatch of field survey officer for verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Alert Summary Card */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sky-400 font-bold">{alert.id}</span>
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                RISK SCORE: {alert.riskScore}/100 ({alert.riskLevel})
              </span>
            </div>
            <div className="text-slate-300 font-medium">{alert.locationName}</div>
            <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
              <span>Water Body: <strong className="text-slate-200">{alert.waterBodyName}</strong></span>
              <span>Distance: <strong className="text-slate-200">{alert.distanceToWaterMeters}m</strong></span>
              <span>Area: <strong className="text-slate-200">{alert.changedAreaSqM} m²</strong></span>
            </div>
          </div>

          {/* Assigned Inspector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Assigned Field Verification Officer</span>
            </label>
            <select
              value={inspector}
              onChange={e => setInspector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {inspectorsList.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Inspection Directives / Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Authority Directives & Initial Remarks</span>
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
              placeholder="Enter special inspection terms, revenue survey numbers, or required instruments..."
            />
          </div>

          {/* Important Procedural Guidance Banner */}
          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <span className="leading-snug">
              Official notice: Creation of an inspection case requests physical verification under Section 4 of the TN Protection of Tanks and Eviction of Encroachment Act.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Inspection Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
