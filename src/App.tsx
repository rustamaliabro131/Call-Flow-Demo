import React from 'react';
import { CallFlowProvider, useCallFlow } from './context/CallFlowContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { OverviewView } from './components/dashboard/OverviewView';
import { CallIntelligenceView } from './components/intelligence/CallIntelligenceView';
import { CallReviewsView } from './components/intelligence/CallReviewsView';
import { ImportCenterView } from './components/import/ImportCenterView';
import { FollowUpTasksView } from './components/tasks/FollowUpTasksView';
import { LeadsContactsView } from './components/leads/LeadsContactsView';
import { AutomationWorkflowsView } from './components/workflows/AutomationWorkflowsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { ReportsView } from './components/reports/ReportsView';
import { TeamManagementView } from './components/team/TeamManagementView';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { HelpWalkthroughModal } from './components/common/HelpWalkthroughModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useCallFlow();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'intelligence':
        return <CallIntelligenceView />;
      case 'reviews':
        return <CallReviewsView />;
      case 'import':
        return <ImportCenterView />;
      case 'tasks':
        return <FollowUpTasksView />;
      case 'leads':
        return <LeadsContactsView />;
      case 'workflows':
        return <AutomationWorkflowsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'reports':
        return <ReportsView />;
      case 'team':
        return <TeamManagementView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <GlobalSearchModal />
      <HelpWalkthroughModal />
    </div>
  );
};

export default function App() {
  return (
    <CallFlowProvider>
      <MainLayout />
    </CallFlowProvider>
  );
}
