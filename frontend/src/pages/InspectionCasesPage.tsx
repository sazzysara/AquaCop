import React, { useState } from 'react';
import { InspectionCase, InspectionStatus } from '../types';
import {
  ClipboardList,
  UserCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Filter,
  Search,
  FileText,
  ChevronRight
} from 'lucide-react';

interface InspectionCasesPageProps {
  cases: InspectionCase[];
  onUpdateCaseStatus: (
    caseId: string,
    status: InspectionStatus,
    remarks?: string
  ) => Promise<void>;
  onInspectAlert: (alertId: string) => void;
}

export const InspectionCasesPage: React.FC<InspectionCasesPageProps> = ({
  cases,
  onUpdateCaseStatus,
  onInspectAlert
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<InspectionCase | null>(
    cases[0] || null
  );
  const [actionRemarks, setActionRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredCases = cases.filter(c => {
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchSearch =
      c.caseId.toLowerCase().includes(search.toLowerCase()) ||
      c.alertId.toLowerCase().includes(search.toLowerCase()) ||
      c.locationName.toLowerCase().includes(search.toLowerCase()) ||
      c.waterBodyName.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedInspector.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case 'Pending Assignment':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Pending Assignment</span>
          </span>
        );
      case 'Assigned':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
            <UserCheck className="w-3 h-3" />
            <span>Inspector Assigned</span>
          </span>
        );
      case 'Field Inspection Completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Field Inspection Done</span>
          </span>
        );
      case 'Verified':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Encroachment Confirmed</span>
          </span>
        );
      case 'False Positive':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>False Positive</span>
          </span>
        );
      case 'Action Required':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Demolition / Eviction Order</span>
          </span>
        );
      case 'Closed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Restored / Closed</span>
          </span>
        );
    }
  };

  const handleStatusChange = async (newStatus: InspectionStatus) => {
    if (!selectedCase) return;
    setIsUpdating(true);
    try {
      await onUpdateCaseStatus(selectedCase.caseId, newStatus, actionRemarks);
      // Update local state
      setSelectedCase(prev =>
        prev
          ? {
              ...prev,
              status: newStatus,
              inspectorRemarks: actionRemarks || prev.inspectorRemarks
            }
          : null
      );
      setActionRemarks('');
    } catch (err) {
      console.error('Failed to update case status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Field Verification & Enforcement Cases
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch workflow for revenue inspectors, taluk surveyors, and water resource engineers.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Total Cases: <strong className="text-white font-mono">{cases.length}</strong>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300">
            Active Workflow: <strong className="text-sky-200 font-mono">{cases.filter(c => c.status !== 'Closed').length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Case ID, Officer, or Location..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Inspection Stages</option>
            <option value="Pending Assignment">Pending Assignment</option>
            <option value="Assigned">Assigned</option>
            <option value="Field Inspection Completed">Field Inspection Completed</option>
            <option value="Verified">Verified Encroachment</option>
            <option value="False Positive">False Positive</option>
            <option value="Action Required">Action Required</option>
            <option value="Closed">Closed / Restored</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: Cases List + Detail/Action Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Case List (Scrollable) */}
        <div className="w-full md:w-5/12 lg:w-4/12 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/80 bg-slate-900/40">
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No inspection cases found matching query.
            </div>
          ) : (
            filteredCases.map(c => {
              const isSelected = selectedCase?.caseId === c.caseId;
              return (
                <div
                  key={c.caseId}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-800/80 border-l-4 border-sky-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {c.caseId}
                    </span>
                    {getStatusBadge(c.status)}
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {c.locationName}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-sky-400" />
                      <span className="truncate max-w-[140px]">{c.waterBodyName}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {c.createdDate}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between">
                    <span className="truncate max-w-[170px] text-slate-400">
                      Officer: <strong className="text-slate-200">{c.assignedInspector}</strong>
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      Risk {c.riskScore}/100
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Case Details & Action Workflow */}
        <div className="hidden md:flex flex-1 flex-col overflow-y-auto p-6 bg-slate-950">
          {selectedCase ? (
            <div className="space-y-5 max-w-3xl">
              {/* Header */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-sky-400">
                      {selectedCase.caseId}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-xs text-slate-400">
                      Ref Alert: {selectedCase.alertId}
                    </span>
                  </div>
                  {getStatusBadge(selectedCase.status)}
                </div>

                <h3 className="text-base font-bold text-white">
                  {selectedCase.locationName}
                </h3>

                <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Water Body</span>
                    <strong className="text-slate-200">{selectedCase.waterBodyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Inspection Priority</span>
                    <strong className="text-rose-400 font-mono">
                      {selectedCase.riskScore}/100 ({selectedCase.riskLevel})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Case Initiated</span>
                    <strong className="text-slate-200 font-mono">{selectedCase.createdDate}</strong>
                  </div>
                </div>
              </div>

              {/* Satellite Evidence Snapshot */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Detection Evidence & Satellite Metrics</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Change Type</span>
                    <strong className="text-slate-200 font-mono">
                      {selectedCase.detectionEvidence.changeType}
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Changed Footprint</span>
                    <strong className="text-slate-200 font-mono">
                      {selectedCase.detectionEvidence.changedAreaSqM} m²
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Dist. to Water</span>
                    <strong className="text-rose-400 font-mono">
                      {selectedCase.detectionEvidence.distanceToWaterMeters} meters
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Confidence</span>
                    <strong className="text-emerald-400 font-mono">
                      {selectedCase.detectionEvidence.confidence}%
                    </strong>
                  </div>
                </div>

                {/* Evidence Images */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-36 relative">
                    <img
                      src={selectedCase.detectionEvidence.beforeImage}
                      alt="Baseline"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-sky-300 text-[10px] font-mono">
                      Baseline Satellite Pass
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-36 relative">
                    <img
                      src={selectedCase.detectionEvidence.afterImage}
                      alt="Detected Footprint"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-rose-300 text-[10px] font-mono">
                      Detection Observation Pass
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspector Remarks & Field Finding */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Assigned Field Officer & Recorded Remarks</span>
                </h4>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-400">
                    Assigned Officer: <strong className="text-slate-200">{selectedCase.assignedInspector}</strong>
                  </div>
                  <p className="text-slate-300 leading-relaxed pt-1">
                    {selectedCase.inspectorRemarks || 'No directives recorded yet.'}
                  </p>
                </div>

                {selectedCase.fieldVerificationResult && (
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Field Inspection Verification Log</span>
                      <span className="font-mono text-[10px]">
                        {selectedCase.fieldVerificationResult.inspectionDate}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      <strong>Finding: </strong>
                      {selectedCase.fieldVerificationResult.finding}
                    </div>
                    <div className="text-slate-300">
                      <strong>Action Taken: </strong>
                      {selectedCase.fieldVerificationResult.actionTaken}
                    </div>
                  </div>
                )}
              </div>

              {/* Case Workflow Status Transitions */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Update Official Case Status
                </h4>

                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400">
                    Action Remarks / Enforcement Order Reference:
                  </label>
                  <input
                    type="text"
                    value={actionRemarks}
                    onChange={e => setActionRemarks(e.target.value)}
                    placeholder="e.g. Survey demarcated under TN Act. Eviction notice issued."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2 flex-wrap gap-y-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Field Inspection Completed')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Mark Inspection Completed
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Verified')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
                  >
                    Confirm Encroachment
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('False Positive')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Mark False Positive
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Action Required')}
                    className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Issue Eviction Order
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Closed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Close Case (Restored)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select an inspection case from the left list to view details and execute workflow actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
