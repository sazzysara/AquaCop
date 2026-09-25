import {
  WaterBody,
  DetectedChange,
  Alert,
  InspectionCase,
  RiskBreakdown,
  AnalyticsSummary,
  HeatmapPoint
} from '../types/index.js';

// SVG generator for realistic satellite simulation imagery
export function generateSatelliteSvg(
  variant: 'before' | 'after',
  changeType: string,
  waterType: string = 'lake'
): string {
  const isAfter = variant === 'after';
  const waterColor = waterType === 'wetland' ? '#1b4d3e' : '#0c4a6e';
  const groundColor = '#3f3b32';
  const vegetationColor = '#2d4a22';

  // Return compact SVG data URI
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${waterColor}" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8" />
    </linearGradient>
    <pattern id="soilPat" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1.5" fill="#57534e" opacity="0.3"/>
      <circle cx="15" cy="15" r="1.2" fill="#78716c" opacity="0.3"/>
    </pattern>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background terrain / soil -->
  <rect width="600" height="400" fill="${groundColor}"/>
  <rect width="600" height="400" fill="url(#soilPat)"/>

  <!-- Natural vegetation patches -->
  <path d="M0,0 Q120,40 180,120 T300,160 L0,200 Z" fill="${vegetationColor}" opacity="0.85"/>
  <path d="M450,0 Q500,80 600,120 L600,0 Z" fill="${vegetationColor}" opacity="0.9"/>
  <path d="M0,280 Q140,240 220,340 T150,400 L0,400 Z" fill="${vegetationColor}" opacity="0.75"/>

  <!-- Water body expanse -->
  <path d="M220,400 Q260,280 340,240 T520,180 Q560,160 600,170 L600,400 Z" fill="url(#waterGrad)"/>
  <!-- Shoreline wetland line -->
  <path d="M220,400 Q260,280 340,240 T520,180 Q560,160 600,170" fill="none" stroke="#ca8a04" stroke-width="4" stroke-dasharray="6,4" opacity="0.7"/>

  <!-- Dirt access tracks / trails -->
  <path d="M50,0 Q120,150 210,180 T320,190" fill="none" stroke="#a8a29e" stroke-width="5" stroke-linecap="round" opacity="0.6"/>

  ${
    !isAfter
      ? `
    <!-- BEFORE STATE: Pristine natural shoreline -->
    <circle cx="280" cy="180" r="45" fill="#44403c" opacity="0.4"/>
    <text x="30" y="40" font-family="monospace" font-size="14" font-weight="bold" fill="#38bdf8" letter-spacing="2">
      SENTINEL-2 L2A (10M) • OBSERVATION BASELINE
    </text>
    <text x="30" y="60" font-family="sans-serif" font-size="12" fill="#94a3b8">
      STATUS: Undisturbed Natural Vegetation / Water Buffer Zone
    </text>
  `
      : `
    <!-- AFTER STATE: Detected Change / Construction / Infilling -->
    <g filter="url(#shadow)">
      ${
        changeType === 'Land Filling'
          ? `
        <!-- Land filling polygon -->
        <polygon points="250,160 360,150 380,220 280,240 230,200" fill="#d97706" opacity="0.85" stroke="#ef4444" stroke-width="2.5"/>
        <!-- Dumping tracks -->
        <path d="M210,180 L290,195 M220,165 L310,175" stroke="#fef08a" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="260" y="205" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SEDIMENT FILL</text>
      `
          : `
        <!-- Built structures footprint -->
        <rect x="250" y="140" width="70" height="55" fill="#dc2626" opacity="0.9" stroke="#fee2e2" stroke-width="2"/>
        <rect x="325" y="150" width="45" height="40" fill="#ea580c" opacity="0.9" stroke="#fee2e2" stroke-width="2"/>
        <polygon points="240,198 375,198 370,225 245,225" fill="#b91c1c" opacity="0.8" stroke="#fee2e2" stroke-width="1.5"/>
        <!-- Foundation perimeter fence -->
        <rect x="235" y="130" width="145" height="100" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="255" y="172" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">PLINTH + ROOF</text>
      `
      }
    </g>

    <!-- Overlay bounding HUD indicator -->
    <rect x="220" y="115" width="180" height="135" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="8,6"/>
    <circle cx="220" cy="115" r="4" fill="#ef4444"/>
    <circle cx="400" cy="115" r="4" fill="#ef4444"/>
    <circle cx="400" cy="250" r="4" fill="#ef4444"/>
    <circle cx="220" cy="250" r="4" fill="#ef4444"/>

    <text x="30" y="40" font-family="monospace" font-size="14" font-weight="bold" fill="#f87171" letter-spacing="2">
      DETECTION OVERLAY • SIGNIFICANT ANOMALY
    </text>
    <text x="30" y="60" font-family="sans-serif" font-size="12" fill="#fca5a5">
      SPECTRAL REFLECTANCE SHIFT: +74.2% (NDVI Drop / NDBI Spike)
    </text>
  `
  }

  <!-- Timestamp badge -->
  <rect x="420" y="360" width="165" height="26" rx="4" fill="#0f172a" opacity="0.85"/>
  <text x="502" y="377" text-anchor="middle" font-family="monospace" font-size="11" fill="#cbd5e1">
    ${isAfter ? 'OBS: 18-JUL-2026' : 'OBS: 12-JAN-2026'}
  </text>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const mockWaterBodies: WaterBody[] = [
  {
    id: 'WB-TN-001',
    name: 'Chembarambakkam Lake',
    type: 'Reservoir',
    district: 'Kanchipuram / Chennai',
    state: 'Tamil Nadu',
    area: '15.4 sq km',
    areaSqKm: 15.4,
    source: 'Institute of Remote Sensing (Anna Univ) / PWD Tamil Nadu',
    sourceDate: '2025-11-15',
    bufferRadiusMeters: 100,
    activeAlertsCount: 3,
    center: [13.0082, 80.0573],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.042, 13.025],
          [80.065, 13.028],
          [80.075, 13.015],
          [80.072, 12.998],
          [80.058, 12.988],
          [80.045, 13.002],
          [80.042, 13.025]
        ]
      ]
    }
  },
  {
    id: 'WB-TN-002',
    name: 'Pallikaranai Marshland',
    type: 'Wetland',
    district: 'Chennai',
    state: 'Tamil Nadu',
    area: '5.9 sq km',
    areaSqKm: 5.9,
    source: 'Tamil Nadu Forest Dept / Ramsar Conservation Authority',
    sourceDate: '2025-12-01',
    bufferRadiusMeters: 200,
    activeAlertsCount: 4,
    center: [12.9362, 80.2185],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.205, 12.955],
          [80.224, 12.952],
          [80.231, 12.935],
          [80.228, 12.915],
          [80.215, 12.912],
          [80.207, 12.932],
          [80.205, 12.955]
        ]
      ]
    }
  },
  {
    id: 'WB-TN-003',
    name: 'Velachery Lake',
    type: 'Lake',
    district: 'Chennai',
    state: 'Tamil Nadu',
    area: '0.55 sq km',
    areaSqKm: 0.55,
    source: 'Greater Chennai Corporation & WRD',
    sourceDate: '2025-10-20',
    bufferRadiusMeters: 50,
    activeAlertsCount: 2,
    center: [12.9815, 80.2218],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.217, 12.986],
          [80.226, 12.985],
          [80.227, 12.977],
          [80.219, 12.976],
          [80.217, 12.986]
        ]
      ]
    }
  },
  {
    id: 'WB-TN-004',
    name: 'Porur Lake',
    type: 'Reservoir',
    district: 'Tiruvallur / Chennai',
    state: 'Tamil Nadu',
    area: '1.25 sq km',
    areaSqKm: 1.25,
    source: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    sourceDate: '2025-09-18',
    bufferRadiusMeters: 100,
    activeAlertsCount: 2,
    center: [13.0365, 80.1438],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.136, 13.045],
          [80.151, 13.042],
          [80.153, 13.031],
          [80.142, 13.028],
          [80.136, 13.045]
        ]
      ]
    }
  },
  {
    id: 'WB-TN-005',
    name: 'Ambattur Lake',
    type: 'Lake',
    district: 'Tiruvallur',
    state: 'Tamil Nadu',
    area: '1.82 sq km',
    areaSqKm: 1.82,
    source: 'PWD Water Resources Organization',
    sourceDate: '2025-10-05',
    bufferRadiusMeters: 100,
    activeAlertsCount: 1,
    center: [13.1152, 80.1648],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.157, 13.124],
          [80.173, 13.122],
          [80.174, 13.108],
          [80.161, 13.106],
          [80.157, 13.124]
        ]
      ]
    }
  },
  {
    id: 'WB-TN-006',
    name: 'Kovalam Estuary & CRZ',
    type: 'Coastal Zone',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    area: '4.10 sq km',
    areaSqKm: 4.1,
    source: 'Tamil Nadu State Coastal Zone Management Authority (TNSCZMA)',
    sourceDate: '2025-11-28',
    bufferRadiusMeters: 200,
    activeAlertsCount: 2,
    center: [12.7885, 80.2452],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.236, 12.802],
          [80.254, 12.801],
          [80.256, 12.775],
          [80.239, 12.778],
          [80.236, 12.802]
        ]
      ]
    }
  }
];

export const mockDetectedChanges: DetectedChange[] = [
  {
    id: 'CHG-2026-001',
    waterBodyId: 'WB-TN-001',
    waterBodyName: 'Chembarambakkam Lake',
    locationName: 'North-Eastern Bund Sector 4, Kundrathur Link',
    center: [13.0235, 80.0685],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.0678, 13.0242],
          [80.0694, 13.0240],
          [80.0691, 13.0228],
          [80.0676, 13.0230],
          [80.0678, 13.0242]
        ]
      ]
    },
    beforeDate: '2026-01-14',
    afterDate: '2026-07-18',
    beforeImage: generateSatelliteSvg('before', 'New Construction', 'reservoir'),
    afterImage: generateSatelliteSvg('after', 'New Construction', 'reservoir'),
    changedAreaSqM: 420,
    changePercentage: 68.5,
    changeType: 'New Construction',
    confidence: 94,
    distanceToWaterMeters: 22,
    insideBuffer: true,
    bufferOverlapPercentage: 92,
    timeline: [
      {
        observationId: 'OBS-01',
        date: '2026-01-14',
        label: 'Jan 2026',
        description: 'Baseline observation: Pristine lakeside grassland without disturbance.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Undisturbed Baseline'
      },
      {
        observationId: 'OBS-02',
        date: '2026-03-22',
        label: 'Mar 2026',
        description: 'Vegetation clearing and compacted soil footprint spotted.',
        changeAreaSqM: 85,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Initial Earthwork'
      },
      {
        observationId: 'OBS-03',
        date: '2026-05-10',
        label: 'May 2026',
        description: 'Poured concrete foundation columns and peripheral boundary walls.',
        changeAreaSqM: 210,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Foundation Plinth'
      },
      {
        observationId: 'OBS-04',
        date: '2026-07-18',
        label: 'Jul 2026',
        description: 'Multi-room commercial shed framing with roofing sheets encroaching buffer zone.',
        changeAreaSqM: 420,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Superstructure Erected'
      }
    ]
  },
  {
    id: 'CHG-2026-002',
    waterBodyId: 'WB-TN-002',
    waterBodyName: 'Pallikaranai Marshland',
    locationName: 'Radial Road Southern Flank, Sector B',
    center: [12.9325, 80.2162],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2152, 12.9332],
          [80.2173, 12.9330],
          [80.2170, 12.9318],
          [80.2150, 12.9320],
          [80.2152, 12.9332]
        ]
      ]
    },
    beforeDate: '2026-01-08',
    afterDate: '2026-07-22',
    beforeImage: generateSatelliteSvg('before', 'Land Filling', 'wetland'),
    afterImage: generateSatelliteSvg('after', 'Land Filling', 'wetland'),
    changedAreaSqM: 680,
    changePercentage: 81.2,
    changeType: 'Land Filling',
    confidence: 96,
    distanceToWaterMeters: 14,
    insideBuffer: true,
    bufferOverlapPercentage: 98,
    timeline: [
      {
        observationId: 'OBS-11',
        date: '2026-01-08',
        label: 'Jan 2026',
        description: 'High-density marsh vegetation with normal seasonal inundation.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'Land Filling'),
        stageBadge: 'Natural Wetland'
      },
      {
        observationId: 'OBS-12',
        date: '2026-03-15',
        label: 'Mar 2026',
        description: 'Debris dumping trucks creating temporary berm in wetland fringe.',
        changeAreaSqM: 140,
        imageUrl: generateSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Dumping Tracks'
      },
      {
        observationId: 'OBS-13',
        date: '2026-05-18',
        label: 'May 2026',
        description: 'Bulldozed leveling of construction rubble over natural marsh basin.',
        changeAreaSqM: 390,
        imageUrl: generateSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Surface Leveled'
      },
      {
        observationId: 'OBS-14',
        date: '2026-07-22',
        label: 'Jul 2026',
        description: 'Extensive red-soil fill plot prepared for unauthorized commercial parking yard.',
        changeAreaSqM: 680,
        imageUrl: generateSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Major Infill Plot'
      }
    ]
  },
  {
    id: 'CHG-2026-003',
    waterBodyId: 'WB-TN-003',
    waterBodyName: 'Velachery Lake',
    locationName: 'Dhandeeswaram Colony Border, Byepass Edge',
    center: [12.9832, 80.2245],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2238, 12.9838],
          [80.2250, 12.9836],
          [80.2248, 12.9826],
          [80.2236, 12.9828],
          [80.2238, 12.9838]
        ]
      ]
    },
    beforeDate: '2026-02-05',
    afterDate: '2026-08-02',
    beforeImage: generateSatelliteSvg('before', 'New Construction'),
    afterImage: generateSatelliteSvg('after', 'New Construction'),
    changedAreaSqM: 310,
    changePercentage: 74.0,
    changeType: 'New Construction',
    confidence: 91,
    distanceToWaterMeters: 18,
    insideBuffer: true,
    bufferOverlapPercentage: 88,
    timeline: [
      {
        observationId: 'OBS-21',
        date: '2026-02-05',
        label: 'Feb 2026',
        description: 'Empty lake periphery behind residential street fence.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Vacant Buffer'
      },
      {
        observationId: 'OBS-22',
        date: '2026-04-12',
        label: 'Apr 2026',
        description: 'Erection of temporary tin barricades encroaching 15m into lake boundary.',
        changeAreaSqM: 95,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Enclosure Placed'
      },
      {
        observationId: 'OBS-23',
        date: '2026-06-19',
        label: 'Jun 2026',
        description: 'RCC pillared structure being erected without municipal display board.',
        changeAreaSqM: 220,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'RCC Pillars'
      },
      {
        observationId: 'OBS-24',
        date: '2026-08-02',
        label: 'Aug 2026',
        description: 'Double-tier structure with ongoing brick masonry adjacent to lake bund.',
        changeAreaSqM: 310,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Brick Masonry'
      }
    ]
  },
  {
    id: 'CHG-2026-004',
    waterBodyId: 'WB-TN-004',
    waterBodyName: 'Porur Lake',
    locationName: 'Moulivakkam Water Outlet Channel',
    center: [13.0315, 80.1475],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.1468, 13.0322],
          [80.1482, 13.0320],
          [80.1480, 13.0308],
          [80.1466, 13.0310],
          [80.1468, 13.0322]
        ]
      ]
    },
    beforeDate: '2026-01-20',
    afterDate: '2026-07-15',
    beforeImage: generateSatelliteSvg('before', 'Road/Surface Change'),
    afterImage: generateSatelliteSvg('after', 'Road/Surface Change'),
    changedAreaSqM: 260,
    changePercentage: 59.0,
    changeType: 'Road/Surface Change',
    confidence: 88,
    distanceToWaterMeters: 45,
    insideBuffer: true,
    bufferOverlapPercentage: 72,
    timeline: [
      {
        observationId: 'OBS-31',
        date: '2026-01-20',
        label: 'Jan 2026',
        description: 'Unpaved pathway along culvert.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'Road/Surface Change'),
        stageBadge: 'Unpaved Channel'
      },
      {
        observationId: 'OBS-32',
        date: '2026-07-15',
        label: 'Jul 2026',
        description: 'Widened macadam road surface laid over surplus channel buffer zone.',
        changeAreaSqM: 260,
        imageUrl: generateSatelliteSvg('after', 'Road/Surface Change'),
        stageBadge: 'Macadam Surfacing'
      }
    ]
  },
  {
    id: 'CHG-2026-005',
    waterBodyId: 'WB-TN-002',
    waterBodyName: 'Pallikaranai Marshland',
    locationName: 'Perungudi Marsh Fringe, Near IT Corridor',
    center: [12.9465, 80.2212],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2205, 12.9472],
          [80.2220, 12.9470],
          [80.2218, 12.9458],
          [80.2202, 12.9460],
          [80.2205, 12.9472]
        ]
      ]
    },
    beforeDate: '2026-02-11',
    afterDate: '2026-07-30',
    beforeImage: generateSatelliteSvg('before', 'New Construction'),
    afterImage: generateSatelliteSvg('after', 'New Construction'),
    changedAreaSqM: 520,
    changePercentage: 78.4,
    changeType: 'New Construction',
    confidence: 93,
    distanceToWaterMeters: 28,
    insideBuffer: true,
    bufferOverlapPercentage: 86,
    timeline: [
      {
        observationId: 'OBS-41',
        date: '2026-02-11',
        label: 'Feb 2026',
        description: 'Open marsh water boundary.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Open Wetland'
      },
      {
        observationId: 'OBS-42',
        date: '2026-04-20',
        label: 'Apr 2026',
        description: 'Hardened gravel pad laid down.',
        changeAreaSqM: 180,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Gravel Pad'
      },
      {
        observationId: 'OBS-43',
        date: '2026-07-30',
        label: 'Jul 2026',
        description: 'Erection of warehouse prefabricated structure inside ecological buffer.',
        changeAreaSqM: 520,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Prefab Warehouse'
      }
    ]
  },
  {
    id: 'CHG-2026-006',
    waterBodyId: 'WB-TN-006',
    waterBodyName: 'Kovalam Estuary & CRZ',
    locationName: 'CRZ-III Coastal Estuary Sandbar',
    center: [12.7912, 80.2485],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2476, 12.7920],
          [80.2494, 12.7918],
          [80.2492, 12.7905],
          [80.2474, 12.7907],
          [80.2476, 12.7920]
        ]
      ]
    },
    beforeDate: '2026-01-30',
    afterDate: '2026-08-06',
    beforeImage: generateSatelliteSvg('before', 'New Construction', 'wetland'),
    afterImage: generateSatelliteSvg('after', 'New Construction', 'wetland'),
    changedAreaSqM: 490,
    changePercentage: 72.1,
    changeType: 'New Construction',
    confidence: 95,
    distanceToWaterMeters: 35,
    insideBuffer: true,
    bufferOverlapPercentage: 84,
    timeline: [
      {
        observationId: 'OBS-51',
        date: '2026-01-30',
        label: 'Jan 2026',
        description: 'Coastal dunes and estuary mudflat with halophytic vegetation.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Estuarine Sandbar'
      },
      {
        observationId: 'OBS-52',
        date: '2026-08-06',
        label: 'Aug 2026',
        description: 'Unauthorized resort cottages foundation and swimming pool excavation in CRZ No-Development Zone.',
        changeAreaSqM: 490,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Resort Structure'
      }
    ]
  },
  {
    id: 'CHG-2026-007',
    waterBodyId: 'WB-TN-005',
    waterBodyName: 'Ambattur Lake',
    locationName: 'Western Surplus Weir Embankment',
    center: [13.1118, 80.1605],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.1598, 13.1124],
          [80.1612, 13.1122],
          [80.1610, 13.1112],
          [80.1596, 13.1114],
          [80.1598, 13.1124]
        ]
      ]
    },
    beforeDate: '2026-02-18',
    afterDate: '2026-07-28',
    beforeImage: generateSatelliteSvg('before', 'Land Filling'),
    afterImage: generateSatelliteSvg('after', 'Land Filling'),
    changedAreaSqM: 340,
    changePercentage: 62.5,
    changeType: 'Land Filling',
    confidence: 89,
    distanceToWaterMeters: 55,
    insideBuffer: true,
    bufferOverlapPercentage: 65,
    timeline: [
      {
        observationId: 'OBS-61',
        date: '2026-02-18',
        label: 'Feb 2026',
        description: 'Natural lake sloped bank.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'Land Filling'),
        stageBadge: 'Natural Slope'
      },
      {
        observationId: 'OBS-62',
        date: '2026-07-28',
        label: 'Jul 2026',
        description: 'Construction debris dumped to level ground for lorry parking.',
        changeAreaSqM: 340,
        imageUrl: generateSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Debris Leveling'
      }
    ]
  },
  {
    id: 'CHG-2026-008',
    waterBodyId: 'WB-TN-001',
    waterBodyName: 'Chembarambakkam Lake',
    locationName: 'South Shore Agrarian Transition Belt',
    center: [12.9962, 80.0542],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.0535, 12.9968],
          [80.0550, 12.9966],
          [80.0548, 12.9956],
          [80.0533, 12.9958],
          [80.0535, 12.9968]
        ]
      ]
    },
    beforeDate: '2026-03-01',
    afterDate: '2026-08-04',
    beforeImage: generateSatelliteSvg('before', 'Vegetation Change'),
    afterImage: generateSatelliteSvg('after', 'Vegetation Change'),
    changedAreaSqM: 180,
    changePercentage: 45.0,
    changeType: 'Vegetation Change',
    confidence: 82,
    distanceToWaterMeters: 85,
    insideBuffer: true,
    bufferOverlapPercentage: 40,
    timeline: [
      {
        observationId: 'OBS-71',
        date: '2026-03-01',
        label: 'Mar 2026',
        description: 'Dense prosopis and riparian bush.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'Vegetation Change'),
        stageBadge: 'Riparian Bush'
      },
      {
        observationId: 'OBS-72',
        date: '2026-08-04',
        label: 'Aug 2026',
        description: 'Selective canopy clearing observed near private property boundary.',
        changeAreaSqM: 180,
        imageUrl: generateSatelliteSvg('after', 'Vegetation Change'),
        stageBadge: 'Cleared Perimeter'
      }
    ]
  },
  {
    id: 'CHG-2026-009',
    waterBodyId: 'WB-TN-002',
    waterBodyName: 'Pallikaranai Marshland',
    locationName: 'Medavakkam Margin Sanctuary Gate 3',
    center: [12.9215, 80.2085],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2078, 12.9222],
          [80.2092, 12.9220],
          [80.2090, 12.9208],
          [80.2076, 12.9210],
          [80.2078, 12.9222]
        ]
      ]
    },
    beforeDate: '2026-01-25',
    afterDate: '2026-07-29',
    beforeImage: generateSatelliteSvg('before', 'New Construction'),
    afterImage: generateSatelliteSvg('after', 'New Construction'),
    changedAreaSqM: 375,
    changePercentage: 66.8,
    changeType: 'New Construction',
    confidence: 90,
    distanceToWaterMeters: 42,
    insideBuffer: true,
    bufferOverlapPercentage: 75,
    timeline: [
      {
        observationId: 'OBS-81',
        date: '2026-01-25',
        label: 'Jan 2026',
        description: 'Seasonally flooded depression.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Natural Wetland'
      },
      {
        observationId: 'OBS-82',
        date: '2026-07-29',
        label: 'Jul 2026',
        description: 'Concrete batching yard and perimeter wall erected.',
        changeAreaSqM: 375,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Commercial Yard'
      }
    ]
  },
  {
    id: 'CHG-2026-010',
    waterBodyId: 'WB-TN-004',
    waterBodyName: 'Porur Lake',
    locationName: 'Ramapuram Inflow Canal Junction',
    center: [13.0425, 80.1525],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.1518, 13.0432],
          [80.1532, 13.0430],
          [80.1530, 13.0418],
          [80.1516, 13.0420],
          [80.1518, 13.0432]
        ]
      ]
    },
    beforeDate: '2026-02-14',
    afterDate: '2026-08-01',
    beforeImage: generateSatelliteSvg('before', 'New Construction'),
    afterImage: generateSatelliteSvg('after', 'New Construction'),
    changedAreaSqM: 290,
    changePercentage: 64.0,
    changeType: 'New Construction',
    confidence: 87,
    distanceToWaterMeters: 62,
    insideBuffer: true,
    bufferOverlapPercentage: 58,
    timeline: [
      {
        observationId: 'OBS-91',
        date: '2026-02-14',
        label: 'Feb 2026',
        description: 'Vacant open field adjoining canal.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Open Ground'
      },
      {
        observationId: 'OBS-92',
        date: '2026-08-01',
        label: 'Aug 2026',
        description: 'Commercial workshop foundation extending toward feeder inlet.',
        changeAreaSqM: 290,
        imageUrl: generateSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Workshop Shed'
      }
    ]
  },
  {
    id: 'CHG-2026-011',
    waterBodyId: 'WB-TN-006',
    waterBodyName: 'Kovalam Estuary & CRZ',
    locationName: 'Muttukadu Backwater Confluence CRZ-I',
    center: [12.8052, 80.2415],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2408, 12.8058],
          [80.2422, 12.8056],
          [80.2420, 12.8046],
          [80.2406, 12.8048],
          [80.2408, 12.8058]
        ]
      ]
    },
    beforeDate: '2026-01-18',
    afterDate: '2026-07-16',
    beforeImage: generateSatelliteSvg('before', 'Land Filling', 'wetland'),
    afterImage: generateSatelliteSvg('after', 'Land Filling', 'wetland'),
    changedAreaSqM: 410,
    changePercentage: 71.0,
    changeType: 'Land Filling',
    confidence: 92,
    distanceToWaterMeters: 26,
    insideBuffer: true,
    bufferOverlapPercentage: 88,
    timeline: [
      {
        observationId: 'OBS-101',
        date: '2026-01-18',
        label: 'Jan 2026',
        description: 'Tidal mangrove cluster in CRZ-I sensitive zone.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'Land Filling'),
        stageBadge: 'Mangrove Zone'
      },
      {
        observationId: 'OBS-102',
        date: '2026-07-16',
        label: 'Jul 2026',
        description: 'Earth embankment built, cutting off tidal creek flow.',
        changeAreaSqM: 410,
        imageUrl: generateSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Tidal Blockade'
      }
    ]
  },
  {
    id: 'CHG-2026-012',
    waterBodyId: 'WB-TN-003',
    waterBodyName: 'Velachery Lake',
    locationName: 'Kaiveli Marsh Outlet Drain Channel',
    center: [12.9752, 80.2192],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.2185, 12.9758],
          [80.2198, 12.9756],
          [80.2196, 12.9746],
          [80.2183, 12.9748],
          [80.2185, 12.9758]
        ]
      ]
    },
    beforeDate: '2026-02-28',
    afterDate: '2026-08-05',
    beforeImage: generateSatelliteSvg('before', 'Unknown Change'),
    afterImage: generateSatelliteSvg('after', 'Unknown Change'),
    changedAreaSqM: 150,
    changePercentage: 38.0,
    changeType: 'Unknown Change',
    confidence: 76,
    distanceToWaterMeters: 110,
    insideBuffer: false,
    bufferOverlapPercentage: 15,
    timeline: [
      {
        observationId: 'OBS-111',
        date: '2026-02-28',
        label: 'Feb 2026',
        description: 'Roadside ditch and open scrub.',
        changeAreaSqM: 0,
        imageUrl: generateSatelliteSvg('before', 'Unknown Change'),
        stageBadge: 'Open Scrub'
      },
      {
        observationId: 'OBS-112',
        date: '2026-08-05',
        label: 'Aug 2026',
        description: 'Temporary tarpaulin stalls and scrap storage.',
        changeAreaSqM: 150,
        imageUrl: generateSatelliteSvg('after', 'Unknown Change'),
        stageBadge: 'Temporary Stalls'
      }
    ]
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-2026-001',
    changeId: 'CHG-2026-001',
    locationName: 'North-Eastern Bund Sector 4, Kundrathur Link',
    waterBodyId: 'WB-TN-001',
    waterBodyName: 'Chembarambakkam Lake',
    district: 'Kanchipuram / Chennai',
    changeType: 'New Construction',
    changedAreaSqM: 420,
    distanceToWaterMeters: 22,
    insideBuffer: true,
    riskScore: 89,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 89,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 19,
      bufferOverlapScore: 20,
      recentChangeScore: 18,
      constructionGrowthScore: 17,
      confidenceScore: 15,
      explanation: 'Critical proximity to major reservoir bund with rapid 4-stage footprint expansion inside the 50m core buffer.'
    },
    detectionDate: '2026-07-18',
    previousObservationDate: '2026-05-10',
    status: 'New',
    confidence: 94,
    coordinates: [13.0235, 80.0685],
    geometry: mockDetectedChanges[0].geometry,
    timeline: mockDetectedChanges[0].timeline,
    beforeImage: mockDetectedChanges[0].beforeImage,
    afterImage: mockDetectedChanges[0].afterImage
  },
  {
    id: 'ALT-2026-002',
    changeId: 'CHG-2026-002',
    locationName: 'Radial Road Southern Flank, Sector B',
    waterBodyId: 'WB-TN-002',
    waterBodyName: 'Pallikaranai Marshland',
    district: 'Chennai',
    changeType: 'Land Filling',
    changedAreaSqM: 680,
    distanceToWaterMeters: 14,
    insideBuffer: true,
    riskScore: 95,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 95,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 20,
      bufferOverlapScore: 20,
      recentChangeScore: 19,
      constructionGrowthScore: 18,
      confidenceScore: 18,
      explanation: 'Massive illegal landfilling inside protected Ramsar wetland boundary. Rapid destruction of natural flood buffer.'
    },
    detectionDate: '2026-07-22',
    previousObservationDate: '2026-05-18',
    status: 'Inspection Assigned',
    associatedCaseId: 'CASE-2026-001',
    confidence: 96,
    coordinates: [12.9325, 80.2162],
    geometry: mockDetectedChanges[1].geometry,
    timeline: mockDetectedChanges[1].timeline,
    beforeImage: mockDetectedChanges[1].beforeImage,
    afterImage: mockDetectedChanges[1].afterImage
  },
  {
    id: 'ALT-2026-003',
    changeId: 'CHG-2026-003',
    locationName: 'Dhandeeswaram Colony Border, Byepass Edge',
    waterBodyId: 'WB-TN-003',
    waterBodyName: 'Velachery Lake',
    district: 'Chennai',
    changeType: 'New Construction',
    changedAreaSqM: 310,
    distanceToWaterMeters: 18,
    insideBuffer: true,
    riskScore: 86,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 86,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 19,
      bufferOverlapScore: 19,
      recentChangeScore: 17,
      constructionGrowthScore: 16,
      confidenceScore: 15,
      explanation: 'High-density urban encroachment. Permanent RCC column framing detected 18 meters from lake edge.'
    },
    detectionDate: '2026-08-02',
    previousObservationDate: '2026-06-19',
    status: 'Under Review',
    confidence: 91,
    coordinates: [12.9832, 80.2245],
    geometry: mockDetectedChanges[2].geometry,
    timeline: mockDetectedChanges[2].timeline,
    beforeImage: mockDetectedChanges[2].beforeImage,
    afterImage: mockDetectedChanges[2].afterImage
  },
  {
    id: 'ALT-2026-004',
    changeId: 'CHG-2026-004',
    locationName: 'Moulivakkam Water Outlet Channel',
    waterBodyId: 'WB-TN-004',
    waterBodyName: 'Porur Lake',
    district: 'Tiruvallur / Chennai',
    changeType: 'Road/Surface Change',
    changedAreaSqM: 260,
    distanceToWaterMeters: 45,
    insideBuffer: true,
    riskScore: 68,
    riskLevel: 'HIGH',
    riskBreakdown: {
      totalScore: 68,
      riskLevel: 'HIGH',
      waterProximityScore: 15,
      bufferOverlapScore: 16,
      recentChangeScore: 14,
      constructionGrowthScore: 11,
      confidenceScore: 12,
      explanation: 'Surplus flood drainage channel altered with unauthorized gravel and tar paving.'
    },
    detectionDate: '2026-07-15',
    previousObservationDate: '2026-01-20',
    status: 'New',
    confidence: 88,
    coordinates: [13.0315, 80.1475],
    geometry: mockDetectedChanges[3].geometry,
    timeline: mockDetectedChanges[3].timeline,
    beforeImage: mockDetectedChanges[3].beforeImage,
    afterImage: mockDetectedChanges[3].afterImage
  },
  {
    id: 'ALT-2026-005',
    changeId: 'CHG-2026-005',
    locationName: 'Perungudi Marsh Fringe, Near IT Corridor',
    waterBodyId: 'WB-TN-002',
    waterBodyName: 'Pallikaranai Marshland',
    district: 'Chennai',
    changeType: 'New Construction',
    changedAreaSqM: 520,
    distanceToWaterMeters: 28,
    insideBuffer: true,
    riskScore: 84,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 84,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 18,
      bufferOverlapScore: 18,
      recentChangeScore: 16,
      constructionGrowthScore: 17,
      confidenceScore: 15,
      explanation: 'Heavy commercial warehouse prefab construction progressing within 28m of eco-sensitive zone.'
    },
    detectionDate: '2026-07-30',
    previousObservationDate: '2026-04-20',
    status: 'Inspection Assigned',
    associatedCaseId: 'CASE-2026-002',
    confidence: 93,
    coordinates: [12.9465, 80.2212],
    geometry: mockDetectedChanges[4].geometry,
    timeline: mockDetectedChanges[4].timeline,
    beforeImage: mockDetectedChanges[4].beforeImage,
    afterImage: mockDetectedChanges[4].afterImage
  },
  {
    id: 'ALT-2026-006',
    changeId: 'CHG-2026-006',
    locationName: 'CRZ-III Coastal Estuary Sandbar',
    waterBodyId: 'WB-TN-006',
    waterBodyName: 'Kovalam Estuary & CRZ',
    district: 'Chengalpattu',
    changeType: 'New Construction',
    changedAreaSqM: 490,
    distanceToWaterMeters: 35,
    insideBuffer: true,
    riskScore: 88,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 88,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 18,
      bufferOverlapScore: 19,
      recentChangeScore: 18,
      constructionGrowthScore: 16,
      confidenceScore: 17,
      explanation: 'Unauthorized structures on coastal sandbar violating CRZ-I/III 200m non-development buffer regulations.'
    },
    detectionDate: '2026-08-06',
    previousObservationDate: '2026-01-30',
    status: 'New',
    confidence: 95,
    coordinates: [12.7912, 80.2485],
    geometry: mockDetectedChanges[5].geometry,
    timeline: mockDetectedChanges[5].timeline,
    beforeImage: mockDetectedChanges[5].beforeImage,
    afterImage: mockDetectedChanges[5].afterImage
  },
  {
    id: 'ALT-2026-007',
    changeId: 'CHG-2026-007',
    locationName: 'Western Surplus Weir Embankment',
    waterBodyId: 'WB-TN-005',
    waterBodyName: 'Ambattur Lake',
    district: 'Tiruvallur',
    changeType: 'Land Filling',
    changedAreaSqM: 340,
    distanceToWaterMeters: 55,
    insideBuffer: true,
    riskScore: 71,
    riskLevel: 'HIGH',
    riskBreakdown: {
      totalScore: 71,
      riskLevel: 'HIGH',
      waterProximityScore: 14,
      bufferOverlapScore: 15,
      recentChangeScore: 15,
      constructionGrowthScore: 14,
      confidenceScore: 13,
      explanation: 'Rubble dumping along surplus overflow bund creating artificial elevated platform.'
    },
    detectionDate: '2026-07-28',
    previousObservationDate: '2026-02-18',
    status: 'Under Review',
    confidence: 89,
    coordinates: [13.1118, 80.1605],
    geometry: mockDetectedChanges[6].geometry,
    timeline: mockDetectedChanges[6].timeline,
    beforeImage: mockDetectedChanges[6].beforeImage,
    afterImage: mockDetectedChanges[6].afterImage
  },
  {
    id: 'ALT-2026-008',
    changeId: 'CHG-2026-008',
    locationName: 'South Shore Agrarian Transition Belt',
    waterBodyId: 'WB-TN-001',
    waterBodyName: 'Chembarambakkam Lake',
    district: 'Kanchipuram / Chennai',
    changeType: 'Vegetation Change',
    changedAreaSqM: 180,
    distanceToWaterMeters: 85,
    insideBuffer: true,
    riskScore: 48,
    riskLevel: 'MEDIUM',
    riskBreakdown: {
      totalScore: 48,
      riskLevel: 'MEDIUM',
      waterProximityScore: 11,
      bufferOverlapScore: 10,
      recentChangeScore: 11,
      constructionGrowthScore: 8,
      confidenceScore: 8,
      explanation: 'Riparian scrub clearance outside primary 50m ring, but within 100m monitoring zone.'
    },
    detectionDate: '2026-08-04',
    previousObservationDate: '2026-03-01',
    status: 'New',
    confidence: 82,
    coordinates: [12.9962, 80.0542],
    geometry: mockDetectedChanges[7].geometry,
    timeline: mockDetectedChanges[7].timeline,
    beforeImage: mockDetectedChanges[7].beforeImage,
    afterImage: mockDetectedChanges[7].afterImage
  },
  {
    id: 'ALT-2026-009',
    changeId: 'CHG-2026-009',
    locationName: 'Medavakkam Margin Sanctuary Gate 3',
    waterBodyId: 'WB-TN-002',
    waterBodyName: 'Pallikaranai Marshland',
    district: 'Chennai',
    changeType: 'New Construction',
    changedAreaSqM: 375,
    distanceToWaterMeters: 42,
    insideBuffer: true,
    riskScore: 78,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 78,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 16,
      bufferOverlapScore: 17,
      recentChangeScore: 16,
      constructionGrowthScore: 15,
      confidenceScore: 14,
      explanation: 'Concrete batching yard setup within bird sanctuary feeding perimeter.'
    },
    detectionDate: '2026-07-29',
    previousObservationDate: '2026-01-25',
    status: 'Field Verified',
    associatedCaseId: 'CASE-2026-003',
    confidence: 90,
    coordinates: [12.9215, 80.2085],
    geometry: mockDetectedChanges[8].geometry,
    timeline: mockDetectedChanges[8].timeline,
    beforeImage: mockDetectedChanges[8].beforeImage,
    afterImage: mockDetectedChanges[8].afterImage
  },
  {
    id: 'ALT-2026-010',
    changeId: 'CHG-2026-010',
    locationName: 'Ramapuram Inflow Canal Junction',
    waterBodyId: 'WB-TN-004',
    waterBodyName: 'Porur Lake',
    district: 'Tiruvallur / Chennai',
    changeType: 'New Construction',
    changedAreaSqM: 290,
    distanceToWaterMeters: 62,
    insideBuffer: true,
    riskScore: 64,
    riskLevel: 'HIGH',
    riskBreakdown: {
      totalScore: 64,
      riskLevel: 'HIGH',
      waterProximityScore: 13,
      bufferOverlapScore: 14,
      recentChangeScore: 14,
      constructionGrowthScore: 12,
      confidenceScore: 11,
      explanation: 'Workshop foundation and sheet shed in proximity to storm inlet stream.'
    },
    detectionDate: '2026-08-01',
    previousObservationDate: '2026-02-14',
    status: 'New',
    confidence: 87,
    coordinates: [13.0425, 80.1525],
    geometry: mockDetectedChanges[9].geometry,
    timeline: mockDetectedChanges[9].timeline,
    beforeImage: mockDetectedChanges[9].beforeImage,
    afterImage: mockDetectedChanges[9].afterImage
  },
  {
    id: 'ALT-2026-011',
    changeId: 'CHG-2026-011',
    locationName: 'Muttukadu Backwater Confluence CRZ-I',
    waterBodyId: 'WB-TN-006',
    waterBodyName: 'Kovalam Estuary & CRZ',
    district: 'Chengalpattu',
    changeType: 'Land Filling',
    changedAreaSqM: 410,
    distanceToWaterMeters: 26,
    insideBuffer: true,
    riskScore: 85,
    riskLevel: 'VERY HIGH',
    riskBreakdown: {
      totalScore: 85,
      riskLevel: 'VERY HIGH',
      waterProximityScore: 18,
      bufferOverlapScore: 19,
      recentChangeScore: 17,
      constructionGrowthScore: 16,
      confidenceScore: 15,
      explanation: 'Mangrove tidal channel obstruction via clay & stone bund in high ecological sensitivity zone.'
    },
    detectionDate: '2026-07-16',
    previousObservationDate: '2026-01-18',
    status: 'Closed',
    associatedCaseId: 'CASE-2026-004',
    confidence: 92,
    coordinates: [12.8052, 80.2415],
    geometry: mockDetectedChanges[10].geometry,
    timeline: mockDetectedChanges[10].timeline,
    beforeImage: mockDetectedChanges[10].beforeImage,
    afterImage: mockDetectedChanges[10].afterImage
  },
  {
    id: 'ALT-2026-012',
    changeId: 'CHG-2026-012',
    locationName: 'Kaiveli Marsh Outlet Drain Channel',
    waterBodyId: 'WB-TN-003',
    waterBodyName: 'Velachery Lake',
    district: 'Chennai',
    changeType: 'Unknown Change',
    changedAreaSqM: 150,
    distanceToWaterMeters: 110,
    insideBuffer: false,
    riskScore: 24,
    riskLevel: 'LOW',
    riskBreakdown: {
      totalScore: 24,
      riskLevel: 'LOW',
      waterProximityScore: 5,
      bufferOverlapScore: 4,
      recentChangeScore: 6,
      constructionGrowthScore: 5,
      confidenceScore: 4,
      explanation: 'Temporary scrap storage beyond default 50m regulatory buffer zone.'
    },
    detectionDate: '2026-08-05',
    previousObservationDate: '2026-02-28',
    status: 'New',
    confidence: 76,
    coordinates: [12.9752, 80.2192],
    geometry: mockDetectedChanges[11].geometry,
    timeline: mockDetectedChanges[11].timeline,
    beforeImage: mockDetectedChanges[11].beforeImage,
    afterImage: mockDetectedChanges[11].afterImage
  }
];

export const mockInspectionCases: InspectionCase[] = [
  {
    caseId: 'CASE-2026-001',
    alertId: 'ALT-2026-002',
    locationName: 'Radial Road Southern Flank, Sector B',
    waterBodyName: 'Pallikaranai Marshland',
    riskScore: 95,
    riskLevel: 'VERY HIGH',
    detectionEvidence: {
      changedAreaSqM: 680,
      changeType: 'Land Filling',
      confidence: 96,
      distanceToWaterMeters: 14,
      detectionDate: '2026-07-22',
      beforeImage: mockDetectedChanges[1].beforeImage,
      afterImage: mockDetectedChanges[1].afterImage
    },
    assignedInspector: 'Er. R. Senthil Kumar (AE, Water Resources Dept)',
    createdDate: '2026-07-23',
    status: 'Assigned',
    inspectorRemarks: 'Urgent spot visit scheduled with Taluk Surveyor and police protection requested.'
  },
  {
    caseId: 'CASE-2026-002',
    alertId: 'ALT-2026-005',
    locationName: 'Perungudi Marsh Fringe, Near IT Corridor',
    waterBodyName: 'Pallikaranai Marshland',
    riskScore: 84,
    riskLevel: 'VERY HIGH',
    detectionEvidence: {
      changedAreaSqM: 520,
      changeType: 'New Construction',
      confidence: 93,
      distanceToWaterMeters: 28,
      detectionDate: '2026-07-30',
      beforeImage: mockDetectedChanges[4].beforeImage,
      afterImage: mockDetectedChanges[4].afterImage
    },
    assignedInspector: 'Smt. M. Kanimozhi (Tahsildar, Sholinganallur)',
    createdDate: '2026-07-31',
    status: 'Assigned',
    inspectorRemarks: 'Preliminary notice served to adjacent site supervisor. Boundary demarcation in progress.'
  },
  {
    caseId: 'CASE-2026-003',
    alertId: 'ALT-2026-009',
    locationName: 'Medavakkam Margin Sanctuary Gate 3',
    waterBodyName: 'Pallikaranai Marshland',
    riskScore: 78,
    riskLevel: 'VERY HIGH',
    detectionEvidence: {
      changedAreaSqM: 375,
      changeType: 'New Construction',
      confidence: 90,
      distanceToWaterMeters: 42,
      detectionDate: '2026-07-29',
      beforeImage: mockDetectedChanges[8].beforeImage,
      afterImage: mockDetectedChanges[8].afterImage
    },
    assignedInspector: 'Dr. V. Ramanathan (Forest Ranger, Nanmangalam)',
    createdDate: '2026-07-30',
    status: 'Field Inspection Completed',
    inspectorRemarks: 'Verified unauthorized batching plant operation within eco-sensitive zone.',
    fieldVerificationResult: {
      verifiedBy: 'Dr. V. Ramanathan, Nanmangalam Range',
      inspectionDate: '2026-08-01',
      finding: 'Confirmed unauthorized concrete mixer setup and 3.5m high hollow-brick wall.',
      actionTaken: 'Summons issued under TN Forest Act & Water Bodies Protection Act. Equipment seized.'
    }
  },
  {
    caseId: 'CASE-2026-004',
    alertId: 'ALT-2026-011',
    locationName: 'Muttukadu Backwater Confluence CRZ-I',
    waterBodyName: 'Kovalam Estuary & CRZ',
    riskScore: 85,
    riskLevel: 'VERY HIGH',
    detectionEvidence: {
      changedAreaSqM: 410,
      changeType: 'Land Filling',
      confidence: 92,
      distanceToWaterMeters: 26,
      detectionDate: '2026-07-16',
      beforeImage: mockDetectedChanges[10].beforeImage,
      afterImage: mockDetectedChanges[10].afterImage
    },
    assignedInspector: 'Thiru. K. Prabhakaran (District Revenue Officer)',
    createdDate: '2026-07-17',
    status: 'Verified',
    inspectorRemarks: 'Complete restoration ordered. Illegal bund dismantled by PWD earthmovers.',
    fieldVerificationResult: {
      verifiedBy: 'Thiru. K. Prabhakaran & CZMA Team',
      inspectionDate: '2026-07-20',
      finding: 'Earthen damming of tidal feeder confirmed. Severe ecological disruption.',
      actionTaken: 'Bund cleared using backhoes on 2026-07-21. Water channel restored to natural ebb.'
    }
  },
  {
    caseId: 'CASE-2026-005',
    alertId: 'ALT-2026-001',
    locationName: 'North-Eastern Bund Sector 4, Kundrathur Link',
    waterBodyName: 'Chembarambakkam Lake',
    riskScore: 89,
    riskLevel: 'VERY HIGH',
    detectionEvidence: {
      changedAreaSqM: 420,
      changeType: 'New Construction',
      confidence: 94,
      distanceToWaterMeters: 22,
      detectionDate: '2026-07-18',
      beforeImage: mockDetectedChanges[0].beforeImage,
      afterImage: mockDetectedChanges[0].afterImage
    },
    assignedInspector: 'Pending Allocation',
    createdDate: '2026-08-02',
    status: 'Pending Assignment',
    inspectorRemarks: 'High priority alert logged by satellite automated change module.'
  }
];

export const mockHeatmapPoints: HeatmapPoint[] = mockAlerts.map(alert => ({
  id: alert.id,
  lat: alert.coordinates[0],
  lng: alert.coordinates[1],
  weight: alert.riskScore / 100,
  riskScore: alert.riskScore,
  riskLevel: alert.riskLevel,
  waterBodyType: (mockWaterBodies.find(wb => wb.id === alert.waterBodyId)?.type || 'Lake') as any,
  changeType: alert.changeType,
  locationName: alert.locationName
}));

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalMonitoredWaterBodies: 6,
  activeAlerts: 12,
  highRiskLocations: 3,
  veryHighRiskLocations: 7,
  detectedConstructionChanges: 7,
  detectedLandFilling: 3,
  pendingInspections: 2,
  verifiedCases: 3,
  alertsOverTime: [
    { month: 'Feb 2026', alerts: 1, highRisk: 1 },
    { month: 'Mar 2026', alerts: 2, highRisk: 1 },
    { month: 'Apr 2026', alerts: 2, highRisk: 2 },
    { month: 'May 2026', alerts: 3, highRisk: 2 },
    { month: 'Jun 2026', alerts: 3, highRisk: 3 },
    { month: 'Jul 2026', alerts: 5, highRisk: 4 },
    { month: 'Aug 2026', alerts: 4, highRisk: 3 }
  ],
  changeTypeDistribution: [
    { type: 'New Construction', count: 7, percentage: 58 },
    { type: 'Land Filling', count: 3, percentage: 25 },
    { type: 'Road/Surface Change', count: 1, percentage: 8.5 },
    { type: 'Vegetation Change', count: 1, percentage: 8.5 }
  ],
  riskDistribution: [
    { level: 'VERY HIGH', count: 7, color: '#ef4444' },
    { level: 'HIGH', count: 3, color: '#f97316' },
    { level: 'MEDIUM', count: 1, color: '#eab308' },
    { level: 'LOW', count: 1, color: '#22c55e' }
  ],
  waterBodyAlerts: [
    { name: 'Pallikaranai Marshland', alerts: 4, highRisk: 4 },
    { name: 'Chembarambakkam Lake', alerts: 2, highRisk: 1 },
    { name: 'Velachery Lake', alerts: 2, highRisk: 1 },
    { name: 'Kovalam Estuary & CRZ', alerts: 2, highRisk: 2 },
    { name: 'Porur Lake', alerts: 2, highRisk: 1 },
    { name: 'Ambattur Lake', alerts: 1, highRisk: 1 }
  ],
  constructionProgressionSummary: [
    { stage: 'Jan 2026 (Baseline)', avgArea: 0 },
    { stage: 'Mar 2026 (Earthwork)', avgArea: 105 },
    { stage: 'May 2026 (Foundation)', avgArea: 255 },
    { stage: 'Jul 2026 (Superstructure)', avgArea: 485 }
  ]
};
