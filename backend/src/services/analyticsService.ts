import { AnalyticsSummary, HeatmapPoint } from '../types/index.js';
import { alertService } from './alertService.js';
import { gisService } from './gisService.js';
import { inspectionService } from './inspectionService.js';
import { mockAnalyticsSummary } from '../data/mockData.js';

export class AnalyticsService {
  async getSummary(): Promise<AnalyticsSummary> {
    const alerts = await alertService.getAllAlerts();
    const waterBodies = await gisService.getAllWaterBodies();
    const cases = await inspectionService.getAllCases();

    const highRiskLocations = alerts.filter(a => a.riskLevel === 'HIGH').length;
    const veryHighRiskLocations = alerts.filter(a => a.riskLevel === 'VERY HIGH').length;
    const detectedConstructionChanges = alerts.filter(a => a.changeType === 'New Construction').length;
    const detectedLandFilling = alerts.filter(a => a.changeType === 'Land Filling').length;
    const pendingInspections = cases.filter(c => c.status === 'Pending Assignment' || c.status === 'Assigned').length;
    const verifiedCases = cases.filter(c => c.status === 'Verified' || c.status === 'Field Inspection Completed').length;

    // Recalculate water body counts
    const wbMap = new Map<string, { count: number; high: number }>();
    alerts.forEach(a => {
      const entry = wbMap.get(a.waterBodyName) || { count: 0, high: 0 };
      entry.count += 1;
      if (a.riskLevel === 'HIGH' || a.riskLevel === 'VERY HIGH') {
        entry.high += 1;
      }
      wbMap.set(a.waterBodyName, entry);
    });

    const waterBodyAlerts = Array.from(wbMap.entries()).map(([name, data]) => ({
      name,
      alerts: data.count,
      highRisk: data.high
    }));

    return {
      ...mockAnalyticsSummary,
      totalMonitoredWaterBodies: waterBodies.length,
      activeAlerts: alerts.length,
      highRiskLocations,
      veryHighRiskLocations,
      detectedConstructionChanges,
      detectedLandFilling,
      pendingInspections,
      verifiedCases,
      waterBodyAlerts: waterBodyAlerts.length > 0 ? waterBodyAlerts : mockAnalyticsSummary.waterBodyAlerts
    };
  }

  async getHeatmapPoints(): Promise<HeatmapPoint[]> {
    const alerts = await alertService.getAllAlerts();
    const waterBodies = await gisService.getAllWaterBodies();

    return alerts.map(alert => {
      const wb = waterBodies.find(w => w.id === alert.waterBodyId);
      return {
        id: alert.id,
        lat: alert.coordinates[0],
        lng: alert.coordinates[1],
        weight: alert.riskScore / 100,
        riskScore: alert.riskScore,
        riskLevel: alert.riskLevel,
        waterBodyType: wb ? wb.type : 'Lake',
        changeType: alert.changeType,
        locationName: alert.locationName
      };
    });
  }
}

export const analyticsService = new AnalyticsService();
