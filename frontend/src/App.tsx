import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { MapViewPage } from './pages/MapViewPage';
import { AlertsPage } from './pages/AlertsPage';
import { WaterBodiesPage } from './pages/WaterBodiesPage';
import { ProtectedZonesPage } from './pages/ProtectedZonesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CreateInspectionModal } from './components/inspection/CreateInspectionModal';
import { AlertDetailsDrawer } from './components/detection/AlertDetailsDrawer';
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
  const [bufferDistance, setBufferDistance] = useState<number>(50);
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

        if (wbData && wbData.length > 0) setWaterBodies(wbData);
        if (alertsData && alertsData.length > 0) setAlerts(alertsData);
        if (casesData && casesData.length > 0) setCases(casesData);
        if (analyticsData) setAnalytics(analyticsData);
      } catch (err) {
        console.warn('Backend using seed dataset:', err);
      }
    }
    loadData();
  }, []);

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
    } catch (err) {
      console.error('Error creating case:', err);
    }
  };

  // Select alert from anywhere (e.g. Alerts page)
  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  // Select water body from directory
  const handleSelectWaterBody = (wb: WaterBody) => {
    const alert = alerts.find(a => a.waterBodyId === wb.id) || null;
    setSelectedAlert(alert);
    setCurrentTab('map');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] font-sans antialiased">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeAlertsCount={alerts.length || 8}
        totalWaterBodiesCount={waterBodies.length || 186}
      />

      {/* 2. Main Body Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header & Search Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeAlertsCount={alerts.length || 8}
          selectedDistrict="Coimbatore, Tamil Nadu"
        />

        {/* View Router */}
        <main className="flex-1 flex overflow-hidden relative">
          {currentTab === 'dashboard' && (
            <DashboardPage
              waterBodies={waterBodies}
              alerts={alerts}
              selectedAlert={selectedAlert}
              onSelectAlert={handleSelectAlert}
              onNavigateTab={setCurrentTab}
              bufferDistance={bufferDistance}
            />
          )}

          {currentTab === 'map' && (
            <MapViewPage
              waterBodies={waterBodies}
              alerts={alerts}
              selectedAlert={selectedAlert}
              onSelectAlert={handleSelectAlert}
              onNavigateTab={setCurrentTab}
              bufferDistance={bufferDistance}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onSelectAlert={handleSelectAlert}
              onCreateCase={handleOpenCreateCase}
            />
          )}

          {currentTab === 'waterbodies' && (
            <WaterBodiesPage
              waterBodies={waterBodies}
              alerts={alerts}
              onSelectWaterBody={handleSelectWaterBody}
            />
          )}

          {currentTab === 'protectedzones' && (
            <ProtectedZonesPage
              waterBodies={waterBodies}
              alerts={alerts}
              bufferDistance={bufferDistance}
            />
          )}

          {currentTab === 'reports' && <AnalyticsPage />}

          {currentTab === 'settings' && <AnalyticsPage />}

          {/* Slide-out Inspection Details Drawer */}
          {selectedAlert && (
            <AlertDetailsDrawer
              alert={selectedAlert}
              onClose={() => setSelectedAlert(null)}
              onCreateCase={handleOpenCreateCase}
            />
          )}
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
