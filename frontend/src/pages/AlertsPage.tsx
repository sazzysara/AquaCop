import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Calendar,
  MapPin,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { Alert } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  onCreateCase?: (alert: Alert) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onSelectAlert,
  onCreateCase
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [waterBodyFilter, setWaterBodyFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAlertItem, setSelectedAlertItem] = useState<Alert>(alerts[0] || null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (
        searchQuery &&
        !alert.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.locationName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.changeType.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (districtFilter !== 'All' && !alert.district.toLowerCase().includes(districtFilter.toLowerCase())) {
        return false;
      }
      if (waterBodyFilter !== 'All' && alert.waterBodyName !== waterBodyFilter) {
        return false;
      }
      if (severityFilter !== 'All' && alert.riskLevel !== severityFilter) {
        return false;
      }
      if (statusFilter !== 'All') {
        const matchesOpen = statusFilter === 'Open' && (alert.status === 'New' || alert.status === 'Under Review');
        const matchesClosed = statusFilter === 'Closed' && alert.status === 'Closed';
        const matchesVerified = statusFilter === 'Verified' && (alert.status === 'Field Verified' || alert.status === 'Inspection Assigned');
        if (!matchesOpen && !matchesClosed && !matchesVerified) return false;
      }
      return true;
    });
  }, [alerts, searchQuery, districtFilter, waterBodyFilter, severityFilter, statusFilter]);

  const activeAlert = selectedAlertItem || filteredAlerts[0] || alerts[0];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F4F6FA] text-slate-800 p-6 space-y-6">
      {/* 1. Filter Toolbar Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search alerts..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="All">All Districts</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Chennai">Chennai</option>
              <option value="Chengalpattu">Chengalpattu</option>
              <option value="Kadalur">Cuddalore</option>
              <option value="Tirunelveli">Tirunelveli</option>
            </select>
          </div>

          {/* Water Bodies Dropdown */}
          <div>
            <select
              value={waterBodyFilter}
              onChange={e => setWaterBodyFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="All">All Water Bodies</option>
              <option value="Vellalore Lake">Vellalore Lake</option>
              <option value="Ukkadam Lake">Ukkadam Lake</option>
              <option value="Pallikaranai Marshland">Pallikaranai Marsh</option>
              <option value="Bay of Bengal Coastline">Kadalur Coast</option>
              <option value="Puzhal Lake (Red Hills)">Puzhal Lake</option>
            </select>
          </div>

          {/* Severity Dropdown */}
          <div>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="All">All Severities</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low Severity</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Alerts Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Water Body</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Date Detected</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map(alert => {
                const isSelected = activeAlert?.id === alert.id;
                const isHigh = alert.riskLevel === 'HIGH' || alert.riskLevel === 'VERY HIGH';
                const isMed = alert.riskLevel === 'MEDIUM';

                return (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlertItem(alert)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {alert.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {alert.locationName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {alert.waterBodyName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {alert.changeType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {alert.detectionDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isHigh
                            ? 'bg-rose-100 text-rose-700'
                            : isMed
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          alert.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : alert.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-700'
                            : alert.status === 'Inspection Assigned' || alert.status === 'Field Verified'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {alert.status === 'New' ? 'Open' : alert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedAlertItem(alert);
                            onSelectAlert(alert);
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (onCreateCase) onCreateCase(alert);
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-purple-600 transition-colors"
                          title="Dispatch Case"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs">
              5
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            Showing 1-{Math.min(filteredAlerts.length, 8)} of {filteredAlerts.length} alerts
          </div>
        </div>
      </div>

      {/* 3. Bottom Alert Visual Satellite Comparison Drawer */}
      {activeAlert && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Before Satellite Visual (4 cols) */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Before ({activeAlert.previousObservationDate || 'Jan 2025'})</span>
                <span className="text-[10px] text-slate-400 font-mono">Sentinel-2 Optical</span>
              </div>
              <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative group shadow-inner">
                <img
                  src={activeAlert.beforeImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80'}
                  alt="Before satellite"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {activeAlert.previousObservationDate || 'Jan 2025'} (Baseline)
                </span>
              </div>
            </div>

            {/* Middle Alert Metadata (4 cols) */}
            <div className="lg:col-span-4 space-y-3 px-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Alert #{activeAlert.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700">
                  {activeAlert.riskLevel}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {activeAlert.changeType}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeAlert.locationName}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-mono font-bold text-blue-700">11.0281° N, 77.0086° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Changed Area:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {((activeAlert.changedAreaSqM || 4200) / 10000).toFixed(2)} ha
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Confidence:</span>
                  <span className="font-mono font-bold text-emerald-600">{activeAlert.confidence} (87%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-blue-700">Active</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectAlert(activeAlert)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details & Timeline</span>
                </button>
              </div>
            </div>

            {/* After Satellite Visual (4 cols) */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>After ({activeAlert.detectionDate || 'Apr 2025'})</span>
                <span className="text-[10px] text-rose-600 font-bold font-mono">Encroachment Confirmed</span>
              </div>
              <div className="h-44 rounded-xl overflow-hidden border border-rose-300 relative group ring-2 ring-rose-400/40 shadow-inner">
                <img
                  src={activeAlert.afterImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'}
                  alt="After satellite"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  {activeAlert.detectionDate || 'Apr 2025'} (Footprint Detected)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
