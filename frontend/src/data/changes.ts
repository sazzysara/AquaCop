import { DetectedChange } from '../types';

export function getMockSatelliteSvg(variant: 'before' | 'after', changeType: string): string {
  const isAfter = variant === 'after';
  const waterColor = '#0c4a6e';
  const groundColor = '#3f3b32';
  const vegetationColor = '#2d4a22';

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

  <rect width="600" height="400" fill="${groundColor}"/>
  <rect width="600" height="400" fill="url(#soilPat)"/>

  <path d="M0,0 Q120,40 180,120 T300,160 L0,200 Z" fill="${vegetationColor}" opacity="0.85"/>
  <path d="M450,0 Q500,80 600,120 L600,0 Z" fill="${vegetationColor}" opacity="0.9"/>
  <path d="M0,280 Q140,240 220,340 T150,400 L0,400 Z" fill="${vegetationColor}" opacity="0.75"/>

  <path d="M220,400 Q260,280 340,240 T520,180 Q560,160 600,170 L600,400 Z" fill="url(#waterGrad)"/>
  <path d="M220,400 Q260,280 340,240 T520,180 Q560,160 600,170" fill="none" stroke="#ca8a04" stroke-width="4" stroke-dasharray="6,4" opacity="0.7"/>

  <path d="M50,0 Q120,150 210,180 T320,190" fill="none" stroke="#a8a29e" stroke-width="5" stroke-linecap="round" opacity="0.6"/>

  ${
    !isAfter
      ? `
    <circle cx="280" cy="180" r="45" fill="#44403c" opacity="0.4"/>
    <text x="30" y="40" font-family="monospace" font-size="14" font-weight="bold" fill="#38bdf8" letter-spacing="2">
      SENTINEL-2 L2A (10M) • BASELINE PASS
    </text>
    <text x="30" y="60" font-family="sans-serif" font-size="12" fill="#94a3b8">
      STATUS: Undisturbed Natural Vegetation / Water Buffer Zone
    </text>
  `
      : `
    <g filter="url(#shadow)">
      ${
        changeType === 'Land Filling'
          ? `
        <polygon points="250,160 360,150 380,220 280,240 230,200" fill="#d97706" opacity="0.85" stroke="#ef4444" stroke-width="2.5"/>
        <path d="M210,180 L290,195 M220,165 L310,175" stroke="#fef08a" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="260" y="205" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SEDIMENT FILL</text>
      `
          : `
        <rect x="250" y="140" width="70" height="55" fill="#dc2626" opacity="0.9" stroke="#fee2e2" stroke-width="2"/>
        <rect x="325" y="150" width="45" height="40" fill="#ea580c" opacity="0.9" stroke="#fee2e2" stroke-width="2"/>
        <polygon points="240,198 375,198 370,225 245,225" fill="#b91c1c" opacity="0.8" stroke="#fee2e2" stroke-width="1.5"/>
        <rect x="235" y="130" width="145" height="100" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="255" y="172" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">PLINTH + ROOF</text>
      `
      }
    </g>

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

  <rect x="420" y="360" width="165" height="26" rx="4" fill="#0f172a" opacity="0.85"/>
  <text x="502" y="377" text-anchor="middle" font-family="monospace" font-size="11" fill="#cbd5e1">
    ${isAfter ? 'OBS: 18-JUL-2026' : 'OBS: 12-JAN-2026'}
  </text>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const fallbackDetectedChanges: DetectedChange[] = [
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
    beforeImage: getMockSatelliteSvg('before', 'New Construction'),
    afterImage: getMockSatelliteSvg('after', 'New Construction'),
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
        imageUrl: getMockSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Undisturbed Baseline'
      },
      {
        observationId: 'OBS-02',
        date: '2026-03-22',
        label: 'Mar 2026',
        description: 'Vegetation clearing and compacted soil footprint spotted.',
        changeAreaSqM: 85,
        imageUrl: getMockSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Initial Earthwork'
      },
      {
        observationId: 'OBS-03',
        date: '2026-05-10',
        label: 'May 2026',
        description: 'Poured concrete foundation columns and peripheral boundary walls.',
        changeAreaSqM: 210,
        imageUrl: getMockSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Foundation Plinth'
      },
      {
        observationId: 'OBS-04',
        date: '2026-07-18',
        label: 'Jul 2026',
        description: 'Multi-room commercial shed framing with roofing sheets encroaching buffer zone.',
        changeAreaSqM: 420,
        imageUrl: getMockSatelliteSvg('after', 'New Construction'),
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
    beforeImage: getMockSatelliteSvg('before', 'Land Filling'),
    afterImage: getMockSatelliteSvg('after', 'Land Filling'),
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
        imageUrl: getMockSatelliteSvg('before', 'Land Filling'),
        stageBadge: 'Natural Wetland'
      },
      {
        observationId: 'OBS-12',
        date: '2026-03-15',
        label: 'Mar 2026',
        description: 'Debris dumping trucks creating temporary berm in wetland fringe.',
        changeAreaSqM: 140,
        imageUrl: getMockSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Dumping Tracks'
      },
      {
        observationId: 'OBS-13',
        date: '2026-05-18',
        label: 'May 2026',
        description: 'Bulldozed leveling of construction rubble over natural marsh basin.',
        changeAreaSqM: 390,
        imageUrl: getMockSatelliteSvg('after', 'Land Filling'),
        stageBadge: 'Surface Leveled'
      },
      {
        observationId: 'OBS-14',
        date: '2026-07-22',
        label: 'Jul 2026',
        description: 'Extensive red-soil fill plot prepared for unauthorized commercial parking yard.',
        changeAreaSqM: 680,
        imageUrl: getMockSatelliteSvg('after', 'Land Filling'),
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
    beforeImage: getMockSatelliteSvg('before', 'New Construction'),
    afterImage: getMockSatelliteSvg('after', 'New Construction'),
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
        imageUrl: getMockSatelliteSvg('before', 'New Construction'),
        stageBadge: 'Vacant Buffer'
      },
      {
        observationId: 'OBS-22',
        date: '2026-04-12',
        label: 'Apr 2026',
        description: 'Erection of temporary tin barricades encroaching 15m into lake boundary.',
        changeAreaSqM: 95,
        imageUrl: getMockSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Enclosure Placed'
      },
      {
        observationId: 'OBS-23',
        date: '2026-06-19',
        label: 'Jun 2026',
        description: 'RCC pillared structure being erected without municipal display board.',
        changeAreaSqM: 220,
        imageUrl: getMockSatelliteSvg('after', 'New Construction'),
        stageBadge: 'RCC Pillars'
      },
      {
        observationId: 'OBS-24',
        date: '2026-08-02',
        label: 'Aug 2026',
        description: 'Double-tier structure with ongoing brick masonry adjacent to lake bund.',
        changeAreaSqM: 310,
        imageUrl: getMockSatelliteSvg('after', 'New Construction'),
        stageBadge: 'Brick Masonry'
      }
    ]
  }
];
