import React, { useState, useMemo } from 'react';
import { GISMap } from '../components/map/GISMap';
import { WaterBody, Alert } from '../types';
import { Flame, Sparkles } from 'lucide-react';

interface HeatMapPageProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  bufferDistance: number;
}

export const HeatMapPage: React.FC<HeatMapPageProps> = ({
  waterBodies,
  alerts,
  onSelectAlert,
  bufferDistance
}) => {
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedWaterType, setSelectedWaterType] = useState<string>('ALL');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchRisk = selectedRisk === 'ALL' || a.riskLevel === selectedRisk;
      const matchType = selectedType === 'ALL' || a.changeType === selectedType;
      const wb = waterBodies.find(w => w.id === a.waterBodyId);
      const matchWaterType = selectedWaterType === 'ALL' || (wb && wb.type === selectedWaterType);
      return matchRisk && matchType && matchWaterType;
    });
  }, [alerts, waterBodies, selectedRisk, selectedType, selectedWaterType]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6FA] overflow-hidden">
      {/* Header Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <span>Spatial Encroachment Heatmap</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Heat Density
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated thermal kernel density depicting clusters of unauthorized activities around water resources
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 text-xs flex-wrap gap-y-2">
          {/* Risk Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <span className="text-slate-400 font-medium">Risk:</span>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none text-xs"
            >
              <option value="ALL">All Levels</option>
              <option value="VERY HIGH">Very High Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Water Body Type Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <span className="text-slate-400 font-medium">Water Type:</span>
            <select
              value={selectedWaterType}
              onChange={e => setSelectedWaterType(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none text-xs"
            >
              <option value="ALL">All Water Types</option>
              <option value="Reservoir">Reservoirs</option>
              <option value="Wetland">Wetlands / Ramsar</option>
              <option value="Lake">Urban Lakes</option>
              <option value="Coastal Zone">Coastal Zones (CRZ)</option>
            </select>
          </div>

          {/* Change Type Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <span className="text-slate-400 font-medium">Change Type:</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none text-xs"
            >
              <option value="ALL">All Types</option>
              <option value="New Construction">New Construction</option>
              <option value="Land Filling">Land Filling</option>
              <option value="Road/Surface Change">Road / Tar Paving</option>
              <option value="Vegetation Change">Vegetation Clearing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Heat Map Visualization Canvas */}
      <div className="flex-1 relative">
        <GISMap
          waterBodies={waterBodies}
          alerts={filteredAlerts}
          selectedAlert={null}
          onSelectAlert={onSelectAlert}
          bufferDistance={bufferDistance}
          isHeatmapMode={true}
        />

        {/* Heat Intensity Legend Overlay */}
        <div className="absolute top-4 right-4 z-10 p-4 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-xl text-xs space-y-2.5 max-w-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Concentration Gradient</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              {filteredAlerts.length} Points Filtered
            </span>
          </div>

          {/* Gradient Spectrum Bar */}
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600 shadow-inner" />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>LOW (Green)</span>
            <span>MODERATE</span>
            <span className="text-rose-600 font-bold">CRITICAL (Red)</span>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span>Primary Encroachment Hotspot:</span>
              <strong className="text-rose-600">Pallikaranai & Velachery</strong>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Higher thermal intensity indicates persistent multi-stage construction within the 50m protected shoreline buffer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
