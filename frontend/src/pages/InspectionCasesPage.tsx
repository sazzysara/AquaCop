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
  Search,
  FileText,
  ShieldAlert,
  Layers,
  ArrowRight
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
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Pending Assignment</span>
          </span>
        );
      case 'Assigned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
            <UserCheck className="w-3 h-3 text-blue-500" />
            <span>Inspector Assigned</span>
          </span>
        );
      case 'Field Inspection Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-purple-500" />
            <span>Field Inspection Done</span>
          </span>
        );
      case 'Verified':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span>Encroachment Confirmed</span>
          </span>
        );
      case 'False Positive':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-slate-400" />
            <span>False Positive</span>
          </span>
        );
      case 'Action Required':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white flex items-center space-x-1 shadow-sm">
            <AlertTriangle className="w-3 h-3" />
            <span>Demolition Order</span>
          </span>
        );
      case 'Closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
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
    <div className="flex-1 flex flex-col h-full bg-[#F4F6FA] overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                Field Verification & Enforcement Cases
              </h2>
              <p className="text-xs text-slate-500">
                Dispatch workflow for revenue inspectors, taluk surveyors, and water resource engineers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-medium">
            Total Cases: <strong className="text-slate-900 font-mono ml-1">{cases.length}</strong>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium">
            Active Workflow: <strong className="text-blue-900 font-mono ml-1">{cases.filter(c => c.status !== 'Closed').length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Case ID, Officer, or Location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-xs"
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
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left: Case List (Scrollable Card) */}
        <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Inspection Docket</span>
            <span className="text-[11px] text-slate-400 font-normal">{filteredCases.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
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
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {c.caseId}
                      </span>
                      {getStatusBadge(c.status)}
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {c.locationName}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center space-x-1 truncate max-w-[150px]">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{c.waterBodyName}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {c.createdDate}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="truncate max-w-[160px] text-slate-500">
                        Officer: <strong className="text-slate-800 font-medium">{c.assignedInspector}</strong>
                      </span>
                      <span className="font-mono text-rose-600 font-bold">
                        Risk {c.riskScore}/100
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Case Details & Action Workflow */}
        <div className="hidden md:flex flex-1 flex-col overflow-y-auto bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          {selectedCase ? (
            <div className="space-y-6 max-w-3xl">
              {/* Header Card */}
              <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-blue-600">
                      {selectedCase.caseId}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-xs text-slate-500">
                      Ref Alert: {selectedCase.alertId}
                    </span>
                  </div>
                  {getStatusBadge(selectedCase.status)}
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {selectedCase.locationName}
                </h3>

                <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium uppercase tracking-wider">Water Body</span>
                    <strong className="text-slate-800">{selectedCase.waterBodyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium uppercase tracking-wider">Inspection Priority</span>
                    <strong className="text-rose-600 font-mono font-bold">
                      {selectedCase.riskScore}/100 ({selectedCase.riskLevel})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-medium uppercase tracking-wider">Case Initiated</span>
                    <strong className="text-slate-800 font-mono">{selectedCase.createdDate}</strong>
                  </div>
                </div>
              </div>

              {/* Satellite Evidence Snapshot */}
              <div className="p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Detection Evidence & Satellite Metrics</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Change Type</span>
                    <strong className="text-slate-800 font-medium">
                      {selectedCase.detectionEvidence.changeType}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Changed Footprint</span>
                    <strong className="text-slate-800 font-mono">
                      {selectedCase.detectionEvidence.changedAreaSqM} m²
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Dist. to Water</span>
                    <strong className="text-rose-600 font-mono font-bold">
                      {selectedCase.detectionEvidence.distanceToWaterMeters} meters
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Confidence</span>
                    <strong className="text-emerald-600 font-mono font-bold">
                      {selectedCase.detectionEvidence.confidence}%
                    </strong>
                  </div>
                </div>

                {/* Evidence Images */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-40 relative shadow-sm">
                    <img
                      src={selectedCase.detectionEvidence.beforeImage}
                      alt="Baseline"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-medium">
                      Baseline Satellite Pass
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-40 relative shadow-sm">
                    <img
                      src={selectedCase.detectionEvidence.afterImage}
                      alt="Detected Footprint"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-rose-900/80 text-white text-[10px] font-medium">
                      Detection Observation Pass
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspector Remarks & Field Finding */}
              <div className="p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Assigned Field Officer & Recorded Remarks</span>
                </h4>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-500">
                    Assigned Officer: <strong className="text-slate-800 font-semibold">{selectedCase.assignedInspector}</strong>
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    {selectedCase.inspectorRemarks || 'No directives recorded yet.'}
                  </p>
                </div>

                {selectedCase.fieldVerificationResult && (
                  <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span>Field Inspection Verification Log</span>
                      <span className="font-mono text-[10px] text-emerald-700">
                        {selectedCase.fieldVerificationResult.inspectionDate}
                      </span>
                    </div>
                    <div className="text-emerald-900">
                      <strong>Finding: </strong>
                      {selectedCase.fieldVerificationResult.finding}
                    </div>
                    <div className="text-emerald-900">
                      <strong>Action Taken: </strong>
                      {selectedCase.fieldVerificationResult.actionTaken}
                    </div>
                  </div>
                )}
              </div>

              {/* Case Workflow Status Transitions */}
              <div className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Update Official Case Status
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-600 font-medium">
                    Action Remarks / Enforcement Order Reference:
                  </label>
                  <input
                    type="text"
                    value={actionRemarks}
                    onChange={e => setActionRemarks(e.target.value)}
                    placeholder="e.g. Survey demarcated under TN Act. Eviction notice issued."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2 flex-wrap gap-y-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Field Inspection Completed')}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Mark Inspection Completed
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Verified')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    Confirm Encroachment
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('False Positive')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    Mark False Positive
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Action Required')}
                    className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    Issue Eviction Order
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('Closed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    Close Case (Restored)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select an inspection case from the left docket to view details and execute workflow actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
