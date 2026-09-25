import { WaterBody } from '../types';

export const fallbackWaterBodies: WaterBody[] = [
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
    activeAlertsCount: 2,
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
