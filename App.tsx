import { useState, useCallback, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardView from '@/views/DashboardView';
import UploadView from '@/views/UploadView';
import AnalyticsView from '@/views/AnalyticsView';
import CustomersView from '@/views/CustomersView';
import SettingsView from '@/views/SettingsView';
import NotificationsView from '@/views/NotificationsView';
import HelpView from '@/views/HelpView';
import { sampleCustomers } from '@/data/sampleCustomers';
import { processCsvData, generateSummaryFromCount } from '@/utils/dataProcessing';
import type { CleanedDataSummary, CustomerRecord, ParsedCsvResult } from '@/types';

type NavId = 'dashboard' | 'upload' | 'analytics' | 'customers' | 'settings' | 'notifications' | 'help';

function App() {
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');
  const [customers, setCustomers] = useState<CustomerRecord[]>(sampleCustomers);
  const [summary, setSummary] = useState<CleanedDataSummary>(() =>
    generateSummaryFromCount(sampleCustomers.length)
  );

  const handleFileProcessed = useCallback(
    (result: ParsedCsvResult, _fileName: string, _fileSize: number) => {
      const processed = processCsvData(result);
      setCustomers(processed.customers);
      setSummary(processed.summary);
    },
    []
  );

  const navConfig = useMemo<Record<NavId, { title: string; subtitle: string }>>(() => ({
    dashboard: { title: 'Analytics Dashboard', subtitle: 'Real-time churn risk monitoring & data insights' },
    upload: { title: 'Data Upload', subtitle: 'Import and auto-clean your customer datasets' },
    analytics: { title: 'Deep Analytics', subtitle: 'Trend analysis and predictive insights' },
    customers: { title: 'Customer Directory', subtitle: 'Full customer roster with risk profiles' },
    settings: { title: 'Settings', subtitle: 'Configure your workspace preferences' },
    notifications: { title: 'Alerts & Notifications', subtitle: 'Churn risk alerts and system updates' },
    help: { title: 'Help Center', subtitle: 'Guides, documentation, and support' },
  }), []);

  const currentNav = navConfig[activeNav] ?? navConfig.dashboard;

  const renderView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView customers={customers} summary={summary} />;
      case 'upload':
        return <UploadView summary={summary} onFileProcessed={handleFileProcessed} />;
      case 'analytics':
        return <AnalyticsView customers={customers} />;
      case 'customers':
        return <CustomersView customers={customers} />;
      case 'settings':
        return <SettingsView />;
      case 'notifications':
        return <NotificationsView customers={customers} />;
      case 'help':
        return <HelpView />;
      default:
        return <DashboardView customers={customers} summary={summary} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      <Sidebar activeItem={activeNav} onItemClick={(item) => setActiveNav(item as NavId)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar pageTitle={currentNav.title} pageSubtitle={currentNav.subtitle} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {renderView()}
            <footer className="pt-8 pb-2 text-center">
              <p className="text-[11px] text-ink-500">
                AuraPredict.AI · Predictive churn analytics powered by machine learning
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
