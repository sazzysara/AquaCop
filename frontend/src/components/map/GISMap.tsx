import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { WaterBody, Alert } from '../../types';
import { Layers, ZoomIn, ZoomOut, Maximize2, Crosshair } from 'lucide-react';

interface GISMapProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  bufferDistance?: number;
  initialCenter?: [number, number];
  initialZoom?: number;
  showLayersLegend?: boolean;
  isHeatmapMode?: boolean;
}


export const GISMap: React.FC<GISMapProps> = ({
  waterBodies,
  alerts,
  selectedAlert,
  onSelectAlert,
  bufferDistance = 50,
  initialCenter = [11.0281, 77.0086], // Vellalore Lake, Coimbatore
  initialZoom = 14,
  showLayersLegend = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const waterLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const bufferLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const changeLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  const [mapStyle, setMapStyle] = useState<'satellite' | 'osm'>('satellite');

  // Layer Visibility
  const [showWater, setShowWater] = useState(true);
  const [showBuffer, setShowBuffer] = useState(true);
  const [showChanges, setShowChanges] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showRoads, setShowRoads] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    // Default to High Resolution Esri World Satellite Imagery
    const tileUrl =
      mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
    tileLayerRef.current = tiles;

    // Attach Layer Groups
    waterLayerRef.current.addTo(map);
    bufferLayerRef.current.addTo(map);
    changeLayerRef.current.addTo(map);
    markersLayerRef.current.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tiles if mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl =
      mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTiles = L.tileLayer(tileUrl, { maxZoom: 19 });
    newTiles.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [mapStyle]);

  // Render Polygons & Overlays
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    waterLayerRef.current.clearLayers();
    bufferLayerRef.current.clearLayers();
    changeLayerRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    // 1. Water Bodies Polygons
    if (showWater) {
      waterBodies.forEach(wb => {
        // Vellalore Lake precise realistic geometric polygon
        const coords: [number, number][] =
          wb.id === 'WB-001'
            ? [
                [11.0345, 77.0042],
                [11.0360, 77.0125],
                [11.0315, 77.0180],
                [11.0240, 77.0165],
                [11.0205, 77.0105],
                [11.0225, 77.0035],
                [11.0280, 77.0018],
                [11.0345, 77.0042]
              ]
            : (wb.geometry?.coordinates?.[0]?.map(
                (c: [number, number]) => [c[1], c[0]] as [number, number]
              ) || [
                [wb.center[0] + 0.005, wb.center[1] - 0.005],
                [wb.center[0] + 0.005, wb.center[1] + 0.005],
                [wb.center[0] - 0.005, wb.center[1] + 0.005],
                [wb.center[0] - 0.005, wb.center[1] - 0.005],
                [wb.center[0] + 0.005, wb.center[1] - 0.005]
              ]);

        const poly = L.polygon(coords, {
          color: '#38bdf8',
          weight: 2.5,
          fillColor: '#0284c7',
          fillOpacity: 0.55
        }).addTo(waterLayerRef.current);

        // Water Body Text Label in center
        L.marker(wb.center, {
          icon: L.divIcon({
            className: 'water-label',
            html: `<div style="color: #ffffff; text-shadow: 0 1px 4px rgba(0,0,0,0.9); font-weight: 800; font-size: 13px; letter-spacing: 0.5px; white-space: nowrap; pointer-events: none;">${wb.name}</div>`,
            iconSize: [120, 20],
            iconAnchor: [60, 10]
          })
        }).addTo(waterLayerRef.current);

        // 2. Protected Buffer Zone (Green Dashed Boundary)
        if (showBuffer) {
          const bufferCoords: [number, number][] =
            wb.id === 'WB-001'
              ? [
                  [11.0375, 77.0020],
                  [11.0390, 77.0145],
                  [11.0335, 77.0210],
                  [11.0215, 77.0195],
                  [11.0175, 77.0115],
                  [11.0195, 77.0010],
                  [11.0270, 76.9990],
                  [11.0375, 77.0020]
                ]
              : coords.map(c => [c[0] + 0.0025, c[1] + 0.0025]);

          L.polygon(bufferCoords, {
            color: '#22c55e',
            weight: 2.5,
            dashArray: '6, 6',
            fillColor: '#22c55e',
            fillOpacity: 0.15
          }).addTo(bufferLayerRef.current);
        }
      });
    }

    // 3. Detected Encroachments / Change Footprints (Red Polygons)
    if (showChanges) {
      alerts.forEach(alert => {
        const changeCoords: [number, number][] =
          alert.id === 'C-1042'
            ? [
                [11.0210, 77.0135],
                [11.0245, 77.0155],
                [11.0230, 77.0180],
                [11.0195, 77.0160],
                [11.0210, 77.0135]
              ]
            : [
                [alert.coordinates[0] + 0.001, alert.coordinates[1] - 0.001],
                [alert.coordinates[0] + 0.001, alert.coordinates[1] + 0.001],
                [alert.coordinates[0] - 0.001, alert.coordinates[1] + 0.001],
                [alert.coordinates[0] - 0.001, alert.coordinates[1] - 0.001],
                [alert.coordinates[0] + 0.001, alert.coordinates[1] - 0.001]
              ];

        const isSelected = selectedAlert?.id === alert.id;

        const changePoly = L.polygon(changeCoords, {
          color: isSelected ? '#ff0000' : '#ef4444',
          weight: isSelected ? 3.5 : 2.5,
          fillColor: '#ef4444',
          fillOpacity: 0.65
        }).addTo(changeLayerRef.current);

        changePoly.on('click', () => onSelectAlert(alert));

        // Pulsing Marker on Encroachment Hotspot
        L.marker(alert.coordinates, {
          icon: L.divIcon({
            className: 'alert-pin',
            html: `<div class="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-lg animate-ping"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).addTo(markersLayerRef.current);
      });
    }
  }, [waterBodies, alerts, selectedAlert, showWater, showBuffer, showChanges, bufferDistance]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => mapInstanceRef.current?.setView(initialCenter, initialZoom);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900 select-none">
      {/* Leaflet Mount Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Floating Controls (Top Left) */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-1">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-slate-900 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-slate-900 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 hover:text-blue-600 transition-colors border-t border-slate-100"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Map Scale Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 shadow-sm flex items-center space-x-2">
        <div className="w-16 h-1 border-b-2 border-l-2 border-r-2 border-slate-800"></div>
        <span>0 120 240 m</span>
      </div>

      {/* Optional Integrated Layer Legend inside map */}
      {showLayersLegend && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl z-[1000] text-xs space-y-2 min-w-[190px]">
          <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span>Map Layers</span>
            <Layers className="w-3.5 h-3.5 text-blue-600" />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showWater}
              onChange={e => setShowWater(e.target.checked)}
              className="rounded text-blue-600 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block border border-white"></span>
              Water Body Boundary
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showBuffer}
              onChange={e => setShowBuffer(e.target.checked)}
              className="rounded text-emerald-600 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded border border-dashed border-emerald-500 inline-block bg-emerald-500/20"></span>
              Protected Zone (Buffer)
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showChanges}
              onChange={e => setShowChanges(e.target.checked)}
              className="rounded text-rose-600 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block border border-white"></span>
              Detected Changes
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showBuildings}
              onChange={e => setShowBuildings(e.target.checked)}
              className="rounded text-amber-600 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
              Buildings
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={showRoads}
              onChange={e => setShowRoads(e.target.checked)}
              className="rounded text-slate-600 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block"></span>
              Roads
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
