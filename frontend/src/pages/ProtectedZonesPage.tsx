import React, { useState } from 'react';
import {
  Search,
  Plus,
  ShieldCheck,
  MapPin,
  Edit2,
  History,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { GISMap } from '../components/map/GISMap';
import { fallbackProtectedZones } from '../data/protectedZones';
import { ProtectedZone, WaterBody, Alert } from '../types';

interface ProtectedZonesPageProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  bufferDistance: number;
}

export const ProtectedZonesPage: React.FC<ProtectedZonesPageProps> = ({
  waterBodies,
  alerts,
  bufferDistance
}) => {
  const [zones] = useState<ProtectedZone[]>(fallbackProtectedZones);
  const [selectedZone, setSelectedZone] = useState<ProtectedZone>(fallbackProtectedZones[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.legalReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeZone = selectedZone || filteredZones[0] || fallbackProtectedZones[0];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F4F6FA] text-slate-800 p-6 space-y-6">
      {/* 1. Top Search & Add Zone Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search protected zones, regulatory buffers, or CRZ notifications..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={() => alert('Add New Regulatory Zone / Buffer Gazette Definition')}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all ml-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Zone</span>
        </button>
      </div>

      {/* 2. Top Split: Interactive Map (Left) + Zone Details Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Regulatory Buffer Zones & CRZ Boundaries</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Cadastral GIS Layer</span>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden relative mt-3 border border-slate-200">
            <GISMap
              waterBodies={waterBodies}
              alerts={alerts}
              selectedAlert={null}
              onSelectAlert={() => {}}
              bufferDistance={bufferDistance}
            />

            {/* Zone Map Floating Legend */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-md z-[1000] text-[11px] space-y-1.5 min-w-[170px]">
              <div className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-1">
                Zone Layers
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                <span>Water Body Boundary</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>CRZ Zone (50m - 200m)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>Buffer Zone</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
                <span>Wetland Zone</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-purple-500"></span>
                <span>Other Protected Area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Details Panel (5 cols) */}
        {activeZone && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between h-[400px]">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>Zone Details</span>
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {activeZone.id}
              </span>
            </div>

            <div className="space-y-3 my-auto py-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Zone ID:</span>
                <span className="font-bold text-slate-900 font-mono">{activeZone.id}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Zone Name:</span>
                <span className="font-bold text-slate-900">{activeZone.name}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Zone Type:</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {activeZone.type}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Buffer Distance:</span>
                <span className="font-mono font-bold text-slate-800">{activeZone.bufferDistanceMeters} m</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Legal Reference:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[220px]" title={activeZone.legalReference}>
                  {activeZone.legalReference}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Effective Date:</span>
                <span className="font-mono text-slate-700 font-medium">{activeZone.effectiveDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center space-x-3">
              <button
                onClick={() => alert(`Editing Gazette Buffer parameters for ${activeZone.name}`)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Zone</span>
              </button>

              <button
                onClick={() => alert(`Gazette History for ${activeZone.name}`)}
                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>View History</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Zone List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Zone List</h3>
          <p className="text-xs text-slate-400">All notified regulatory and environmental conservation zones</p>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Zone Name</th>
                <th className="py-3 px-4">Zone Type</th>
                <th className="py-3 px-4">Area (ha)</th>
                <th className="py-3 px-4">Legal Reference</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredZones.map(zone => {
                const isSelected = activeZone?.id === zone.id;

                return (
                  <tr
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {zone.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {zone.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {zone.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {zone.areaHa}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {zone.legalReference}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
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
            Showing 1-{filteredZones.length} of 5 zones
          </div>
        </div>
      </div>
    </div>
  );
};
