import React, { useState } from 'react';
import { WaterBody, Alert } from '../types';
import { Waves, MapPin, Layers, ExternalLink, ShieldCheck, Database, Search } from 'lucide-react';

interface WaterBodiesPageProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  onSelectWaterBody: (wb: WaterBody) => void;
}

export const WaterBodiesPage: React.FC<WaterBodiesPageProps> = ({
  waterBodies,
  alerts,
  onSelectWaterBody
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = waterBodies.filter(wb => {
    const matchSearch =
      wb.name.toLowerCase().includes(search.toLowerCase()) ||
      wb.district.toLowerCase().includes(search.toLowerCase()) ||
      wb.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || wb.type === typeFilter;
    return matchSearch && matchType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Wetland':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Reservoir':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Lake':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Coastal Zone':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Page Header */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <Waves className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Protected Water Bodies & Wetland Inventory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official GIS cadastral catalog of gazetted lakes, reservoirs, Ramsar wetlands, and CRZ zones in Tamil Nadu.
          </p>
        </div>

        {/* Total Stat */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Monitored Reservoirs & Lakes: <strong className="text-white font-mono">{waterBodies.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by lake name, district, or survey ID..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Water Types</option>
            <option value="Reservoir">Reservoir</option>
            <option value="Wetland">Wetland / Ramsar</option>
            <option value="Lake">Lake</option>
            <option value="Coastal Zone">Coastal Zone (CRZ)</option>
          </select>
        </div>
      </div>

      {/* Grid of Water Body Cards */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(wb => {
            const wbAlerts = alerts.filter(a => a.waterBodyId === wb.id);
            const highAlerts = wbAlerts.filter(a => a.riskLevel === 'VERY HIGH' || a.riskLevel === 'HIGH');

            return (
              <div
                key={wb.id}
                className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Bar with Type & Survey ID */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {wb.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeColor(
                        wb.type
                      )}`}
                    >
                      {wb.type}
                    </span>
                  </div>

                  {/* Water Body Name */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {wb.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>{wb.district}, {wb.state}</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Water Spread Area</span>
                      <strong className="text-slate-200 font-mono">{wb.area}</strong>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Regulatory Buffer</span>
                      <strong className="text-sky-400 font-mono">{wb.bufferRadiusMeters} meters</strong>
                    </div>
                  </div>

                  {/* Encroachment Alert Count */}
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-slate-400">Active Change Alerts:</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-white">{wbAlerts.length}</span>
                      {highAlerts.length > 0 && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded">
                          {highAlerts.length} High Risk
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cadastral Source Attribution */}
                  <div className="text-[11px] text-slate-400 pt-1 space-y-0.5">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Database className="w-3 h-3 text-slate-400" />
                      <span className="truncate">Source: {wb.source}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Baseline Survey: {wb.sourceDate}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>GeoJSON Active</span>
                  </span>
                  <button
                    onClick={() => onSelectWaterBody(wb)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-sky-600/20 transition-all"
                  >
                    <span>Zoom on Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
