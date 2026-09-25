import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import { WaterBody, Alert } from '../../types';
import { Layers, Eye, EyeOff, Navigation, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface GISMapProps {
  waterBodies: WaterBody[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  bufferDistance: number;
  isHeatmapMode?: boolean;
}

export const GISMap: React.FC<GISMapProps> = ({
  waterBodies,
  alerts,
  selectedAlert,
  onSelectAlert,
  bufferDistance,
  isHeatmapMode = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups refs
  const waterLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const bufferLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const changeLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const heatmapLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer Visibility State
  const [layersState, setLayersState] = useState({
    baseMap: true,
    waterBodies: true,
    buffers: true,
    changes: true,
    markers: true
  });

  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite'>('osm');
  const [isLayerControlOpen, setIsLayerControlOpen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Chennai / Tamil Nadu Water Network [12.98, 80.18]
    const map = L.map(mapContainerRef.current, {
      center: [12.98, 80.16],
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    // Add OpenStreetMap base tile
    const tileUrl =
      mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tiles;

    // Add layer groups to map
    waterLayerRef.current.addTo(map);
    bufferLayerRef.current.addTo(map);
    changeLayerRef.current.addTo(map);
    markersLayerRef.current.addTo(map);
    heatmapLayerRef.current.addTo(map);

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

  // Render Water Bodies & Buffers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    waterLayerRef.current.clearLayers();
    bufferLayerRef.current.clearLayers();

    if (!layersState.waterBodies && !layersState.buffers) return;

    waterBodies.forEach(wb => {
      try {
        const polyCoords = wb.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]] as [number, number]);

        // 1. Water Body Boundary Polygon
        if (layersState.waterBodies) {
          const waterColor = wb.type === 'Wetland' ? '#059669' : '#0284c7';
          const waterPoly = L.polygon(polyCoords, {
            color: waterColor,
            fillColor: waterColor,
            fillOpacity: 0.55,
            weight: 2
          });

          waterPoly.bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; color: #f8fafc;">
              <strong style="color: #38bdf8; font-size: 13px;">${wb.name}</strong><br/>
              <span style="color: #94a3b8;">Type:</span> ${wb.type}<br/>
              <span style="color: #94a3b8;">District:</span> ${wb.district}<br/>
              <span style="color: #94a3b8;">Area:</span> ${wb.area}<br/>
              <span style="color: #94a3b8;">Source:</span> ${wb.source}
            </div>
          `);

          waterPoly.addTo(waterLayerRef.current);
        }

        // 2. Regulatory Buffer Zone using Turf.js
        if (layersState.buffers) {
          const turfPoly = turf.polygon(wb.geometry.coordinates);
          const buffered = turf.buffer(turfPoly, bufferDistance / 1000, { units: 'kilometers' });

          if (buffered && buffered.geometry) {
            const bufCoords = (buffered.geometry.coordinates[0] as number[][]).map(c => [c[1], c[0]] as [number, number]);
            const bufferPoly = L.polygon(bufCoords, {
              color: '#38bdf8',
              fillColor: '#38bdf8',
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: '5, 5'
            });

            bufferPoly.bindTooltip(`Protected Buffer (${bufferDistance}m)`, {
              sticky: true,
              className: 'bg-slate-900 text-sky-300 text-[10px] px-1 py-0.5 rounded border border-sky-500/30'
            });

            bufferPoly.addTo(bufferLayerRef.current);
          }
        }
      } catch (err) {
        console.error(`Error rendering water body ${wb.name}:`, err);
      }
    });
  }, [waterBodies, bufferDistance, layersState.waterBodies, layersState.buffers]);

  // Render Change Polygons & Alert Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    changeLayerRef.current.clearLayers();
    markersLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    if (isHeatmapMode) {
      // Heatmap Simulation: Draw glowing radial gradient circles around each alert weighted by risk score
      alerts.forEach(alert => {
        const radius = Math.max(300, alert.riskScore * 18);
        const color =
          alert.riskLevel === 'VERY HIGH'
            ? '#ef4444'
            : alert.riskLevel === 'HIGH'
            ? '#f97316'
            : alert.riskLevel === 'MEDIUM'
            ? '#eab308'
            : '#22c55e';

        const heatCircle = L.circle([alert.coordinates[0], alert.coordinates[1]], {
          radius,
          color: 'transparent',
          fillColor: color,
          fillOpacity: 0.45,
          weight: 0
        });

        heatCircle.bindTooltip(`Heat Density: ${alert.riskLevel} (${alert.riskScore})`, {
          sticky: true
        });

        heatCircle.addTo(heatmapLayerRef.current);
      });
      return;
    }

    alerts.forEach(alert => {
      const isSelected = selectedAlert?.id === alert.id;

      // Color determination based on Risk Level
      let strokeColor = '#22c55e';
      let fillColor = '#22c55e';
      if (alert.riskLevel === 'VERY HIGH') {
        strokeColor = '#ef4444';
        fillColor = '#ef4444';
      } else if (alert.riskLevel === 'HIGH') {
        strokeColor = '#f97316';
        fillColor = '#f97316';
      } else if (alert.riskLevel === 'MEDIUM') {
        strokeColor = '#eab308';
        fillColor = '#eab308';
      }

      // 1. Detected Change Geometry Polygon
      if (layersState.changes && alert.geometry?.coordinates) {
        try {
          const polyCoords = alert.geometry.coordinates[0].map(
            (c: number[]) => [c[1], c[0]] as [number, number]
          );

          const changePolygon = L.polygon(polyCoords, {
            color: isSelected ? '#ffffff' : strokeColor,
            fillColor,
            fillOpacity: isSelected ? 0.8 : 0.6,
            weight: isSelected ? 3 : 2
          });

          changePolygon.on('click', () => {
            onSelectAlert(alert);
          });

          changePolygon.addTo(changeLayerRef.current);
        } catch (e) {
          console.warn('Error rendering polygon for alert:', alert.id, e);
        }
      }

      // 2. Custom Radar Pulse Marker
      if (layersState.markers) {
        const pulseHtml = `
          <div style="position: relative; width: 28px; height: 28px; cursor: pointer;">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 9999px;
              background-color: ${fillColor};
              opacity: ${alert.riskLevel === 'VERY HIGH' ? '0.75' : '0.4'};
              ${alert.riskLevel === 'VERY HIGH' ? 'animation: radar-pulse 1.8s infinite ease-in-out;' : ''}
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 14px;
              height: 14px;
              border-radius: 9999px;
              background-color: ${fillColor};
              border: 2px solid #ffffff;
              box-shadow: 0 0 6px rgba(0,0,0,0.8);
            "></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: pulseHtml,
          className: 'custom-radar-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([alert.coordinates[0], alert.coordinates[1]], {
          icon: customIcon
        });

        marker.on('click', () => {
          onSelectAlert(alert);
        });

        marker.bindTooltip(
          `<strong>${alert.id}</strong>: ${alert.changeType}<br/>Risk: ${alert.riskScore}/100 (${alert.riskLevel})`,
          {
            direction: 'top',
            offset: [0, -12],
            className: 'bg-slate-900 text-slate-100 text-[11px] p-1.5 rounded border border-slate-700 shadow-xl'
          }
        );

        marker.addTo(markersLayerRef.current);
      }
    });
  }, [alerts, selectedAlert, layersState.changes, layersState.markers, isHeatmapMode]);

  // Center on Selected Alert
  useEffect(() => {
    if (!selectedAlert || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [selectedAlert.coordinates[0], selectedAlert.coordinates[1]],
      15,
      { duration: 1.2 }
    );
  }, [selectedAlert]);

  // Map Controls Helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([12.98, 80.16], 11, { duration: 1 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Layer Control & Style Switcher */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {/* Toggle layers menu button */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl overflow-hidden text-xs">
          <button
            onClick={() => setIsLayerControlOpen(!isLayerControlOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-slate-200 hover:text-white font-semibold transition-colors"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>GIS Map Layers & Basemap</span>
          </button>

          {isLayerControlOpen && (
            <div className="p-3 border-t border-slate-800 space-y-2.5 bg-slate-950/90">
              {/* Basemap Switch */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Basemap Provider
                </span>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => setMapStyle('osm')}
                    className={`py-1 px-2 rounded text-[11px] font-medium border ${
                      mapStyle === 'osm'
                        ? 'bg-sky-600/30 border-sky-500 text-sky-300'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    OpenStreetMap
                  </button>
                  <button
                    onClick={() => setMapStyle('satellite')}
                    className={`py-1 px-2 rounded text-[11px] font-medium border ${
                      mapStyle === 'satellite'
                        ? 'bg-sky-600/30 border-sky-500 text-sky-300'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Satellite Imagery
                  </button>
                </div>
              </div>

              {/* Layer Toggles */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Operational Layers
                </span>

                {/* Water Body Layer */}
                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />
                    <span>Water Bodies (Lakes/Wetlands)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layersState.waterBodies}
                    onChange={e =>
                      setLayersState(s => ({ ...s, waterBodies: e.target.checked }))
                    }
                    className="accent-sky-500 rounded"
                  />
                </label>

                {/* Regulatory Buffer Layer */}
                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded bg-sky-300 border border-sky-400 border-dashed inline-block" />
                    <span>Regulatory Buffer ({bufferDistance}m)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layersState.buffers}
                    onChange={e =>
                      setLayersState(s => ({ ...s, buffers: e.target.checked }))
                    }
                    className="accent-sky-500 rounded"
                  />
                </label>

                {/* Change Polygons */}
                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
                    <span>Detected Change Footprints</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layersState.changes}
                    onChange={e =>
                      setLayersState(s => ({ ...s, changes: e.target.checked }))
                    }
                    className="accent-sky-500 rounded"
                  />
                </label>

                {/* Risk Markers */}
                <label className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer select-none">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400 ring-2 ring-rose-500/40 inline-block" />
                    <span>Encroachment Radar Markers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layersState.markers}
                    onChange={e =>
                      setLayersState(s => ({ ...s, markers: e.target.checked }))
                    }
                    className="accent-sky-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Action Controls (Zoom & Reset) */}
      <div className="absolute bottom-6 left-4 z-10 flex flex-col space-y-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg"
          title="Reset to Tamil Nadu Region"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Risk Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-6 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 shadow-xl text-xs space-y-1.5 select-none">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Inspection Priority Legend
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Very High (76-100)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">High (51-75)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-slate-300">Medium (26-50)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Low (0-25)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
