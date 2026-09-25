import { WaterBody } from '../types';

export const fallbackWaterBodies: WaterBody[] = [
  {
    id: 'WB-001',
    name: 'Vellalore Lake',
    type: 'Lake',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    area: '42.5 ha',
    areaSqKm: 0.425,
    source: 'PWD Water Resources Dept / Coimbatore Corporation',
    sourceDate: '28 Apr 2025',
    bufferRadiusMeters: 50,
    activeAlertsCount: 23,
    center: [11.0281, 77.0086],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [77.001, 11.034],
          [77.018, 11.032],
          [77.022, 11.021],
          [77.015, 11.014],
          [77.002, 11.019],
          [77.001, 11.034]
        ]
      ]
    }
  },
  {
    id: 'WB-002',
    name: 'Ukkadam Lake',
    type: 'Lake',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    area: '36.8 ha',
    areaSqKm: 0.368,
    source: 'Coimbatore Smart City / WRD Tamil Nadu',
    sourceDate: '26 Apr 2025',
    bufferRadiusMeters: 50,
    activeAlertsCount: 3,
    center: [10.9912, 76.9601],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.953, 10.997],
          [76.968, 10.995],
          [76.972, 10.985],
          [76.964, 10.979],
          [76.952, 10.984],
          [76.953, 10.997]
        ]
      ]
    }
  },
  {
    id: 'WB-003',
    name: 'Pallikaranai Marsh',
    type: 'Wetland',
    district: 'Chennai',
    state: 'Tamil Nadu',
    area: '68.2 ha',
    areaSqKm: 0.682,
    source: 'Tamil Nadu Forest Dept / Ramsar Conservation Authority',
    sourceDate: '18 Apr 2025',
    bufferRadiusMeters: 100,
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
    id: 'WB-004',
    name: 'Kadalur Coastline',
    type: 'Coastal Zone',
    district: 'Kadalur / Cuddalore',
    state: 'Tamil Nadu',
    area: '125.6 ha',
    areaSqKm: 1.256,
    source: 'Tamil Nadu Coastal Zone Management Authority (TNCZMA)',
    sourceDate: '15 Apr 2025',
    bufferRadiusMeters: 200,
    activeAlertsCount: 2,
    center: [11.7480, 79.7714],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [79.762, 11.755],
          [79.778, 11.752],
          [79.782, 11.741],
          [79.775, 11.734],
          [79.761, 11.739],
          [79.762, 11.755]
        ]
      ]
    }
  },
  {
    id: 'WB-005',
    name: 'Puzhal Lake (Red Hills)',
    type: 'Lake',
    district: 'Chennai',
    state: 'Tamil Nadu',
    area: '74.3 ha',
    areaSqKm: 0.743,
    source: 'Chennai Metropolitan Water Supply and Sewerage Board',
    sourceDate: '05 Apr 2025',
    bufferRadiusMeters: 100,
    activeAlertsCount: 1,
    center: [13.1906, 80.1764],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.165, 13.205],
          [80.188, 13.201],
          [80.194, 13.182],
          [80.183, 13.171],
          [80.162, 13.178],
          [80.165, 13.205]
        ]
      ]
    }
  },
  {
    id: 'WB-006',
    name: 'Kovalam Estuary & Coast',
    type: 'Coastal Zone',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    area: '89.7 ha',
    areaSqKm: 0.897,
    source: 'National Centre for Sustainable Coastal Management (NCSCM)',
    sourceDate: '01 Apr 2025',
    bufferRadiusMeters: 100,
    activeAlertsCount: 3,
    center: [12.7885, 80.2514],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.245, 12.795],
          [80.258, 12.792],
          [80.262, 12.782],
          [80.255, 12.775],
          [80.242, 12.780],
          [80.245, 12.795]
        ]
      ]
    }
  },
  {
    id: 'WB-007',
    name: 'Thamirabarani River Corridor',
    type: 'River',
    district: 'Tirunelveli',
    state: 'Tamil Nadu',
    area: '210.4 ha',
    areaSqKm: 2.104,
    source: 'State Water Resources Organisation (SWRO)',
    sourceDate: '28 Mar 2025',
    bufferRadiusMeters: 100,
    activeAlertsCount: 1,
    center: [8.7139, 77.7567],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [77.748, 8.721],
          [77.762, 8.718],
          [77.766, 8.707],
          [77.759, 8.701],
          [77.746, 8.706],
          [77.748, 8.721]
        ]
      ]
    }
  },
  {
    id: 'WB-008',
    name: 'Agaram Lake',
    type: 'Lake',
    district: 'Chennai',
    state: 'Tamil Nadu',
    area: '31.2 ha',
    areaSqKm: 0.312,
    source: 'WRD Chennai Division / State Wetland Authority',
    sourceDate: '25 Mar 2025',
    bufferRadiusMeters: 50,
    activeAlertsCount: 1,
    center: [12.9234, 80.1412],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.133, 12.932],
          [80.149, 12.929],
          [80.152, 12.918],
          [80.144, 12.911],
          [80.131, 12.916],
          [80.133, 12.932]
        ]
      ]
    }
  }
];
