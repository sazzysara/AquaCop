import React from 'react';
import {
  Database,
  Satellite,
  Cpu,
  Shield,
  Layers,
  Server,
  Key,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const integrationPoints = [
    {
      title: 'ISRO Bhuvan GIS WMS/WFS Layers',
      category: 'Cadastral & State GIS Data',
      icon: Layers,
      status: 'Ready for Key / WMS Endpoint',
      currentMock: 'Simulated Tamil Nadu WRD Water Body Boundaries (Chembarambakkam, Pallikaranai, etc.)',
      productionPlan: 'Hook into Bhuvan Web Map Services (WMS/WMTS) at `https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms` to pull 1:10,000 revenue village cadastral boundaries.',
      serviceInterface: 'gisService.ts -> getBufferPolygon(), getCadastralBoundaries()'
    },
    {
      title: 'Copernicus Sentinel-2 & Sentinel-1 SAR',
      category: 'Earth Observation Feeds',
      icon: Satellite,
      status: 'Ready for Copernicus Data Space Ecosystem API',
      currentMock: 'Synthesized 10m L2A Sentinel Spectral Signatures (NDVI & NDBI vectors)',
      productionPlan: 'Connect to CDSE STAC API (`https://sh.dataspace.copernicus.eu/api/v1/process`) with scheduled 5-day revisit triggers for cloud-free tile downloads.',
      serviceInterface: 'satelliteService.ts -> fetchLatestObservations(), getBands(B04, B08, B11)'
    },
    {
      title: 'AI Change Detection Engine',
      category: 'Computer Vision & Deep Learning',
      icon: Cpu,
      status: 'Ready for ONNX / PyTorch Inference API',
      currentMock: 'Multi-stage footprint growth progression simulation (Jan - Jul 2026)',
      productionPlan: 'Deploy a Siamese ResNet/U-Net segmentation pipeline that takes Before + After optical/SAR patches and outputs pixel masks of novel structures.',
      serviceInterface: 'changeDetectionService.ts -> inferEncroachmentMask(beforeTif, afterTif)'
    },
    {
      title: 'PostgreSQL 16 + PostGIS 3.4',
      category: 'Spatial Database Layer',
      icon: Server,
      status: 'Schema Defined / Migration Ready',
      currentMock: 'In-memory TypeScript GeoJSON repository with Turf.js spatial operations',
      productionPlan: 'Transition in-memory collections to PostGIS tables with spatial indexes: `ST_DWithin()`, `ST_Buffer()`, and `ST_Intersection()`.',
      serviceInterface: 'gisRepository.ts -> query("SELECT id, ST_AsGeoJSON(geom) FROM water_bodies")'
    },
    {
      title: 'Single Sign-On (SSO) & RBAC',
      category: 'Government Authority Security',
      icon: Key,
      status: 'Mock Authority Profile Active',
      currentMock: 'Chief Engineer (WRD & Wetland Cell) authenticated profile state',
      productionPlan: 'Integrate e-Pramaan / Jan Parichay government SSO or OpenID Connect for state department personnel.',
      serviceInterface: 'authMiddleware.ts -> verifyGovToken(), enforceRole("TALUK_SURVEYOR")'
    },
    {
      title: 'Emergency SMS / WhatsApp Notification Gateway',
      category: 'Alert Dispatch Services',
      icon: Bell,
      status: 'Workflow Staging Active',
      currentMock: 'Direct inspection case dispatch with assigned officer state updates',
      productionPlan: 'Connect to C-DAC National Mobile Governance Gateway (MSDG) for automated SMS summons to tahsildars upon Very High Priority alerts.',
      serviceInterface: 'alertNotificationService.ts -> sendPriorityDispatchSMS(inspectorPhone, alert)'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              System Architecture & Future Integration Blueprint
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise roadmap detailing transitions from prototype service abstractions to national spatial infrastructure.
          </p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Prototype Environment: Modular Interfaces Active</span>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-5xl">
        {/* Prototype Transparency Notice Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <h3 className="font-bold text-slate-200 text-sm flex items-center space-x-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Strict Architectural Decoupling</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            AquaCop has been designed following Clean Architecture principles. Frontend React components interact strictly with backend TypeScript service abstractions (<code className="text-sky-300 font-mono">gisService</code>, <code className="text-sky-300 font-mono">riskScoringService</code>, <code className="text-sky-300 font-mono">alertService</code>, <code className="text-sky-300 font-mono">inspectionService</code>). When official ISRO or Copernicus API credentials are provided, no frontend UI component requires alteration.
          </p>
        </div>

        {/* Integration Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {integrationPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>

                  <div className="text-xs space-y-1.5 pt-1">
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Prototype Mock Implementation:
                      </span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{item.currentMock}</p>
                    </div>

                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-sky-400 uppercase font-semibold block">
                        Production Transition Pathway:
                      </span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{item.productionPlan}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Interface Binding:</span>
                  <span className="text-slate-300 truncate max-w-[220px]">{item.serviceInterface}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
