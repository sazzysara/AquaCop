import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { HeatMapPage } from './pages/HeatMapPage';
import { WaterBodiesPage } from './pages/WaterBodiesPage';
import { InspectionCasesPage } from './pages/InspectionCasesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { CreateInspectionModal } from './components/inspection/CreateInspectionModal';
import { api } from './services/api';
import { WaterBody, Alert, InspectionCase, AnalyticsSummary, InspectionStatus } from './types';
import { fallbackWaterBodies } from './data/waterBodies';
import { fallbackAlerts } from './data/alerts';
import { fallbackInspections } from './data/inspections';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>(fallbackWaterBodies);
  const [alerts, setAlerts] = useState<Alert[]>(fallbackAlerts);
  const [cases, setCases] = useState<InspectionCase[]>(fallbackInspections);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [bufferDistance, setBufferDistance] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Case Creation
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [caseTargetAlert, setCaseTargetAlert] = useState<Alert | null>(null);

  // Initial Data Fetch from Backend
  useEffect(() => {
    async function loadData() {
      try {
        const [wbData, alertsData, casesData, analyticsData] = await Promise.all([
          api.getWaterBodies().catch(() => fallbackWaterBodies),
          api.getAlerts().catch(() => fallbackAlerts),
          api.getInspections().catch(() => fallbackInspections),
          api.getAnalytics().catch(() => null)
        ]);

        setWaterBodies(wbData);
        setAlerts(alertsData);
        setCases(casesData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.warn('Backend not yet ready, using loaded seed data:', err);
      }
    }
    loadData();
  }, []);

  // Handle Buffer Distance Change (Calls Backend and updates state)
  const handleBufferChange = async (distance: number) => {
    setBufferDistance(distance);
    try {
      const res = await api.setBufferDistance(distance);
      if (res && res.alerts) {
        setAlerts(res.alerts);
        // Refresh selected alert if open
        if (selectedAlert) {
          const updated = res.alerts.find(a => a.id === selectedAlert.id);
          if (updated) setSelectedAlert(updated);
        }
      }
    } catch {
      // Local recalculation fallback
      setAlerts(prev =>
        prev.map(a => ({
          ...a,
          insideBuffer: a.distanceToWaterMeters <= distance
        }))
      );
    }
  };

  // Open Create Case Modal
  const handleOpenCreateCase = (alert: Alert) => {
    setCaseTargetAlert(alert);
    setIsCaseModalOpen(true);
  };

  // Submit New Inspection Case
  const handleCreateCaseSubmit = async (params: {
    alertId: string;
    assignedInspector: string;
    remarks: string;
  }) => {
    try {
      const newCase = await api.createInspection(params);
      setCases(prev => [newCase, ...prev]);

      // Update alert in list
      setAlerts(prev =>
        prev.map(a =>
          a.id === params.alertId
            ? { ...a, status: 'Inspection Assigned', associatedCaseId: newCase.caseId }
            : a
        )
      );

      if (selectedAlert && selectedAlert.id === params.alertId) {
        setSelectedAlert(prev =>
          prev
            ? { ...prev, status: 'Inspection Assigned', associatedCaseId: newCase.caseId }
            : null
        );
      }

      // Refresh analytics
      api.getAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      console.error('Error creating case:', err);
    }
  };

  // Update Case Status
  const handleUpdateCaseStatus = async (
    caseId: string,
    status: InspectionStatus,
    remarks?: string
  ) => {
    try {
      const updated = await api.updateInspection(caseId, { status, inspectorRemarks: remarks });
      setCases(prev => prev.map(c => (c.caseId === caseId ? updated : c)));

      // Sync alerts
      const updatedAlerts = await api.getAlerts().catch(() => alerts);
      setAlerts(updatedAlerts);

      // Refresh analytics
      api.getAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      console.error('Error updating case status:', err);
    }
  };

  // Navigate to water body on map
  const handleSelectWaterBodyFromDirectory = (wb: WaterBody) => {
    const alert = alerts.find(a => a.waterBodyId === wb.id) || null;
    setSelectedAlert(alert);
    setCurrentTab('map');
  };

  // Select alert from anywhere (e.g. Alerts page or Inspection page)
  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setCurrentTab('dashboard');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeAlertsCount={alerts.length}
        pendingInspectionsCount={cases.filter(c => c.status !== 'Closed').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header & Search Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          bufferDistance={bufferDistance}
          onBufferChange={handleBufferChange}
          activeAlertsCount={alerts.filter(a => a.riskLevel === 'VERY HIGH').length}
        />

        {/* View Router */}
        <main className="flex-1 flex overflow-hidden">
          {currentTab === 'dashboard' && (
            <DashboardPage
              waterBodies={waterBodies}
              alerts={alerts}
              selectedAlert={selectedAlert}
              onSelectAlert={setSelectedAlert}
              onCloseDrawer={() => setSelectedAlert(null)}
              onCreateCase={handleOpenCreateCase}
              bufferDistance={bufferDistance}
              analytics={analytics}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'map' && (
            <DashboardPage
              waterBodies={waterBodies}
              alerts={alerts}
              selectedAlert={selectedAlert}
              onSelectAlert={setSelectedAlert}
              onCloseDrawer={() => setSelectedAlert(null)}
              onCreateCase={handleOpenCreateCase}
              bufferDistance={bufferDistance}
              analytics={analytics}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onSelectAlert={handleSelectAlert}
              onCreateCase={handleOpenCreateCase}
            />
          )}

          {currentTab === 'heatmap' && (
            <HeatMapPage
              waterBodies={waterBodies}
              alerts={alerts}
              onSelectAlert={handleSelectAlert}
              bufferDistance={bufferDistance}
            />
          )}

          {currentTab === 'waterbodies' && (
            <WaterBodiesPage
              waterBodies={waterBodies}
              alerts={alerts}
              onSelectWaterBody={handleSelectWaterBodyFromDirectory}
            />
          )}

          {currentTab === 'inspections' && (
            <InspectionCasesPage
              cases={cases}
              onUpdateCaseStatus={handleUpdateCaseStatus}
              onInspectAlert={id => {
                const a = alerts.find(x => x.id === id);
                if (a) handleSelectAlert(a);
              }}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsPage analytics={analytics} />}

          {currentTab === 'architecture' && <ArchitecturePage />}
        </main>
      </div>

      {/* Case Creation Modal */}
      {isCaseModalOpen && caseTargetAlert && (
        <CreateInspectionModal
          alert={caseTargetAlert}
          isOpen={isCaseModalOpen}
          onClose={() => setIsCaseModalOpen(false)}
          onSubmit={handleCreateCaseSubmit}
        />
      )}
    </div>
  );
}

export default App;
