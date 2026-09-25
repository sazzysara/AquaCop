import { Alert, AlertStatus, RiskLevel } from '../types/index.js';
import { mockAlerts } from '../data/mockData.js';
import { riskScoringService } from './riskScoringService.js';

export interface IAlertService {
  getAllAlerts(filters?: {
    status?: AlertStatus;
    riskLevel?: RiskLevel;
    waterBodyId?: string;
    search?: string;
  }): Promise<Alert[]>;
  getAlertById(id: string): Promise<Alert | undefined>;
  updateAlertStatus(id: string, status: AlertStatus, associatedCaseId?: string): Promise<Alert | undefined>;
  recalculateWithCustomBuffer(bufferRadiusMeters: number): Alert[];
}

export class AlertService implements IAlertService {
  private alerts: Alert[] = [...mockAlerts];

  async getAllAlerts(filters?: {
    status?: AlertStatus;
    riskLevel?: RiskLevel;
    waterBodyId?: string;
    search?: string;
  }): Promise<Alert[]> {
    let result = [...this.alerts];

    if (filters?.status) {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters?.riskLevel) {
      result = result.filter(a => a.riskLevel === filters.riskLevel);
    }
    if (filters?.waterBodyId) {
      result = result.filter(a => a.waterBodyId === filters.waterBodyId);
    }
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        a =>
          a.id.toLowerCase().includes(term) ||
          a.locationName.toLowerCase().includes(term) ||
          a.waterBodyName.toLowerCase().includes(term) ||
          a.changeType.toLowerCase().includes(term)
      );
    }

    return result;
  }

  async getAlertById(id: string): Promise<Alert | undefined> {
    return this.alerts.find(a => a.id === id);
  }

  async updateAlertStatus(
    id: string,
    status: AlertStatus,
    associatedCaseId?: string
  ): Promise<Alert | undefined> {
    const alert = this.alerts.find(a => a.id === id);
    if (!alert) return undefined;

    alert.status = status;
    if (associatedCaseId) {
      alert.associatedCaseId = associatedCaseId;
    }
    return alert;
  }

  recalculateWithCustomBuffer(bufferRadiusMeters: number): Alert[] {
    this.alerts = this.alerts.map(alert => {
      const insideBuffer = alert.distanceToWaterMeters <= bufferRadiusMeters;
      const breakdown = riskScoringService.computeRiskBreakdown({
        distanceToWaterMeters: alert.distanceToWaterMeters,
        bufferRadiusMeters,
        changedAreaSqM: alert.changedAreaSqM,
        changeType: alert.changeType,
        confidence: alert.confidence,
        timelineLength: alert.timeline.length
      });

      return {
        ...alert,
        insideBuffer,
        riskScore: breakdown.totalScore,
        riskLevel: breakdown.riskLevel,
        riskBreakdown: breakdown
      };
    });

    return this.alerts;
  }
}

export const alertService = new AlertService();
