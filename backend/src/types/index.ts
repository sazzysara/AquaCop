export type WaterBodyType = 'Lake' | 'River' | 'Reservoir' | 'Wetland' | 'Coastal Zone';

export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon' | 'Point';
  coordinates: any;
}

export interface WaterBody {
  id: string;
  name: string;
  type: WaterBodyType;
  district: string;
  state: string;
  area: string;
  areaSqKm: number;
  geometry: GeoJSONGeometry;
  source: string;
  sourceDate: string;
  bufferRadiusMeters: number;
  activeAlertsCount: number;
  center: [number, number]; // [lat, lng]
}

export type ChangeType =
  | 'New Construction'
  | 'Land Filling'
  | 'Road/Surface Change'
  | 'Vegetation Change'
  | 'Water Level Change'
  | 'Unknown Change';

export interface ObservationProgress {
  observationId: string;
  date: string;
  label: string;
  description: string;
  changeAreaSqM: number;
  imageUrl: string;
  stageBadge: string;
}

export interface DetectedChange {
  id: string;
  waterBodyId: string;
  waterBodyName: string;
  locationName: string;
  center: [number, number]; // [lat, lng]
  geometry: GeoJSONGeometry;
  beforeDate: string;
  afterDate: string;
  beforeImage: string;
  afterImage: string;
  changedAreaSqM: number;
  changePercentage: number;
  changeType: ChangeType;
  confidence: number; // 0 - 100
  distanceToWaterMeters: number;
  insideBuffer: boolean;
  bufferOverlapPercentage: number;
  timeline: ObservationProgress[];
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';

export interface RiskBreakdown {
  totalScore: number; // 0 - 100
  riskLevel: RiskLevel;
  waterProximityScore: number; // max 20
  bufferOverlapScore: number; // max 20
  recentChangeScore: number; // max 20
  constructionGrowthScore: number; // max 20
  confidenceScore: number; // max 20
  explanation: string;
}

export type AlertStatus = 'New' | 'Under Review' | 'Inspection Assigned' | 'Field Verified' | 'Closed';

export interface Alert {
  id: string; // e.g. "ALT-2026-081"
  changeId: string;
  locationName: string;
  waterBodyId: string;
  waterBodyName: string;
  district: string;
  changeType: ChangeType;
  changedAreaSqM: number;
  distanceToWaterMeters: number;
  insideBuffer: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  riskBreakdown: RiskBreakdown;
  detectionDate: string;
  previousObservationDate: string;
  status: AlertStatus;
  confidence: number;
  associatedCaseId?: string;
  coordinates: [number, number]; // [lat, lng]
  geometry: GeoJSONGeometry;
  timeline: ObservationProgress[];
  beforeImage: string;
  afterImage: string;
}

export type InspectionStatus =
  | 'Pending Assignment'
  | 'Assigned'
  | 'Field Inspection Completed'
  | 'Verified'
  | 'False Positive'
  | 'Action Required'
  | 'Closed';

export interface InspectionCase {
  caseId: string;
  alertId: string;
  locationName: string;
  waterBodyName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  detectionEvidence: {
    changedAreaSqM: number;
    changeType: ChangeType;
    confidence: number;
    distanceToWaterMeters: number;
    detectionDate: string;
    beforeImage: string;
    afterImage: string;
  };
  assignedInspector: string;
  createdDate: string;
  status: InspectionStatus;
  inspectorRemarks?: string;
  fieldVerificationResult?: {
    verifiedBy: string;
    inspectionDate: string;
    finding: string;
    actionTaken: string;
    fieldPhotoUrl?: string;
  };
}

export interface HeatmapPoint {
  id: string;
  lat: number;
  lng: number;
  weight: number; // 0 to 1 normalized risk
  riskScore: number;
  riskLevel: RiskLevel;
  waterBodyType: WaterBodyType;
  changeType: ChangeType;
  locationName: string;
}

export interface AnalyticsSummary {
  totalMonitoredWaterBodies: number;
  activeAlerts: number;
  highRiskLocations: number;
  veryHighRiskLocations: number;
  detectedConstructionChanges: number;
  detectedLandFilling: number;
  pendingInspections: number;
  verifiedCases: number;
  alertsOverTime: { month: string; alerts: number; highRisk: number }[];
  changeTypeDistribution: { type: string; count: number; percentage: number }[];
  riskDistribution: { level: string; count: number; color: string }[];
  waterBodyAlerts: { name: string; alerts: number; highRisk: number }[];
  constructionProgressionSummary: { stage: string; avgArea: number }[];
}
