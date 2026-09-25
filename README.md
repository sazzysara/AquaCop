# AquaCop – Smart Encroachment Detection System

A specialized, GIS-based temporal monitoring dashboard and decision support system for state and district authorities to detect potential unauthorized construction and land filling activities near protected water bodies, reservoirs, wetlands, and Coastal Regulation Zones (CRZ).

Developed specifically for the **Water Resources Department (WRD)** and **State Wetland Authorities** (demonstrated across the Chennai / Tamil Nadu water network including Chembarambakkam Lake, Pallikaranai Marshland, Velachery Lake, Porur Lake, Ambattur Lake, and Kovalam Estuary CRZ).

---

## Key Features

1. **GIS Interactive Map (React + Leaflet + Turf.js)**:
   - Toggleable layers: OpenStreetMap basemap, Water bodies, Regulatory buffer zones, and Anomaly polygons.
   - Dual Basemap support: OpenStreetMap vector street tiles and Esri high-resolution Satellite Imagery.
   - Dynamic geodesic buffer generation (50m, 100m, 200m) calculated via `@turf/turf`.
   - Real-time radar markers pulsing based on risk severity.

2. **Transparent 5-Factor Risk Scoring (Inspection Priority)**:
   - Evaluates:
     - **Water Proximity Score** (Max 20)
     - **Buffer Overlap Score** (Max 20)
     - **Recent Change Footprint Score** (Max 20)
     - **Construction Progression Velocity** (Max 20)
     - **Detection Model Confidence** (Max 20)
   - Normalized into a 0–100 score categorized into **LOW (0-25)**, **MEDIUM (26-50)**, **HIGH (51-75)**, and **VERY HIGH (76-100)**.
   - Strictly framed as *"Inspection Priority / Risk Score"* to aid logistical dispatch rather than declaring legal guilt.

3. **Temporal Construction Progression (Innovation Showcase)**:
   - Differentiates temporary seasonal vegetation fluctuations from persistent progressive construction.
   - Tracks 4 consecutive satellite observation passes (e.g. Jan 2026: 0 m² → Mar 2026: 85 m² → May 2026: 210 m² → Jul 2026: 420 m²).

4. **Satellite Before / After Comparison**:
   - Interactive split-screen slider with draggable boundary divider.
   - Instant toggle for side-by-side comparative inspection.

5. **Field Verification & Inspection Case Enforcement**:
   - One-click case dispatch directly from any GIS alert or inspection drawer.
   - Complete workflow state machine: *Pending Assignment → Assigned → Field Inspection Completed → Verified / False Positive → Action Required → Closed*.
   - Official remarks, survey numbers, and field verification finding logs.

6. **Spatial Density Heatmap**:
   - Thermal kernel gradient (Green → Yellow → Orange → Red) identifying high-density encroachment corridors.
   - Filterable by risk level, water body category, and change type.

7. **Comprehensive Analytics & Trends (Recharts)**:
   - Temporal alert trends (monthly anomaly frequency vs high-risk buffer infiltrations).
   - Change type breakdown (New Construction, Land Filling, Road/Surface Alteration, Vegetation Clearing).
   - Water body vulnerability distribution.
   - Average footprint growth velocity curve.

8. **Future Enterprise Integration Blueprint**:
   - Architectural specifications and service interfaces for ISRO/Bhuvan WMS, Copernicus Sentinel-2 optical and Sentinel-1 SAR STAC APIs, PostGIS 3.4 spatial database, and national SMS dispatch gateways.

---

## Technology Stack

- **Frontend**:
  - React 19 + TypeScript + Vite
  - Tailwind CSS (Government GIS Dark/Navy Theme `#0a0f1d`, `#0f172a`, `#1e293b`)
  - Leaflet 1.9 + `@turf/turf` for spatial geometry calculations
  - Recharts for responsive trend analytics
  - Lucide React icons
- **Backend**:
  - Node.js + Express + TypeScript
  - Modular service architecture (`gisService`, `riskScoringService`, `alertService`, `inspectionService`, `analyticsService`)
  - `@turf/turf` for server-side distance and buffer calculations
  - CORS and RESTful JSON endpoints

---

## Quick Start / Running Locally

### Prerequisites
- Node.js 18+ (tested on Node v24.14.0)
- npm 9+ (tested on npm 11.9.0)

### 1. Terminal 1: Backend API Server
```bash
cd backend
npm install
npm run dev
```
> Backend runs at: **http://localhost:5000**  
> Health check: **http://localhost:5000/api/health**

### 2. Terminal 2: Frontend GIS Client
```bash
cd frontend
npm install
npm run dev
```
> Frontend opens at: **http://localhost:5173**

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status and timestamp |
| `GET` | `/api/water-bodies` | All protected water body boundaries (GeoJSON) |
| `GET` | `/api/water-bodies/:id` | Single water body detail |
| `GET` | `/api/alerts` | Filterable list of encroachment alerts |
| `GET` | `/api/alerts/:id` | Single alert details with satellite imagery and timeline |
| `GET` | `/api/changes` | All detected spatial anomalies |
| `GET` | `/api/inspections` | All dispatched inspection cases |
| `POST` | `/api/inspections` | Dispatch a new field verification case |
| `PATCH` | `/api/inspections/:id` | Update case status or inspector remarks |
| `GET` | `/api/analytics` | Summary statistics and trend data |
| `GET` | `/api/heatmap` | Spatial concentration points for thermal visualization |
| `POST` | `/api/settings/buffer` | Recalculate all alert risk scores against custom buffer (50m, 100m, 200m) |
