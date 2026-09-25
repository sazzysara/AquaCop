import { InspectionCase, InspectionStatus } from '../types/index.js';
import { mockInspectionCases } from '../data/mockData.js';
import { alertService } from './alertService.js';

export interface IInspectionService {
  getAllCases(statusFilter?: InspectionStatus): Promise<InspectionCase[]>;
  getCaseById(caseId: string): Promise<InspectionCase | undefined>;
  createCase(params: {
    alertId: string;
    assignedInspector: string;
    remarks?: string;
  }): Promise<InspectionCase>;
  updateCase(caseId: string, updates: Partial<InspectionCase>): Promise<InspectionCase | undefined>;
}

export class InspectionService implements IInspectionService {
  private cases: InspectionCase[] = [...mockInspectionCases];

  async getAllCases(statusFilter?: InspectionStatus): Promise<InspectionCase[]> {
    if (statusFilter) {
      return this.cases.filter(c => c.status === statusFilter);
    }
    return this.cases;
  }

  async getCaseById(caseId: string): Promise<InspectionCase | undefined> {
    return this.cases.find(c => c.caseId === caseId);
  }

  async createCase(params: {
    alertId: string;
    assignedInspector: string;
    remarks?: string;
  }): Promise<InspectionCase> {
    const alert = await alertService.getAlertById(params.alertId);
    if (!alert) {
      throw new Error(`Alert with ID ${params.alertId} not found`);
    }

    const nextNumber = this.cases.length + 1;
    const caseId = `CASE-2026-${String(nextNumber).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newCase: InspectionCase = {
      caseId,
      alertId: alert.id,
      locationName: alert.locationName,
      waterBodyName: alert.waterBodyName,
      riskScore: alert.riskScore,
      riskLevel: alert.riskLevel,
      detectionEvidence: {
        changedAreaSqM: alert.changedAreaSqM,
        changeType: alert.changeType,
        confidence: alert.confidence,
        distanceToWaterMeters: alert.distanceToWaterMeters,
        detectionDate: alert.detectionDate,
        beforeImage: alert.beforeImage,
        afterImage: alert.afterImage
      },
      assignedInspector: params.assignedInspector || 'Pending Allocation',
      createdDate: today,
      status: params.assignedInspector ? 'Assigned' : 'Pending Assignment',
      inspectorRemarks: params.remarks || 'Initiated from GIS Alert Dashboard.'
    };

    this.cases.unshift(newCase);

    // Update alert status
    await alertService.updateAlertStatus(alert.id, 'Inspection Assigned', caseId);

    return newCase;
  }

  async updateCase(caseId: string, updates: Partial<InspectionCase>): Promise<InspectionCase | undefined> {
    const item = this.cases.find(c => c.caseId === caseId);
    if (!item) return undefined;

    Object.assign(item, updates);

    // If case is closed or verified, update corresponding alert
    if (updates.status === 'Verified' || updates.status === 'Field Inspection Completed') {
      await alertService.updateAlertStatus(item.alertId, 'Field Verified', item.caseId);
    } else if (updates.status === 'Closed') {
      await alertService.updateAlertStatus(item.alertId, 'Closed', item.caseId);
    }

    return item;
  }
}

export const inspectionService = new InspectionService();
