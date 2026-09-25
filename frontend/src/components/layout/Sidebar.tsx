import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Flame,
  Waves,
  ClipboardList,
  BarChart3,
  Layers,
  Database,
  Info
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'map'
  | 'alerts'
  | 'heatmap'
  | 'waterbodies'
  | 'inspections'
  | 'analytics'
  | 'architecture';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeAlertsCount: number;
  pendingInspectionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeAlertsCount,
  pendingInspectionsCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Layers },
    { id: 'map', label: 'GIS Monitoring Map', icon: MapPin },
    {
      id: 'alerts',
      label: 'Encroachment Alerts',
      icon: ShieldAlert,
      badge: activeAlertsCount
    },
    { id: 'heatmap', label: 'Spatial Heat Map', icon: Flame },
    { id: 'waterbodies', label: 'Water Bodies Catalog', icon: Waves },
    {
      id: 'inspections',
      label: 'Inspection Cases',
      icon: ClipboardList,
      badge: pendingInspectionsCount
    },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'architecture', label: 'System Architecture', icon: Database }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/30">
          <Waves className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="font-extrabold text-base tracking-wide text-white">AquaCop</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              GIS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Encroachment Detection System
          </p>
        </div>
      </div>

      {/* Government Authority Badge */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-md bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-200">Tamil Nadu WRD</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">v1.2-PROTOTYPE</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Monitoring Modules
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-start space-x-2">
          <Info className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed text-[10px]">
            Alerts indicate <strong className="text-slate-200">Potential Construction / Land Filling</strong>. Verification recommended.
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80 flex justify-between">
          <span>Sentinel-2 L2A</span>
          <span className="text-emerald-400">10m Ground Res</span>
        </div>
      </div>
    </aside>
  );
};
