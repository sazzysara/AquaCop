import { Alert } from '../types';

export const fallbackAlerts: Alert[] = [
  {
    id: 'C-1042',
    changeId: 'CHG-1042',
    locationName: 'Vellalore Lake, Coimbatore',
    waterBodyId: 'WB-001',
    waterBodyName: 'Vellalore Lake',
    district: 'Coimbatore',
    changeType: 'New Construction',
    changedAreaSqM: 4200,
    distanceToWaterMeters: 38,
    insideBuffer: true,
    riskScore: 92,
    riskLevel: 'HIGH',
    confidence: 0.87,
    detectionDate: '28 Apr 2025',
    previousObservationDate: '15 Jan 2025',
    status: 'New',
    coordinates: [11.0281, 77.0086],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [77.008, 11.029],
          [77.012, 11.029],
          [77.012, 11.026],
          [77.008, 11.026],
          [77.008, 11.029]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 92,
      riskLevel: 'HIGH',
      waterProximityScore: 19,
      bufferOverlapScore: 20,
      recentChangeScore: 18,
      constructionGrowthScore: 18,
      confidenceScore: 17,
      explanation: 'Rapid structural foundation observed within 38m of Vellalore Lake regulatory boundary. High expansion velocity across 4 consecutive observation passes.'
    },
    timeline: [
      {
        observationId: 'OBS-1',
        date: '15 Jan 2025',
        label: 'T1: Baseline Observation',
        description: 'Vegetated buffer area intact. No structural footprint detected.',
        changeAreaSqM: 0,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
        stageBadge: 'Baseline (0 m²)'
      },
      {
        observationId: 'OBS-2',
        date: '12 Feb 2025',
        label: 'T2: Earth Clearing',
        description: 'Initial vegetation removal and land leveling observed.',
        changeAreaSqM: 850,
        imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
        stageBadge: 'Site Prep (850 m²)'
      },
      {
        observationId: 'OBS-3',
        date: '18 Mar 2025',
        label: 'T3: Foundation Layout',
        description: 'Concrete trenching and structural foundation pillars visible.',
        changeAreaSqM: 2100,
        imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
        stageBadge: 'Foundation (2,100 m²)'
      },
      {
        observationId: 'OBS-4',
        date: '28 Apr 2025',
        label: 'T4: Superstructure Confirmed',
        description: 'Full permanent building structure established inside 50m buffer.',
        changeAreaSqM: 4200,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
        stageBadge: 'Superstructure (4,200 m²)'
      }
    ]
  },
  {
    id: 'C-1039',
    changeId: 'CHG-1039',
    locationName: 'Pallikaranai Marsh, Chennai',
    waterBodyId: 'WB-003',
    waterBodyName: 'Pallikaranai Marshland',
    district: 'Chennai',
    changeType: 'Land Filling',
    changedAreaSqM: 3200,
    distanceToWaterMeters: 45,
    insideBuffer: true,
    riskScore: 78,
    riskLevel: 'HIGH',
    confidence: 0.78,
    detectionDate: '25 Apr 2025',
    previousObservationDate: '10 Feb 2025',
    status: 'Under Review',
    coordinates: [12.9362, 80.2185],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.218, 12.938],
          [80.222, 12.938],
          [80.222, 12.934],
          [80.218, 12.934],
          [80.218, 12.938]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 78,
      riskLevel: 'HIGH',
      waterProximityScore: 17,
      bufferOverlapScore: 19,
      recentChangeScore: 15,
      constructionGrowthScore: 14,
      confidenceScore: 13,
      explanation: 'Heavy soil dumping and wetland bed elevation detected inside protected ecological buffer zone.'
    },
    timeline: []
  },
  {
    id: 'C-1037',
    changeId: 'CHG-1037',
    locationName: 'Kadalur Coastline, Kadalur',
    waterBodyId: 'WB-004',
    waterBodyName: 'Bay of Bengal Coastline',
    district: 'Kadalur / Cuddalore',
    changeType: 'New Construction',
    changedAreaSqM: 1800,
    distanceToWaterMeters: 62,
    insideBuffer: true,
    riskScore: 61,
    riskLevel: 'MEDIUM',
    confidence: 0.68,
    detectionDate: '23 Apr 2025',
    previousObservationDate: '15 Feb 2025',
    status: 'New',
    coordinates: [11.7480, 79.7714],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [79.771, 11.750],
          [79.775, 11.750],
          [79.775, 11.746],
          [79.771, 11.746],
          [79.771, 11.750]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 61,
      riskLevel: 'MEDIUM',
      waterProximityScore: 14,
      bufferOverlapScore: 15,
      recentChangeScore: 12,
      constructionGrowthScore: 10,
      confidenceScore: 10,
      explanation: 'Coastal infrastructure expansion within 100m intertidal CRZ regulation boundary.'
    },
    timeline: []
  },
  {
    id: 'C-1035',
    changeId: 'CHG-1035',
    locationName: 'Ukkadam Lake, Coimbatore',
    waterBodyId: 'WB-002',
    waterBodyName: 'Ukkadam Lake',
    district: 'Coimbatore',
    changeType: 'Road/Surface Change',
    changedAreaSqM: 2400,
    distanceToWaterMeters: 55,
    insideBuffer: true,
    riskScore: 67,
    riskLevel: 'MEDIUM',
    confidence: 0.71,
    detectionDate: '20 Apr 2025',
    previousObservationDate: '20 Jan 2025',
    status: 'New',
    coordinates: [10.9912, 76.9601],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.960, 10.993],
          [76.964, 10.993],
          [76.964, 10.989],
          [76.960, 10.989],
          [76.960, 10.993]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 67,
      riskLevel: 'MEDIUM',
      waterProximityScore: 15,
      bufferOverlapScore: 16,
      recentChangeScore: 13,
      constructionGrowthScore: 11,
      confidenceScore: 12,
      explanation: 'Commercial building expansion encroaching toward Ukkadam lake bund perimeter.'
    },
    timeline: []
  },
  {
    id: 'C-1032',
    changeId: 'CHG-1032',
    locationName: 'Mahabalipuram Coast, Chengalpattu',
    waterBodyId: 'WB-006',
    waterBodyName: 'Kovalam Estuary & Coast',
    district: 'Chengalpattu',
    changeType: 'New Construction',
    changedAreaSqM: 950,
    distanceToWaterMeters: 140,
    insideBuffer: false,
    riskScore: 33,
    riskLevel: 'LOW',
    confidence: 0.58,
    detectionDate: '15 Apr 2025',
    previousObservationDate: '01 Feb 2025',
    status: 'Closed',
    coordinates: [12.7885, 80.2514],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.251, 12.790],
          [80.254, 12.790],
          [80.254, 12.786],
          [80.251, 12.786],
          [80.251, 12.790]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 33,
      riskLevel: 'LOW',
      waterProximityScore: 8,
      bufferOverlapScore: 5,
      recentChangeScore: 7,
      constructionGrowthScore: 6,
      confidenceScore: 7,
      explanation: 'Minor temporary beach shack structure outside critical 100m intertidal protection line.'
    },
    timeline: []
  },
  {
    id: 'C-1028',
    changeId: 'CHG-1028',
    locationName: 'Puzhal Lake, Chennai',
    waterBodyId: 'WB-005',
    waterBodyName: 'Puzhal Lake (Red Hills)',
    district: 'Chennai',
    changeType: 'New Construction',
    changedAreaSqM: 3800,
    distanceToWaterMeters: 42,
    insideBuffer: true,
    riskScore: 74,
    riskLevel: 'HIGH',
    confidence: 0.81,
    detectionDate: '10 Apr 2025',
    previousObservationDate: '15 Jan 2025',
    status: 'Inspection Assigned',
    coordinates: [13.1906, 80.1764],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.176, 13.192],
          [80.180, 13.192],
          [80.180, 13.188],
          [80.176, 13.188],
          [80.176, 13.192]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 74,
      riskLevel: 'HIGH',
      waterProximityScore: 16,
      bufferOverlapScore: 18,
      recentChangeScore: 14,
      constructionGrowthScore: 13,
      confidenceScore: 13,
      explanation: 'Warehouse foundation erected inside drinking water reservoir catchment buffer.'
    },
    timeline: []
  },
  {
    id: 'C-1025',
    changeId: 'CHG-1025',
    locationName: 'Kovalam Coast, Chennai',
    waterBodyId: 'WB-006',
    waterBodyName: 'Kovalam Estuary & Coast',
    district: 'Chengalpattu',
    changeType: 'New Construction',
    changedAreaSqM: 4600,
    distanceToWaterMeters: 30,
    insideBuffer: true,
    riskScore: 88,
    riskLevel: 'HIGH',
    confidence: 0.85,
    detectionDate: '05 Apr 2025',
    previousObservationDate: '05 Jan 2025',
    status: 'Field Verified',
    coordinates: [12.7885, 80.2514],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [80.251, 12.791],
          [80.256, 12.791],
          [80.256, 12.786],
          [80.251, 12.786],
          [80.251, 12.791]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 88,
      riskLevel: 'HIGH',
      waterProximityScore: 18,
      bufferOverlapScore: 19,
      recentChangeScore: 17,
      constructionGrowthScore: 18,
      confidenceScore: 16,
      explanation: 'Resort foundation poured directly into CRZ-I intertidal estuary mangrove zone.'
    },
    timeline: []
  },
  {
    id: 'C-1020',
    changeId: 'CHG-1020',
    locationName: 'Thamirabarani River, Tirunelveli',
    waterBodyId: 'WB-007',
    waterBodyName: 'Thamirabarani River Corridor',
    district: 'Tirunelveli',
    changeType: 'Land Filling',
    changedAreaSqM: 1900,
    distanceToWaterMeters: 75,
    insideBuffer: true,
    riskScore: 52,
    riskLevel: 'MEDIUM',
    confidence: 0.65,
    detectionDate: '28 Mar 2025',
    previousObservationDate: '10 Jan 2025',
    status: 'Closed',
    coordinates: [8.7139, 77.7567],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [77.756, 8.716],
          [77.760, 8.716],
          [77.760, 8.711],
          [77.756, 8.711],
          [77.756, 8.716]
        ]
      ]
    },
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    riskBreakdown: {
      totalScore: 52,
      riskLevel: 'MEDIUM',
      waterProximityScore: 12,
      bufferOverlapScore: 13,
      recentChangeScore: 10,
      constructionGrowthScore: 9,
      confidenceScore: 8,
      explanation: 'Riparian buffer soil excavation cleared and resolved by district revenue inspector.'
    },
    timeline: []
  }
];
