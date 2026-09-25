import { Router, Request, Response } from 'express';
import { gisService } from '../services/gisService.js';
import { alertService } from '../services/alertService.js';
import { inspectionService } from '../services/inspectionService.js';
import { analyticsService } from '../services/analyticsService.js';
import { mockDetectedChanges } from '../data/mockData.js';

export const router = Router();

// Health Check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'AquaCop - Smart Encroachment Detection API',
    region: 'Tamil Nadu WRD / Wetland Authority',
    timestamp: new Date().toISOString()
  });
});

// Water Bodies
router.get('/water-bodies', async (_req: Request, res: Response) => {
  try {
    const data = await gisService.getAllWaterBodies();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/water-bodies/:id', async (req: Request, res: Response) => {
  try {
    const data = await gisService.getWaterBodyById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Water body not found' });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Alerts
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const { status, riskLevel, waterBodyId, search } = req.query;
    const data = await alertService.getAllAlerts({
      status: status as any,
      riskLevel: riskLevel as any,
      waterBodyId: waterBodyId as string,
      search: search as string
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/alerts/:id', async (req: Request, res: Response) => {
  try {
    const data = await alertService.getAlertById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Alert not found' });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Changes / Observations
router.get('/changes', (_req: Request, res: Response) => {
  res.json(mockDetectedChanges);
});

router.get('/changes/:id', (req: Request, res: Response) => {
  const item = mockDetectedChanges.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Detected change not found' });
  res.json(item);
});

// Inspections
router.get('/inspections', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const data = await inspectionService.getAllCases(status as any);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/inspections', async (req: Request, res: Response) => {
  try {
    const { alertId, assignedInspector, remarks } = req.body;
    if (!alertId) {
      return res.status(400).json({ error: 'alertId is required to initiate an inspection case' });
    }
    const newCase = await inspectionService.createCase({
      alertId,
      assignedInspector,
      remarks
    });
    res.status(201).json(newCase);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/inspections/:id', async (req: Request, res: Response) => {
  try {
    const updated = await inspectionService.updateCase(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Inspection case not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics
router.get('/analytics', async (_req: Request, res: Response) => {
  try {
    const data = await analyticsService.getSummary();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Heatmap Points
router.get('/heatmap', async (_req: Request, res: Response) => {
  try {
    const data = await analyticsService.getHeatmapPoints();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Buffer Setting Recalculation
router.post('/settings/buffer', (req: Request, res: Response) => {
  try {
    const { bufferDistanceMeters } = req.body;
    const radius = Number(bufferDistanceMeters) || 100;
    const recalculated = alertService.recalculateWithCustomBuffer(radius);
    res.json({
      message: `Buffer updated to ${radius}m and alerts recalculated`,
      bufferDistanceMeters: radius,
      alerts: recalculated
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
