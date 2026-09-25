import { RiskBreakdown, RiskLevel, ChangeType } from '../types/index.js';

export interface IRiskScoringService {
  computeRiskBreakdown(params: {
    distanceToWaterMeters: number;
    bufferRadiusMeters: number;
    changedAreaSqM: number;
    changeType: ChangeType;
    confidence: number;
    timelineLength: number;
  }): RiskBreakdown;
}

export class RiskScoringService implements IRiskScoringService {
  computeRiskBreakdown(params: {
    distanceToWaterMeters: number;
    bufferRadiusMeters: number;
    changedAreaSqM: number;
    changeType: ChangeType;
    confidence: number;
    timelineLength: number;
  }): RiskBreakdown {
    const {
      distanceToWaterMeters,
      bufferRadiusMeters,
      changedAreaSqM,
      confidence,
      timelineLength
    } = params;

    // 1. Water Proximity Score (Max 20)
    // Closer to water edge = higher score
    let waterProximityScore = 0;
    if (distanceToWaterMeters <= 20) {
      waterProximityScore = 20;
    } else if (distanceToWaterMeters <= 50) {
      waterProximityScore = 17;
    } else if (distanceToWaterMeters <= 100) {
      waterProximityScore = 13;
    } else if (distanceToWaterMeters <= 200) {
      waterProximityScore = 8;
    } else {
      waterProximityScore = 3;
    }

    // 2. Buffer Overlap Score (Max 20)
    // Penetration depth into regulatory buffer
    let bufferOverlapScore = 0;
    if (distanceToWaterMeters < bufferRadiusMeters * 0.25) {
      bufferOverlapScore = 20; // Core buffer encroachment
    } else if (distanceToWaterMeters < bufferRadiusMeters * 0.5) {
      bufferOverlapScore = 18;
    } else if (distanceToWaterMeters <= bufferRadiusMeters) {
      bufferOverlapScore = 14;
    } else if (distanceToWaterMeters <= bufferRadiusMeters * 1.5) {
      bufferOverlapScore = 7;
    } else {
      bufferOverlapScore = 2;
    }

    // 3. Recent Change / Footprint Area Score (Max 20)
    let recentChangeScore = 0;
    if (changedAreaSqM >= 500) {
      recentChangeScore = 20;
    } else if (changedAreaSqM >= 350) {
      recentChangeScore = 18;
    } else if (changedAreaSqM >= 200) {
      recentChangeScore = 15;
    } else if (changedAreaSqM >= 100) {
      recentChangeScore = 11;
    } else {
      recentChangeScore = 6;
    }

    // 4. Construction Growth / Temporal Progression Score (Max 20)
    // Persistent progression over multiple observations
    let constructionGrowthScore = 0;
    if (timelineLength >= 4) {
      constructionGrowthScore = 18;
    } else if (timelineLength === 3) {
      constructionGrowthScore = 15;
    } else if (timelineLength === 2) {
      constructionGrowthScore = 11;
    } else {
      constructionGrowthScore = 6;
    }

    // 5. Detection Confidence Score (Max 20)
    // Scaled from AI model confidence (0 - 100) -> 0 - 20
    const confidenceScore = Math.min(20, Math.max(0, Math.round((confidence / 100) * 20)));

    // Total Normalized Score (0 - 100)
    const totalScore = Math.min(
      100,
      Math.max(
        0,
        waterProximityScore +
          bufferOverlapScore +
          recentChangeScore +
          constructionGrowthScore +
          confidenceScore
      )
    );

    // Classification (Inspection Priority Level)
    let riskLevel: RiskLevel;
    if (totalScore >= 76) {
      riskLevel = 'VERY HIGH';
    } else if (totalScore >= 51) {
      riskLevel = 'HIGH';
    } else if (totalScore >= 26) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }

    const explanation = `Score evaluated across 5 key parameters: Water proximity (${waterProximityScore}/20), buffer penetration (${bufferOverlapScore}/20), detected area (${recentChangeScore}/20), temporal progression (${constructionGrowthScore}/20), and satellite confidence (${confidenceScore}/20). Recommendation: ${
      riskLevel === 'VERY HIGH'
        ? 'Immediate expedited physical field verification.'
        : riskLevel === 'HIGH'
        ? 'Priority field inspection within 7 days.'
        : riskLevel === 'MEDIUM'
        ? 'Routine scheduled monitoring.'
        : 'Low priority observation.'
    }`;

    return {
      totalScore,
      riskLevel,
      waterProximityScore,
      bufferOverlapScore,
      recentChangeScore,
      constructionGrowthScore,
      confidenceScore,
      explanation
    };
  }
}

export const riskScoringService = new RiskScoringService();
