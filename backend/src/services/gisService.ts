import * as turf from '@turf/turf';
import { WaterBody, GeoJSONGeometry } from '../types/index.js';
import { mockWaterBodies } from '../data/mockData.js';

export interface IGisService {
  getAllWaterBodies(): Promise<WaterBody[]>;
  getWaterBodyById(id: string): Promise<WaterBody | undefined>;
  getBufferPolygon(waterBody: WaterBody, bufferRadiusMeters: number): GeoJSONGeometry;
  calculateDistanceToWater(pointCoords: [number, number], waterBody: WaterBody): number;
}

export class GisService implements IGisService {
  private waterBodies: WaterBody[] = [...mockWaterBodies];

  async getAllWaterBodies(): Promise<WaterBody[]> {
    // In production, this queries PostGIS: SELECT id, name, ST_AsGeoJSON(geom)...
    return this.waterBodies;
  }

  async getWaterBodyById(id: string): Promise<WaterBody | undefined> {
    return this.waterBodies.find(wb => wb.id === id);
  }

  getBufferPolygon(waterBody: WaterBody, bufferRadiusMeters: number): GeoJSONGeometry {
    try {
      const turfPolygon = turf.polygon(waterBody.geometry.coordinates);
      const buffered = turf.buffer(turfPolygon, bufferRadiusMeters / 1000, { units: 'kilometers' });
      if (buffered && buffered.geometry) {
        return {
          type: buffered.geometry.type as any,
          coordinates: buffered.geometry.coordinates
        };
      }
    } catch (err) {
      console.error(`Error computing buffer for ${waterBody.name}:`, err);
    }

    // Fallback: return slightly expanded boundary
    return waterBody.geometry;
  }

  calculateDistanceToWater(pointCoords: [number, number], waterBody: WaterBody): number {
    try {
      const pt = turf.point([pointCoords[1], pointCoords[0]]); // [lng, lat]
      const poly = turf.polygon(waterBody.geometry.coordinates);
      // Distance in kilometers converted to meters
      const distKm = turf.pointToLineDistance(pt, poly as any, { units: 'kilometers' });
      return Math.round(distKm * 1000);
    } catch {
      return 50;
    }
  }
}

export const gisService = new GisService();
