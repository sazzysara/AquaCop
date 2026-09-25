import React from 'react';
import { Search, Sliders, Bell, Calendar, UserCheck, Shield } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bufferDistance: number;
  onBufferChange: (distance: number) => void;
  onOpenNotifications?: () => void;
  activeAlertsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  bufferDistance,
  onBufferChange,
  activeAlertsCount
}) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
      {/* Search & Location query */}
      <div className="flex items-center space-x-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search water body, alert ID, taluk, or coordinates..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Controls & User Profile */}
      <div className="flex items-center space-x-5">
        {/* Dynamic Buffer Selector */}
        <div className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-medium text-slate-300">Buffer Ring:</span>
          <div className="flex space-x-1">
            {[50, 100, 200].map(dist => (
              <button
                key={dist}
                onClick={() => onBufferChange(dist)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  bufferDistance === dist
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {dist}m
              </button>
            ))}
          </div>
        </div>

        {/* Observation Observation Window */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Temporal Window:</span>
          <span className="font-semibold text-slate-200">Jan 2026 – Aug 2026</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            title="System alerts"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Authority User Profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-200 leading-none">
                Er. K. Natarajan
              </span>
              <UserCheck className="w-3 h-3 text-sky-400" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Chief Engineer, WRD & Wetland Cell
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
