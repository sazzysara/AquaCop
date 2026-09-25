import React, { useState } from 'react';
import {
  Droplets,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Play,
  Upload,
  FileText,
  BookOpen,
  Eye,
  Edit2,
  TrendingUp,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { GISMap } from '../components/map/GISMap';
import { WaterBody, Alert } from '../types';

interface DashboardPageProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  onNavigateTab: (tab: any) => void;
  bufferDistance: number;
}

const trendData = [
  { month: 'Nov 2024', detected: 4, verified: 2 },
  { month: 'Dec 2024', detected: 7, verified: 3 },
  { month: 'Jan 2025', detected: 5, verified: 4 },
  { month: 'Feb 2025', detected: 11, verified: 6 },
  { month: 'Mar 2025', detected: 14, verified: 9 },
  { month: 'Apr 2025', detected: 8, verified: 7 }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  waterBodies,
  alerts,
  selectedAlert,
  onSelectAlert,
  onNavigateTab,
  bufferDistance
}) => {
  const [trendPeriod, setTrendPeriod] = useState('Last 6 Months');
  const [activePreviewAlert, setActivePreviewAlert] = useState<Alert>(alerts[0] || null);

  const previewAlert = activePreviewAlert || alerts[0];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F4F6FA] text-slate-800 p-6 space-y-6">
      {/* 1. Top Summary KPI Cards (4 in a row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Water Bodies */}
        <div
          onClick={() => onNavigateTab('waterbodies')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Water Bodies
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">186</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
              +2 new this month
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Droplets className="w-7 h-7" />
          </div>
        </div>

        {/* Protected Zones */}
        <div
          onClick={() => onNavigateTab('protectedzones')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Protected Zones
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">424</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
              +5 new this month
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Active Alerts */}
        <div
          onClick={() => onNavigateTab('alerts')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Alerts
            </p>
            <h3 className="text-3xl font-extrabold text-rose-600 tracking-tight">8</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1">
              +3 new this week
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </div>

        {/* Resolved Cases */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Cases
            </p>
            <h3 className="text-3xl font-extrabold text-indigo-600 tracking-tight">27</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1">
              +4 this month
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Monitoring Map (Left 60%) + Recent Alerts (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monitoring Map */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[430px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">Monitoring Map</h3>
              <span className="text-xs text-slate-400 font-medium">(Vellalore Lake Basin, Coimbatore)</span>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Full Screen Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 rounded-lg overflow-hidden relative mt-3 border border-slate-200">
            <GISMap
              waterBodies={waterBodies}
              alerts={alerts}
              selectedAlert={selectedAlert}
              onSelectAlert={onSelectAlert}
              bufferDistance={bufferDistance}
            />

            {/* Floating Layer Legend in Map */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-md z-[1000] text-[11px] space-y-1.5 min-w-[170px]">
              <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1">
                Map Layers
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                  Water Body Boundary
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded border border-dashed border-emerald-500 inline-block"></span>
                  Protected Zone (Buffer)
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-rose-600 w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>
                  Detected Changes
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-amber-600 w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
                  Buildings
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-slate-600 w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block"></span>
                  Roads
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[430px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Alerts</h3>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1">
            {alerts.slice(0, 5).map(alert => {
              const isHigh = alert.riskLevel === 'HIGH' || alert.riskLevel === 'VERY HIGH';
              const isMed = alert.riskLevel === 'MEDIUM';
              const isSelected = previewAlert?.id === alert.id;

              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    setActivePreviewAlert(alert);
                    onSelectAlert(alert);
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span>{alert.changeType} Detected</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{alert.locationName}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{alert.detectionDate}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                        isHigh
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : isMed
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {alert.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Encroachment Trends + Quick Actions + Map View Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Encroachment Trends (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Encroachment Trends</h3>
              <p className="text-[11px] text-slate-400">Monthly anomaly frequency</p>
            </div>
            <select
              value={trendPeriod}
              onChange={e => setTrendPeriod(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 focus:outline-none"
            >
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Year 2025</option>
            </select>
          </div>

          <div className="h-52 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="detected"
                  name="Detected Changes"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  name="Confirmed Violations"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Quick Actions</h3>
            <p className="text-[11px] text-slate-400">Administrative operational tools</p>
          </div>

          <div className="space-y-2.5 my-auto py-2">
            <button
              onClick={() => onNavigateTab('map')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all text-left"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run New Analysis</span>
            </button>

            <button
              onClick={() => alert('Manual GeoJSON/Shapefile Upload Dialog')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all text-left"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload Manual Data</span>
            </button>

            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all text-left"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Generate Report</span>
            </button>

            <button
              onClick={() => alert('Viewing Tamil Nadu State Wetland Policy and CRZ Notification 2019')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all text-left"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>View Policy/Guidelines</span>
            </button>
          </div>
        </div>

        {/* Map View Preview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Map View Preview</h3>
              <p className="text-[11px] text-slate-400">Satellite temporal comparison</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              #{previewAlert?.id || 'C-1042'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 block">
                Before (Jan 2025)
              </span>
              <div className="h-28 rounded-lg overflow-hidden border border-slate-200 relative group">
                <img
                  src={previewAlert?.beforeImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80'}
                  alt="Before Observation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  Jan 2025
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 block">
                After (Apr 2025)
              </span>
              <div className="h-28 rounded-lg overflow-hidden border border-rose-300 relative group ring-1 ring-rose-400/40">
                <img
                  src={previewAlert?.afterImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80'}
                  alt="After Observation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 left-1 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                  Apr 2025
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
              <span className="font-semibold text-slate-800">{previewAlert?.waterBodyName || 'Vellalore Lake'}</span>
              <span className="block truncate">11.0281° N, 77.0086° E · {((previewAlert?.changedAreaSqM || 4200) / 10000).toFixed(2)} ha</span>
            </div>

            <button
              onClick={() => onNavigateTab('alerts')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Detected Changes Table (Full Width) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Detected Changes</h3>
            <p className="text-xs text-slate-400">Automated optical & SAR temporal detections</p>
          </div>
          <button
            onClick={() => onNavigateTab('alerts')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All 52 Detections <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Water Body</th>
                <th className="py-3 px-3">Change Type</th>
                <th className="py-3 px-3">Date Detected</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.slice(0, 6).map(alert => {
                const isHigh = alert.riskScore >= 75;
                const isMed = alert.riskScore >= 50 && alert.riskScore < 75;

                return (
                  <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {alert.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {alert.locationName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {alert.waterBodyName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {alert.changeType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {alert.detectionDate}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 font-semibold">
                      {alert.confidence}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isHigh
                            ? 'bg-rose-100 text-rose-700'
                            : isMed
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          alert.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : alert.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {alert.status === 'New' ? 'Open' : alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            onSelectAlert(alert);
                            onNavigateTab('alerts');
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigateTab('map')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
                          title="Inspect on Map"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
