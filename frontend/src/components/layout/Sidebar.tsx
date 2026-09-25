import React from 'react';
import {
  LayoutDashboard,
  Map,
  ShieldAlert,
  Waves,
  ShieldCheck,
  FileText,
  Settings,
  Droplets
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'map'
  | 'alerts'
  | 'waterbodies'
  | 'protectedzones'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeAlertsCount: number;
  totalWaterBodiesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeAlertsCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Map View', icon: Map },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: ShieldAlert,
      badge: activeAlertsCount || 8
    },
    { id: 'waterbodies', label: 'Water Bodies', icon: Waves },
    { id: 'protectedzones', label: 'Protected Zones', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0B1528] border-r border-slate-800/80 flex flex-col flex-shrink-0 select-none text-slate-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/70 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 flex-shrink-0">
          <Droplets className="w-5 h-5 fill-white/20" />
        </div>
        <div className="overflow-hidden">
          <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            AquaCop <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">GIS</span>
          </h1>
          <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
            Water Body & Coastal Monitoring
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status & Decorative Graphic */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] relative overflow-hidden">
        <div className="flex items-center space-x-2 text-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-xs">System Online</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Last updated: 28 Apr 2025, 10:54 AM
        </p>

        {/* Subtle Water Vector Illustration */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center space-x-2 text-[10px] text-slate-400">
          <Waves className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="truncate">Tamil Nadu WRD & Wetlands Cell</span>
        </div>
      </div>
    </aside>
  );
};
