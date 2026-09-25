import React, { useState } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  MapPin,
  Calendar,
  Eye,
  Sliders,
  Maximize2,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { GISMap } from '../components/map/GISMap';
import { WaterBody, Alert } from '../types';

interface MapViewPageProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  onNavigateTab: (tab: any) => void;
  bufferDistance: number;
}

export const MapViewPage: React.FC<MapViewPageProps> = ({
  waterBodies,
  alerts,
  selectedAlert,
  onSelectAlert,
  onNavigateTab,
  bufferDistance
}) => {
  const [timeStep, setTimeStep] = useState<number>(4);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'osm' | 'hybrid'>('satellite');

  // Layer Visibility State
  const [layers, setLayers] = useState({
    satellite: true,
    waterBody: true,
    protectedBuffer: true,
    detectedChanges: true,
    buildings: true,
    roads: false
  });

  const activeAlert = selectedAlert || alerts[0] || null;

  const timeLabels = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'];

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-slate-950">
      {/* Full Screen GIS Map Component */}
      <GISMap
        waterBodies={waterBodies}
        alerts={alerts}
        selectedAlert={activeAlert}
        onSelectAlert={onSelectAlert}
        bufferDistance={bufferDistance}
      />

      {/* Floating Left Inspection Card (#C-1042) */}
      {activeAlert && (
        <div className="absolute top-6 left-6 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl p-5 z-[1000] text-slate-800 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Inspection Target
              </span>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                Detected Change #{activeAlert.id}
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                activeAlert.riskLevel === 'HIGH' || activeAlert.riskLevel === 'VERY HIGH'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {activeAlert.riskLevel}
            </span>
          </div>

          <div className="py-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Change Type:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {activeAlert.changeType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Area:</span>
              <span className="font-semibold text-slate-900 font-mono">
                {((activeAlert.changedAreaSqM || 4200) / 10000).toFixed(2)} ha ({activeAlert.changedAreaSqM} m²)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">AI Model Confidence:</span>
              <span className="font-bold text-emerald-600 font-mono">
                {activeAlert.confidence} (87%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Date Detected:</span>
              <span className="font-medium text-slate-700 font-mono">
                {activeAlert.detectionDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Coordinates:</span>
              <span className="font-mono text-[11px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                11.0281° N, 77.0086° E
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('alerts')}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => alert(`Zoomed in on ${activeAlert.locationName}`)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Zoom
            </button>
          </div>
        </div>
      )}

      {/* Floating Right Control Panel: Map Layers + Time Slider + Basemap */}
      <div className="absolute top-6 right-6 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl p-5 z-[1000] text-slate-800 space-y-4">
        {/* Layer Toggles */}
        <div>
          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Map Layers</span>
          </h4>

          <div className="space-y-2 text-xs">
            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.satellite}
                onChange={e => setLayers({ ...layers, satellite: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="font-medium text-slate-700">Satellite Imagery</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.waterBody}
                onChange={e => setLayers({ ...layers, waterBody: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block border border-white shadow-sm"></span>
                Water Body Boundary
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.protectedBuffer}
                onChange={e => setLayers({ ...layers, protectedBuffer: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded border border-dashed border-emerald-500 inline-block bg-emerald-500/20"></span>
                Protected Zone (CRZ / Buffer)
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.detectedChanges}
                onChange={e => setLayers({ ...layers, detectedChanges: e.target.checked })}
                className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block border border-white shadow-sm animate-pulse"></span>
                Detected Changes / Encroachment
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.buildings}
                onChange={e => setLayers({ ...layers, buildings: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block border border-white shadow-sm"></span>
                Buildings
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.roads}
                onChange={e => setLayers({ ...layers, roads: e.target.checked })}
                className="rounded text-slate-600 focus:ring-slate-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded bg-slate-400 inline-block"></span>
                Roads
              </span>
            </label>
          </div>
        </div>

        {/* Time Slider */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Time Slider</span>
            </h4>
            <span className="text-[11px] font-bold text-blue-600 font-mono">
              {timeLabels[timeStep - 1]}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={timeStep}
            onChange={e => setTimeStep(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
            <span>Jan 2025</span>
            <span>Apr 2025</span>
          </div>
        </div>

        {/* Basemap Switcher */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Basemap:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle('osm')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapStyle === 'osm'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapStyle('hybrid')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapStyle === 'hybrid'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Center Legend & Scale */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl px-5 py-2.5 z-[1000] flex items-center space-x-6 text-xs text-slate-700">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span>
          <span className="font-semibold">Detected Water Body</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm"></span>
          <span className="font-semibold">River / Stream</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-0.5 border-b-2 border-dashed border-slate-400"></span>
          <span className="font-semibold">Village / Taluk Boundary</span>
        </div>
        <div className="border-l border-slate-200 pl-4 font-mono text-[11px] text-slate-500">
          Scale: 1 : 25,000 (0 - 0.5 km)
        </div>
      </div>
    </div>
  );
};
