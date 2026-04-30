import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { AethosProvider, useAethos } from './context/AethosContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OracleProvider } from './context/OracleContext';
import { NotificationProvider } from './context/NotificationContext';
import { OperationalMeritProvider } from './context/OperationalMeritContext';
import { UserProvider } from './context/UserContext';
import { VersionProvider, useVersion } from './context/VersionContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Components
import { Sidebar } from './components/Sidebar';
import { VersionToggle } from './components/VersionToggle';
import { Search, Bell, Settings } from 'lucide-react';

const AdminCenter = lazy(() => import('./components/AdminCenter').then((module) => ({ default: module.AdminCenter })));
const DesignCenter = lazy(() => import('./components/DesignCenter').then((module) => ({ default: module.DesignCenter })));
const DocumentControlModule = lazy(() =>
  import('./modules/document-control').then((module) => ({
    default: () => (
      <module.DocumentControlProvider demoMode={true}>
        <module.DocumentControlHome />
      </module.DocumentControlProvider>
    ),
  }))
);
const ForensicLab = lazy(() => import('./components/ForensicLab').then((module) => ({ default: module.ForensicLab })));
const IntelligenceDashboard = lazy(() =>
  import('./components/IntelligenceDashboard').then((module) => ({ default: module.IntelligenceDashboard }))
);
const LatticeDeconstruction = lazy(() =>
  import('./components/LatticeDeconstruction').then((module) => ({ default: module.LatticeDeconstruction }))
);
const OracleSearchBridgeV2 = lazy(() =>
  import('./components/OracleSearchBridgeV2').then((module) => ({ default: module.OracleSearchBridgeV2 }))
);
const PeopleCenter = lazy(() => import('./components/PeopleCenter').then((module) => ({ default: module.PeopleCenter })));
const PrototypeLab = lazy(() => import('./components/PrototypeLab').then((module) => ({ default: module.PrototypeLab })));
const PulseBridge = lazy(() => import('./components/PulseBridge').then((module) => ({ default: module.PulseBridge })));
const RemediationCenter = lazy(() =>
  import('./components/RemediationCenter').then((module) => ({ default: module.RemediationCenter }))
);
const ReportingCenter = lazy(() => import('./components/ReportingCenter').then((module) => ({ default: module.ReportingCenter })));
const TagManagementDemo = lazy(() =>
  import('./components/TagManagementDemo').then((module) => ({ default: module.TagManagementDemo }))
);
const TagManagementFlowDemo = lazy(() =>
  import('./components/TagManagementFlowDemo').then((module) => ({ default: module.TagManagementFlowDemo }))
);
const VoyagerWorkbench = lazy(() =>
  import('./components/VoyagerWorkbench').then((module) => ({ default: module.VoyagerWorkbench }))
);
const WorkspaceEngine = lazy(() => import('./components/WorkspaceEngine').then((module) => ({ default: module.WorkspaceEngine })));

const ViewLoadingFallback = () => (
  <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center">
    <div className="w-10 h-10 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mb-5" />
    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
      Loading Intelligence Layer
    </p>
  </div>
);

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDaylight } = useTheme();
  const { version } = useVersion();

  // VERSION-AWARE TAB VALIDATION: Redirect to valid V1 tab if user is on V2+ tab
  useEffect(() => {
    const versionOrder = ['V1', 'V1.5', 'V2', 'V3', 'V4'];
    const currentVersionIndex = versionOrder.indexOf(version);
    
    const v1Tabs = ['oracle', 'nexus', 'insights', 'archival', 'reports', 'admin'];
    const v2Tabs = ['voyager', 'pulse', 'people'];
    
    // If on V1 and active tab requires V2+, redirect to insights
    if (currentVersionIndex <= 1 && v2Tabs.includes(activeTab)) {
      setActiveTab('insights');
    }
  }, [version, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'oracle':
        return <OracleSearchBridgeV2 />;
      case 'voyager':
        return <VoyagerWorkbench />;
      case 'insights':
        return <IntelligenceDashboard />; // CONSOLIDATED: Stream, Metadata, Identity
      case 'nexus':
        return <WorkspaceEngine />;
      case 'pulse':
        return <PulseBridge />; // CONSOLIDATED: Operational Pulse + Gallery + Notifications
      case 'people':
        return <PeopleCenter />; // CONSOLIDATED: People + Identity basics
      case 'archival':
        return <RemediationCenter />; // CONSOLIDATED: Archival + Vault + Decision Control
      case 'reports':
        return <ReportingCenter />;
      case 'admin':
        return <AdminCenter />; // Settings/Admin
      case 'documents':
        return (
          <DocumentControlProvider demoMode={true}>
            <DocumentControlHome />
          </DocumentControlProvider>
        );
      // Legacy routes for backwards compatibility
      case 'social':
        return <PulseBridge />; // Redirect to Pulse
      case 'identity':
        return <IntelligenceDashboard />; // Redirect to Intelligence
      case 'metadata':
        return <IntelligenceDashboard />; // Redirect to Intelligence
      case 'flashlight':
      case 'integrity':
        return <RemediationCenter />; // Redirect to Remediation
      case 'vault':
        return <RemediationCenter />; // Redirect to Remediation
      // Prototype/Demo routes (hidden from nav, accessible via URL)
      case 'lab':
        return <PrototypeLab />;
      case 'design':
        return <DesignCenter />;
      case 'tag-demo':
        return <TagManagementDemo />;
      case 'tag-flow-demo':
        return <TagManagementFlowDemo />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Protocol Synthesis</h2>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              "The {activeTab} protocol is currently being optimized for operational clarity. Please explore the Intelligence Center or Oracle Search."
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-700 ${isDaylight ? 'bg-[#F8FAFC]' : 'bg-[#0B0F19]'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => setActiveTab(id)} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        openCalibration={() => {}}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
             <div className="relative group w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-[#00F0FF] transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Search Aethos Intelligence Layer..." 
                 onFocus={() => setActiveTab('oracle')}
                 className={`w-full border rounded-full py-2.5 pl-12 pr-6 text-sm transition-all outline-none ${
                   isDaylight 
                    ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500' 
                    : 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-[#00F0FF]/50'
                 }`}
               />
             </div>
          </div>

          <div className="flex items-center gap-6 ml-10">
            <button className="p-2 text-slate-500 hover:text-[#00F0FF] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5733] rounded-full border border-[#0B0F19]" />
            </button>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Clarity</span>
              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[88%] bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 p-10 pt-4 overflow-y-auto custom-scrollbar relative z-10">
          <Suspense fallback={<ViewLoadingFallback />}>
            {renderContent()}
          </Suspense>
        </div>

        {/* Global Ambient Decorative Blur */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[160px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#FF5733]/3 rounded-full blur-[140px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <VersionProvider defaultVersion="V1" demoMode={true}>
        <AuthProvider>
          <AethosProvider>
            <UserProvider>
              <SettingsProvider>
                <OperationalMeritProvider>
                  <OracleProvider>
                    <NotificationProvider>
                      <GlobalOverlays />
                      <Layout />
                      <VersionToggle />
                      <Toaster closeButton position="bottom-right" theme="dark" />
                    </NotificationProvider>
                  </OracleProvider>
                </OperationalMeritProvider>
              </SettingsProvider>
            </UserProvider>
          </AethosProvider>
        </AuthProvider>
      </VersionProvider>
    </ThemeProvider>
  );
}

const GlobalOverlays = () => {
  const { state, setForensicLabOpen } = useAethos();
  
  return (
    <>
      <AnimatePresence>
        {state.isForensicLabOpen && state.forensicContext.type === 'node' && (
          <Suspense fallback={null}>
            <ForensicLab 
              isOpen={true} 
              onClose={() => setForensicLabOpen(false)}
              label={state.forensicContext.label}
            />
          </Suspense>
        )}
        {state.isForensicLabOpen && (state.forensicContext.type === 'universal' || state.forensicContext.type === 'workspace') && (
          <Suspense fallback={null}>
            <LatticeDeconstruction 
              isOpen={true} 
              onClose={() => setForensicLabOpen(false)}
              label={state.forensicContext.label}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};
