import React, { useState } from 'react';
import { Alert } from '../../types';
import { X, ClipboardCheck, User, FileText, Send, ShieldAlert } from 'lucide-react';

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
    'Smt. M. Kanimozhi (Tahsildar, Coimbatore South)',
    'Dr. V. Ramanathan (Forest Ranger, Coimbatore Wetland Range)',
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Dispatch Field Verification Case
              </h3>
              <p className="text-[11px] text-slate-500">
                Official dispatch to District Revenue & WRD inspection officers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Detection Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-700">Alert #{alert.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                {alert.riskLevel} PRIORITY
              </span>
            </div>
            <p className="font-bold text-slate-900">{alert.locationName}</p>
            <p className="text-[11px] text-slate-500">
              {alert.changeType} · {alert.changedAreaSqM} m² · {alert.distanceToWaterMeters}m from water bund
            </p>
          </div>

          {/* Assigned Inspector Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Assigned Field Inspector / Revenue Officer</span>
            </label>
            <select
              value={inspector}
              onChange={e => setInspector(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              {inspectorsList.map((insp, idx) => (
                <option key={idx} value={insp}>
                  {insp}
                </option>
              ))}
            </select>
          </div>

          {/* Official Remarks Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Inspection Instructions & Remarks</span>
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
              placeholder="Enter official directives..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
