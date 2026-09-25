import {
  WaterBody,
  Alert,
  DetectedChange,
  InspectionCase,
  AnalyticsSummary,
  HeatmapPoint
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`Fetch error for ${url}, attempting request:`, err);
    throw err;
  }
}

export const api = {
  // Water Bodies
  async getWaterBodies(): Promise<WaterBody[]> {
    return fetchJson<WaterBody[]>('/water-bodies');
  },

  async getWaterBodyById(id: string): Promise<WaterBody> {
    return fetchJson<WaterBody>(`/water-bodies/${id}`);
  },

  // Alerts
  async getAlerts(filters?: {
    status?: string;
    riskLevel?: string;
    waterBodyId?: string;
    search?: string;
  }): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters?.waterBodyId) params.append('waterBodyId', filters.waterBodyId);
    if (filters?.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<Alert[]>(`/alerts${query}`);
  },

  async getAlertById(id: string): Promise<Alert> {
    return fetchJson<Alert>(`/alerts/${id}`);
  },

  // Changes
  async getChanges(): Promise<DetectedChange[]> {
    return fetchJson<DetectedChange[]>('/changes');
  },

  async getChangeById(id: string): Promise<DetectedChange> {
    return fetchJson<DetectedChange>(`/changes/${id}`);
  },

  // Inspections
  async getInspections(status?: string): Promise<InspectionCase[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return fetchJson<InspectionCase[]>(`/inspections${query}`);
  },

  async createInspection(data: {
    alertId: string;
    assignedInspector: string;
    remarks?: string;
  }): Promise<InspectionCase> {
    return fetchJson<InspectionCase>('/inspections', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateInspection(id: string, updates: Partial<InspectionCase>): Promise<InspectionCase> {
    return fetchJson<InspectionCase>(`/inspections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    return fetchJson<AnalyticsSummary>('/analytics');
  },

  // Heatmap
  async getHeatmapPoints(): Promise<HeatmapPoint[]> {
    return fetchJson<HeatmapPoint[]>('/heatmap');
  },

  // Buffer Adjustment
  async setBufferDistance(bufferDistanceMeters: number): Promise<{ alerts: Alert[] }> {
    return fetchJson<{ alerts: Alert[] }>('/settings/buffer', {
      method: 'POST',
      body: JSON.stringify({ bufferDistanceMeters })
    });
  }
};
