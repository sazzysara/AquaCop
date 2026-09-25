import React, { useState, useMemo } from 'react';
import { Alert, AlertStatus, RiskLevel, ChangeType } from '../types';
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  FilePlus
} from 'lucide-react';

interface AlertsPageProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  onCreateCase: (alert: Alert) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onSelectAlert,
  onCreateCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'date' | 'area'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        const matchesSearch =
          alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.waterBodyName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
        const matchesRisk = riskFilter === 'ALL' || alert.riskLevel === riskFilter;
        const matchesType = typeFilter === 'ALL' || alert.changeType === typeFilter;

        return matchesSearch && matchesStatus && matchesRisk && matchesType;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'risk') {
          diff = a.riskScore - b.riskScore;
        } else if (sortBy === 'date') {
          diff = new Date(a.detectionDate).getTime() - new Date(b.detectionDate).getTime();
        } else if (sortBy === 'area') {
          diff = a.changedAreaSqM - b.changedAreaSqM;
        }
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [alerts, searchTerm, statusFilter, riskFilter, typeFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'risk' | 'date' | 'area') => {
    if (sortBy === field) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'VERY HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {score} • VERY HIGH
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {score} • HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            {score} • MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {score} • LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'New':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            New
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Under Review
          </span>
        );
      case 'Inspection Assigned':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Inspection Assigned
          </span>
        );
      case 'Field Verified':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Field Verified
          </span>
        );
      case 'Closed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Page Header */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Potential Encroachment Alerts Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated change detection logs requiring physical verification by Taluk & WRD survey officers.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Total Alerts: <strong className="text-white font-mono">{alerts.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
            High Priority: <strong className="text-rose-200 font-mono">{alerts.filter(a => a.riskScore >= 76).length}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="flex items-center space-x-3 flex-1 min-w-[280px] max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by ID, village, or lake name..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Inspection Assigned">Inspection Assigned</option>
            <option value="Field Verified">Field Verified</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="VERY HIGH">Very High</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Change Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Change Types</option>
            <option value="New Construction">New Construction</option>
            <option value="Land Filling">Land Filling</option>
            <option value="Road/Surface Change">Road/Surface Change</option>
            <option value="Vegetation Change">Vegetation Change</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Alert ID</th>
                <th className="p-3.5">Location & Water Body</th>
                <th className="p-3.5">Change Type</th>
                <th
                  onClick={() => toggleSort('area')}
                  className="p-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Footprint Area</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Dist. to Water</th>
                <th
                  onClick={() => toggleSort('risk')}
                  className="p-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('date')}
                  className="p-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Detection Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No encroachment alerts match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectAlert(alert)}
                  >
                    {/* Alert ID */}
                    <td className="p-3.5 font-mono font-bold text-sky-400">
                      {alert.id}
                    </td>

                    {/* Location */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                        {alert.locationName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>{alert.waterBodyName} ({alert.district})</span>
                      </div>
                    </td>

                    {/* Change Type */}
                    <td className="p-3.5">
                      <span className="font-mono text-slate-300 font-medium bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {alert.changeType}
                      </span>
                    </td>

                    {/* Area */}
                    <td className="p-3.5 font-mono text-slate-200">
                      <strong>+{alert.changedAreaSqM}</strong> m²
                      <span className="text-[10px] text-slate-400 block font-sans">
                        ({alert.confidence}% conf)
                      </span>
                    </td>

                    {/* Distance to Water */}
                    <td className="p-3.5 font-mono">
                      <div className={alert.insideBuffer ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {alert.distanceToWaterMeters} m
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {alert.insideBuffer ? 'Inside Core Buffer' : 'Outside Core Buffer'}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="p-3.5">
                      {getRiskBadge(alert.riskLevel, alert.riskScore)}
                    </td>

                    {/* Detection Date */}
                    <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                      {alert.detectionDate}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {getStatusBadge(alert.status)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectAlert(alert)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
                          title="Inspect on GIS Map"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        {!alert.associatedCaseId && (
                          <button
                            onClick={() => onCreateCase(alert)}
                            className="px-2.5 py-1 rounded bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40 transition-colors flex items-center space-x-1"
                            title="Create Inspection Case"
                          >
                            <FilePlus className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
