import React from 'react';
import { AnalyticsSummary } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Waves,
  Building2,
  Shovel,
  ClipboardList
} from 'lucide-react';

interface AnalyticsPageProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
        Loading spatial analytics and telemetry...
      </div>
    );
  }

  const COLORS = ['#0284c7', '#ea580c', '#eab308', '#10b981', '#8b5cf6'];

  const stats = [
    {
      label: 'Monitored Water Bodies',
      value: analytics.totalMonitoredWaterBodies,
      icon: Waves,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20'
    },
    {
      label: 'Active Change Alerts',
      value: analytics.activeAlerts,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      label: 'Very High Risk Alerts',
      value: analytics.veryHighRiskLocations,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      label: 'High Risk Alerts',
      value: analytics.highRiskLocations,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Construction Footprints',
      value: analytics.detectedConstructionChanges,
      icon: Building2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Land Filling Anomaly',
      value: analytics.detectedLandFilling,
      icon: Shovel,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Pending Field Inspections',
      value: analytics.pendingInspections,
      icon: ClipboardList,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Confirmed / Verified Cases',
      value: analytics.verifiedCases,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Page Header */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Satellite Observation Analytics & Encroachment Trends
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative temporal metrics across monitored wetland basins and reservoirs in the district.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Last Synced: Today (Autonomous Sentinel-2 Pipeline)
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${s.bg} flex items-center justify-between shadow-md`}
              >
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {s.label}
                  </span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    {s.value}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg bg-slate-900/60 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1: Alerts Over Time & Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Over Time */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Temporal Alert Frequency Trend
                </h3>
                <p className="text-[11px] text-slate-400">
                  Monthly detected anomalies vs high-risk buffer infiltrations
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.alertsOverTime}>
                  <defs>
                    <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="alerts"
                    name="Total Anomaly Alerts"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#alertGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="highRisk"
                    name="High/Very High Priority"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#riskGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Change Type Distribution (Donut Chart) */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Categorized Encroachment Modalities
              </h3>
              <p className="text-[11px] text-slate-400">
                Proportion of built structures, earth infill, and clearing
              </p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.changeTypeDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {analytics.changeTypeDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Water Body Alert Counts & Multi-Stage Progression Velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Water Body Wise Alert Count */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Encroachment Vulnerability by Water Body
              </h3>
              <p className="text-[11px] text-slate-400">
                Number of detected violations logged across protected reservoirs
              </p>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.waterBodyAlerts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={10}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar
                    dataKey="alerts"
                    name="Total Alerts"
                    fill="#38bdf8"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="highRisk"
                    name="High/Very High Priority"
                    fill="#f43f5e"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Construction Progression Trend (Jan -> Jul 2026) */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Average Footprint Expansion Over Time
              </h3>
              <p className="text-[11px] text-slate-400">
                Multi-pass temporal progression velocity (m²) across flagged sites
              </p>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.constructionProgressionSummary}>
                  <defs>
                    <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" m²" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgArea"
                    name="Mean Built Footprint (m²)"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#progGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
