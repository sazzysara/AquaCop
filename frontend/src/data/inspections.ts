import { InspectionCase } from '../types';
import { fallbackAlerts } from './alerts';

export const fallbackInspections: InspectionCase[] = [
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
      beforeImage: fallbackAlerts[1].beforeImage,
      afterImage: fallbackAlerts[1].afterImage
    },
    assignedInspector: 'Er. R. Senthil Kumar (AE, Water Resources Dept)',
    createdDate: '2026-07-23',
    status: 'Assigned',
    inspectorRemarks: 'Urgent spot visit scheduled with Taluk Surveyor and police protection requested.'
  }
];
