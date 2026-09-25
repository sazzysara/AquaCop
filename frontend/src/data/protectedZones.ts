import { ProtectedZone } from '../types';

export const fallbackProtectedZones: ProtectedZone[] = [
  {
    id: 'Z-CRZ-001',
    name: 'Kovalam Estuary CRZ-I Buffer',
    type: 'Coastal Regulation Zone',
    district: 'Chengalpattu',
    waterBodyName: 'Kovalam Estuary & Backwaters',
    areaHa: 130.6,
    bufferDistanceMeters: 50,
    legalReference: 'CRZ Notification 2019 / MoEFCC',
    effectiveDate: '12 Mar 2019',
    status: 'Active',
    coordinates: [12.7885, 80.2514],
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
    id: 'Z-WT-002',
    name: 'Pallikaranai Wetland Eco-Sensitive Buffer',
    type: 'Wetland Buffer',
    district: 'Chennai',
    waterBodyName: 'Pallikaranai Marshland',
    areaHa: 48.2,
    bufferDistanceMeters: 100,
    legalReference: 'Wetland (Conservation & Management) Rules 2017',
    effectiveDate: '15 Aug 2017',
    status: 'Active',
    coordinates: [12.9362, 80.2185],
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
    id: 'Z-LK-003',
    name: 'Vellalore Lake Protection Zone',
    type: 'Lake Protection',
    district: 'Coimbatore',
    waterBodyName: 'Vellalore Lake',
    areaHa: 62.7,
    bufferDistanceMeters: 50,
    legalReference: 'Tamil Nadu Protection of Tanks and Eviction of Encroachment Act',
    effectiveDate: '01 Jan 2020',
    status: 'Active',
    coordinates: [11.0281, 77.0086],
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
    id: 'Z-CR-004',
    name: 'Cuddalore Coastal Intertidal Buffer',
    type: 'Coastal Buffer',
    district: 'Cuddalore',
    waterBodyName: 'Bay of Bengal Coastline',
    areaHa: 34.2,
    bufferDistanceMeters: 200,
    legalReference: 'CRZ Notification 2019 / CZMA',
    effectiveDate: '12 Mar 2019',
    status: 'Active',
    coordinates: [11.7480, 79.7714],
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
    id: 'Z-OT-005',
    name: 'Thamirabarani Riparian Conservation Zone',
    type: 'Forest / Conservation',
    district: 'Tirunelveli',
    waterBodyName: 'Thamirabarani River Corridor',
    areaHa: 21.5,
    bufferDistanceMeters: 100,
    legalReference: 'Forest (Conservation) Act 1980 / WRD Riverine Rules',
    effectiveDate: '25 Oct 1980',
    status: 'Active',
    coordinates: [8.7139, 77.7567],
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
  }
];
