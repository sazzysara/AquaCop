import React, { useState } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Edit2,
  Waves,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  History,
  AlertCircle
} from 'lucide-react';
import { WaterBody, Alert } from '../types';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWb, setSelectedWb] = useState<WaterBody>(waterBodies[0] || null);

  const filteredWaterBodies = waterBodies.filter(wb =>
    wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wb.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wb.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWb = selectedWb || filteredWaterBodies[0] || waterBodies[0];

  const linkedAlerts = alerts.filter(a => a.waterBodyId === activeWb?.id || a.waterBodyName.includes(activeWb?.name || ''));

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F4F6FA] text-slate-800 p-6 space-y-6">
      {/* 1. Top Search & Add Water Body Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search water bodies by name, district, or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={() => alert('New Water Body Registration Modal (Government Survey & Gazette Entry)')}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all ml-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Water Body</span>
        </button>
      </div>

      {/* 2. Water Bodies Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Area (ha)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Verified</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWaterBodies.map(wb => {
                const isSelected = activeWb?.id === wb.id;

                return (
                  <tr
                    key={wb.id}
                    onClick={() => setSelectedWb(wb)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {wb.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {wb.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {wb.district}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {wb.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {wb.area}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {wb.sourceDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedWb(wb);
                            onSelectWaterBody(wb);
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                          title="View on Map"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            alert(`Editing Water Body Record: ${wb.name}`);
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                          title="Edit Water Body"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            Showing 1-{filteredWaterBodies.length} of 48 water bodies
          </div>
        </div>
      </div>

      {/* 3. Bottom Selected Water Body Details Panel */}
      {activeWb && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-600" />
              <span>Water Body Details ({activeWb.name})</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">ID: {activeWb.id}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Thumbnail */}
            <div className="lg:col-span-3 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative group">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"
                alt={activeWb.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                Satellite Imagery
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">Area</span>
                <p className="font-extrabold text-slate-900 text-sm font-mono">{activeWb.area}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">Type</span>
                <p className="font-bold text-slate-900 text-sm">{activeWb.type}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">District</span>
                <p className="font-bold text-slate-900 text-sm">{activeWb.district}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">Last Verified</span>
                <p className="font-semibold text-slate-700 text-xs font-mono">{activeWb.sourceDate}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-2">
                <span className="text-[11px] text-slate-400 font-medium">Monitoring Status</span>
                <p className="font-bold text-emerald-600 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active Sentinel-2 Continuous Optical Sweep
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="lg:col-span-3 space-y-2 flex flex-col justify-center">
              <button
                onClick={() => onSelectWaterBody(activeWb)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>

              <button
                onClick={() => alert(`Historical Cadastral Gazette Records for ${activeWb.name}`)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>View History</span>
              </button>

              <button
                onClick={() => alert(`Opening ${linkedAlerts.length || 23} linked alerts for ${activeWb.name}`)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Linked Alerts ({activeWb.activeAlertsCount || 23})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
