import React from 'react';
import { Search, Bell, MapPin, ChevronDown } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeAlertsCount: number;
  selectedDistrict?: string;
  onDistrictChange?: (district: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  activeAlertsCount = 8,
  selectedDistrict = 'Coimbatore, Tamil Nadu'
}) => {
  return (
    <header className="h-16 bg-[#0B1528] border-b border-slate-800/80 px-6 flex items-center justify-between flex-shrink-0 text-slate-200">
      {/* Title Header */}
      <div className="flex items-center space-x-3">
        <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <span>Tamil Nadu Water Body & Coastal Encroachment Monitoring</span>
        </h2>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search water bodies, districts, or locations..."
            className="w-full bg-slate-900/90 border border-slate-700/70 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls & Officer Profile */}
      <div className="flex items-center space-x-4">
        {/* District Selector Pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 hover:border-slate-600 cursor-pointer">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium text-slate-200">{selectedDistrict}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>

        {/* Notifications Icon */}
        <button
          title="System alerts"
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center shadow-sm animate-pulse">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Officer Profile Badge */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white font-bold text-xs shadow-md">
            AS
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-white leading-none">
              Arun Sharma
            </div>
            <span className="text-[10px] text-slate-400 font-medium leading-none block mt-1">
              District Officer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
