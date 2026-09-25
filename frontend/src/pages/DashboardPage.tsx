import React from 'react';
import { GISMap } from '../components/map/GISMap';
import { AlertDetailsDrawer } from '../components/detection/AlertDetailsDrawer';
import { WaterBody, Alert, AnalyticsSummary } from '../types';
import { ShieldAlert, Waves, AlertTriangle, CheckCircle, Flame, Eye } from 'lucide-react';

interface DashboardPageProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  onCloseDrawer: () => void;
  onCreateCase: (alert: Alert) => void;
  bufferDistance: number;
  analytics: AnalyticsSummary | null;
  onNavigateTab: (tab: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  waterBodies,
  alerts,
  selectedAlert,
  onSelectAlert,
  onCloseDrawer,
  onCreateCase,
  bufferDistance,
  analytics,
  onNavigateTab
}) => {
  const veryHighRiskCount = alerts.filter(a => a.riskLevel === 'VERY HIGH').length;
  const highRiskCount = alerts.filter(a => a.riskLevel === 'HIGH').length;
  const pendingCasesCount = analytics?.pendingInspections || 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Top Quick Status Stat Chips Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3 overflow-x-auto text-xs py-0.5">
          {/* Active Alerts */}
          <button
            onClick={() => onNavigateTab('alerts')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-slate-300 hover:text-white"
          >
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span>Monitored Alerts:</span>
            <span className="font-mono font-bold text-white">{alerts.length}</span>
          </button>

          {/* Very High Risk */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Very High Priority:</span>
            <span className="font-mono font-bold text-rose-200">{veryHighRiskCount}</span>
          </div>

          {/* High Risk */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>High Priority:</span>
            <span className="font-mono font-bold text-amber-200">{highRiskCount}</span>
          </div>

          {/* Protected Water Bodies */}
          <button
            onClick={() => onNavigateTab('waterbodies')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-slate-300 hover:text-white"
          >
            <Waves className="w-4 h-4 text-sky-400" />
            <span>Protected Water Bodies:</span>
            <span className="font-mono font-bold text-white">{waterBodies.length}</span>
          </button>

          {/* Field Verifications Pending */}
          <button
            onClick={() => onNavigateTab('inspections')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-slate-300 hover:text-white"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Inspections Dispatched:</span>
            <span className="font-mono font-bold text-white">{pendingCasesCount}</span>
          </button>
        </div>

        {/* Live Status Tag */}
        <div className="hidden xl:flex items-center space-x-2 text-[11px] text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Sentinel-2 L2A Feed Active (Chennai Coastal Basin)</span>
        </div>
      </div>

      {/* Main Interactive Map & Slide-out Inspector Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 h-full relative">
          <GISMap
            waterBodies={waterBodies}
            alerts={alerts}
            selectedAlert={selectedAlert}
            onSelectAlert={onSelectAlert}
            bufferDistance={bufferDistance}
          />
        </div>

        {/* Right Details Panel */}
        {selectedAlert && (
          <AlertDetailsDrawer
            alert={selectedAlert}
            onClose={onCloseDrawer}
            onCreateCase={onCreateCase}
          />
        )}
      </div>
    </div>
  );
};
