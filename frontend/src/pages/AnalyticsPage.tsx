import React, { useState } from 'react';
import {
  Calendar,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  Database,
  Satellite,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const districtData = [
  { district: 'Coimbatore', detected: 42, verified: 31 },
  { district: 'Chennai', detected: 35, verified: 22 },
  { district: 'Chengalpattu', detected: 28, verified: 18 },
  { district: 'Cuddalore', detected: 19, verified: 12 },
  { district: 'Tirunelveli', detected: 14, verified: 8 }
];

const trendData = [
  { month: 'Nov', detected: 12, verified: 8 },
  { month: 'Dec', detected: 18, verified: 10 },
  { month: 'Jan', detected: 15, verified: 9 },
  { month: 'Feb', detected: 26, verified: 16 },
  { month: 'Mar', detected: 35, verified: 24 },
  { month: 'Apr', detected: 36, verified: 27 }
];

const reportsList = [
  {
    id: 'REP-001',
    name: 'Vellalore Lake - Monitoring Site Report',
    type: 'Water Body',
    date: '28 Apr 2025',
    size: '4.2 MB'
  },
  {
    id: 'REP-002',
    name: 'Coimbatore District - Monthly Summary',
    type: 'District',
    date: '25 Apr 2025',
    size: '8.7 MB'
  },
  {
    id: 'REP-003',
    name: 'Encroachment Evidence Report (CRZ & Wetland)',
    type: 'Evidence',
    date: '21 Apr 2025',
    size: '12.4 MB'
  },
  {
    id: 'REP-004',
    name: 'CRZ Zone Compliance & Cadastral Audit',
    type: 'Coastal',
    date: '15 Apr 2025',
    size: '6.1 MB'
  }
];

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('01 Apr 2025 - 30 Apr 2025');
  const [selectedDistrict, setSelectedDistrict] = useState('Coimbatore');
  const [selectedWaterBody, setSelectedWaterBody] = useState('Vellalore Lake');
  const [selectedReportType, setSelectedReportType] = useState('Comprehensive Violation Dossier');

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F4F6FA] text-slate-800 p-6 space-y-6">
      {/* 1. Top Header: Title + Date Range + Export */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>System Reports & Analytics</span>
          </h2>
          <p className="text-xs text-slate-400">
            District-wise temporal verification, gazette compliance, and system status
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{dateRange}</span>
          </div>

          <button
            onClick={() => alert('Exporting Official WRD PDF / CSV Analytics Report')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards (4 in a row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Changes (100m Buffer)
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900 font-mono">142</h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Violations
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-rose-600 font-mono">36</h3>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              -8%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Inspections
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-amber-600 font-mono">21</h3>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Queued
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Resolved Cases
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-indigo-600 font-mono">27</h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              +15%
            </span>
          </div>
        </div>
      </div>

      {/* 3. District-wise Summary (Horizontal Bar Chart) + Trend Analysis (Line Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District-wise Summary (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">District-wise Summary</h3>
            <p className="text-xs text-slate-400">Detected anomalies vs verified encroachments</p>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={districtData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="district" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="detected" name="Detected" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="verified" name="Verified" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Analysis (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Trend Analysis</h3>
            <p className="text-xs text-slate-400">Monthly progression curve (Nov 2024 – Apr 2025)</p>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                  name="Detected"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  name="Verified"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Reports (Left) + Generate Custom Report (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Reports List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Reports</h3>
            <p className="text-xs text-slate-400">Generated gazette and field evidence dossiers</p>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Report Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Generated</th>
                  <th className="py-2.5 px-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportsList.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{rep.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {rep.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {rep.date}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Downloading ${rep.name} (${rep.size})`)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Custom Report (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Generate Custom Report</h3>
            <p className="text-xs text-slate-400">Export filtered temporal anomaly dossier</p>
          </div>

          <div className="space-y-3 my-auto py-2 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Select District</label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
              >
                <option>Coimbatore</option>
                <option>Chennai</option>
                <option>Chengalpattu</option>
                <option>Cuddalore</option>
                <option>Tirunelveli</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Water Body</label>
              <select
                value={selectedWaterBody}
                onChange={e => setSelectedWaterBody(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
              >
                <option>Vellalore Lake</option>
                <option>Ukkadam Lake</option>
                <option>Pallikaranai Marshland</option>
                <option>Bay of Bengal Coastline</option>
                <option>Puzhal Lake (Red Hills)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Report Type</label>
              <select
                value={selectedReportType}
                onChange={e => setSelectedReportType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
              >
                <option>Comprehensive Violation Dossier</option>
                <option>High-Risk Buffer Infringement Audit</option>
                <option>Cadastral Boundary Comparison</option>
                <option>Field Enforcement Dispatch Notice</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => alert(`Generating Official ${selectedReportType} for ${selectedWaterBody} (${selectedDistrict})`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. System Health, Monitoring Schedule & Processing Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* System Health */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>System Health</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Sentinel-2 Optical:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sentinel-1 SAR Radar:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Storage & PostGIS:</span>
              <span className="font-bold text-blue-600">Optimal (99.9%)</span>
            </div>
          </div>
        </div>

        {/* Monitoring Schedule */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Monitoring Schedule</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Frequency:</span>
              <span className="font-bold text-slate-800">Weekly Sentinel Pass</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next Automatic Run:</span>
              <span className="font-mono font-bold text-slate-800">05 May 2025, 06:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cadastral Sync:</span>
              <span className="font-bold text-emerald-600">Up to Date</span>
            </div>
          </div>
        </div>

        {/* Processing Jobs */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Processing Jobs</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Optical Ingestion:</span>
              <span className="font-semibold text-slate-700">Queued (8)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Denoising & Co-reg:</span>
              <span className="font-semibold text-blue-600 animate-pulse">Running...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Encroachment ML:</span>
              <span className="font-bold text-emerald-600">78% complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
