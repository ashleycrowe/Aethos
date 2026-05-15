import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { AethosProvider, useAethos } from '@/app/context/AethosContext';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/app/context/ThemeContext';
import { OracleProvider } from '@/app/context/OracleContext';
import { NotificationProvider } from '@/app/context/NotificationContext';
import { OperationalMeritProvider } from '@/app/context/OperationalMeritContext';
import { UserProvider } from '@/app/context/UserContext';
import { VersionProvider, useVersion } from '@/app/context/VersionContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { isDemoModeEnabled } from '@/app/config/demoMode';
import { installDiagnostics, updateDiagnosticsContext } from '@/app/utils/diagnostics';
import { Toaster } from 'sonner';

// Components
import { Sidebar } from '@/app/components/Sidebar';
import { VersionToggle } from '@/app/components/VersionToggle';
import { RuntimeModeBadge } from '@/app/components/RuntimeModeBadge';
import { AethosLogo } from '@/app/components/branding/AethosLogo';
import { Search, Bell, Settings, LogIn, ShieldCheck, Users } from 'lucide-react';

const AdminCenter = lazy(() => import('@/app/components/AdminCenter').then((module) => ({ default: module.AdminCenter })));
const DesignCenter = lazy(() => import('@/app/components/DesignCenter').then((module) => ({ default: module.DesignCenter })));
const DocumentControlModule = lazy(() =>
  import('@/app/modules/document-control').then((module) => ({
    default: () => (
      <module.DocumentControlProvider demoMode={isDemoModeEnabled()}>
        <module.DocumentControlHome />
      </module.DocumentControlProvider>
    ),
  }))
);
const ForensicLab = lazy(() => import('@/app/components/ForensicLab').then((module) => ({ default: module.ForensicLab })));
const IntelligenceDashboard = lazy(() =>
  import('@/app/components/IntelligenceDashboard').then((module) => ({ default: module.IntelligenceDashboard }))
);
const LatticeDeconstruction = lazy(() =>
  import('@/app/components/LatticeDeconstruction').then((module) => ({ default: module.LatticeDeconstruction }))
);
const OracleSearchBridgeV2 = lazy(() =>
  import('@/app/components/OracleSearchBridgeV2').then((module) => ({ default: module.OracleSearchBridgeV2 }))
);
const PeopleCenter = lazy(() => import('@/app/components/PeopleCenter').then((module) => ({ default: module.PeopleCenter })));
const PrototypeLab = lazy(() => import('@/app/components/PrototypeLab').then((module) => ({ default: module.PrototypeLab })));
const PulseBridge = lazy(() => import('@/app/components/PulseBridge').then((module) => ({ default: module.PulseBridge })));
const RemediationCenter = lazy(() =>
  import('@/app/components/RemediationCenter').then((module) => ({ default: module.RemediationCenter }))
);
const ReportingCenter = lazy(() => import('@/app/components/ReportingCenter').then((module) => ({ default: module.ReportingCenter })));
const TagManagementDemo = lazy(() =>
  import('@/app/components/TagManagementDemo').then((module) => ({ default: module.TagManagementDemo }))
);
const TagManagementFlowDemo = lazy(() =>
  import('@/app/components/TagManagementFlowDemo').then((module) => ({ default: module.TagManagementFlowDemo }))
);
const VoyagerWorkbench = lazy(() =>
  import('@/app/components/VoyagerWorkbench').then((module) => ({ default: module.VoyagerWorkbench }))
);
const WorkspaceEngine = lazy(() => import('@/app/components/WorkspaceEngine').then((module) => ({ default: module.WorkspaceEngine })));

export const LIVE_CORE_TABS = new Set(['oracle', 'insights', 'nexus', 'archival', 'admin']);
export const DEMO_ONLY_TABS = new Set(['reports']);

export const getAllowedTabsForMode = (isDemoMode: boolean) =>
  new Set([
    ...Array.from(LIVE_CORE_TABS),
    ...(isDemoMode ? Array.from(DEMO_ONLY_TABS) : []),
  ]);

export const isTabAllowedForMode = (tab: string, isDemoMode: boolean) =>
  getAllowedTabsForMode(isDemoMode).has(tab);

const COMING_SOON_LABELS: Record<string, string> = {
  admin: 'Admin Center',
  design: 'Design Center',
  documents: 'Document Control',
  lab: 'Prototype Lab',
  people: 'People Center',
  pulse: 'Pulse Bridge',
  reports: 'Reporting Center',
  'tag-demo': 'Tag Management',
  'tag-flow-demo': 'Tag Flow',
  voyager: 'Constellation',
};

const ComingSoonView = ({ tab }: { tab: string }) => (
  <div className="flex min-h-[420px] items-center justify-center px-4 text-center">
    <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0B0F19]/80 p-6 shadow-2xl backdrop-blur-sm sm:rounded-[32px] sm:p-10 sm:backdrop-blur-2xl">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00F0FF]/20 bg-[#00F0FF]/10 text-[#00F0FF]">
        <Settings className="h-5 w-5" />
      </div>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#00F0FF] sm:tracking-[0.35em]">
        Coming Soon
      </p>
      <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-white">
        {COMING_SOON_LABELS[tab] || 'This Module'}
      </h2>
      <p className="text-sm leading-relaxed text-slate-400">
        This surface is gated for the first V1 walkthrough. The live path is Search, Intelligence, Workspace, and Remediation.
      </p>
    </div>
  </div>
);

const ViewLoadingFallback = () => (
  <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-4 text-center">
    <AethosLogo
      variant="icon"
      size="lg"
      className="mb-5 text-[#00F0FF] drop-shadow-[0_0_22px_rgba(0,240,255,0.45)]"
      animated
    />
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.35em]">
      Loading Intelligence Layer
    </p>
  </div>
);

const isMicrosoftAuthPopupResponse = () => {
  if (typeof window === 'undefined') return false;
  if (!window.opener) return false;

  const authParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return authParams.has('code') || authParams.has('error') || authParams.has('error_description');
};

const PopupAuthResponseFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4 text-center text-white">
    <section className="w-full max-w-sm rounded-[28px] border border-[#00F0FF]/20 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm sm:p-8 sm:backdrop-blur-2xl">
      <AethosLogo variant="icon" size="md" className="mx-auto mb-5 text-[#00F0FF]" />
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#00F0FF] sm:tracking-[0.35em]">
        Aethos Live
      </p>
      <h1 className="mb-3 text-2xl font-black tracking-tight text-white">
        Completing sign-in
      </h1>
      <p className="text-sm leading-6 text-slate-400">
        You can close this popup if it does not close automatically.
      </p>
    </section>
  </div>
);

const LoginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const demoMode = isDemoModeEnabled();

  if (demoMode || isAuthenticated) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4 text-center text-white">
        <ViewLoadingFallback />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F19] px-4 py-6 text-white sm:py-10">
      <div className="pointer-events-none fixed right-[-30%] top-[-20%] h-[320px] w-[320px] rounded-full bg-[#00F0FF]/10 blur-[90px] sm:right-[-20%] sm:h-[520px] sm:w-[520px] sm:blur-[150px]" />
      <div className="pointer-events-none fixed bottom-[-25%] left-[-30%] h-[300px] w-[300px] rounded-full bg-[#FF5733]/10 blur-[90px] sm:bottom-[-20%] sm:left-[-20%] sm:h-[480px] sm:w-[480px] sm:blur-[150px]" />

      <section className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm sm:rounded-[32px] sm:p-10 sm:backdrop-blur-2xl">
        <AethosLogo
          variant="full"
          size="xl"
          className="mx-auto mb-8 text-[#00F0FF] drop-shadow-[0_0_24px_rgba(0,240,255,0.35)]"
        />

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#00F0FF] sm:tracking-[0.35em]">
              Aethos Live
            </p>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Sign in to continue
            </h1>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 text-[#00F0FF]">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <p className="mb-8 text-sm leading-6 text-slate-300">
          Connect with Microsoft to test the live tenant flow, JIT provisioning, and protected API endpoints.
        </p>

        <button
          type="button"
          onClick={() => void login()}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#00F0FF]/30 bg-[#00F0FF] px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#061018] shadow-[0_0_30px_rgba(0,240,255,0.25)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#00F0FF]/50"
        >
          <LogIn className="h-5 w-5" />
          Sign in with Microsoft
        </button>

        <p className="mt-5 text-center text-xs text-slate-500">
          Demo Mode is off for this browser session.
        </p>
      </section>
    </div>
  );
};

const DiagnosticsBridge = () => {
  const { isAuthenticated, tenantId, userId } = useAuth();
  const { isDemoMode, version } = useVersion();

  useEffect(() => {
    updateDiagnosticsContext({
      isAuthenticated,
      tenantId,
      userId,
      demoMode: isDemoMode,
      version,
    });
  }, [isAuthenticated, tenantId, userId, isDemoMode, version]);

  return null;
};

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [personaMode, setPersonaMode] = useState<'admin' | 'steward' | 'worker'>('admin');
  const { isDaylight } = useTheme();
  const { version, isDemoMode } = useVersion();

  useEffect(() => {
    const stored = window.localStorage.getItem('aethos:persona-mode');
    if (stored === 'admin' || stored === 'steward' || stored === 'worker') {
      setPersonaMode(stored);
    }
  }, []);

  const updatePersonaMode = (mode: 'admin' | 'steward' | 'worker') => {
    setPersonaMode(mode);
    window.localStorage.setItem('aethos:persona-mode', mode);
    window.dispatchEvent(new CustomEvent('aethos:persona-mode', { detail: { mode } }));
  };

  // VERSION-AWARE TAB VALIDATION: Redirect to valid V1 tab if user is on V2+ tab
  useEffect(() => {
    const versionOrder = ['V1', 'V1.5', 'V2', 'V3', 'V4'];
    const currentVersionIndex = versionOrder.indexOf(version);
    
    const v2Tabs = ['voyager', 'pulse', 'people'];
    
    // If on V1 and active tab requires V2+, redirect to insights
    if (currentVersionIndex <= 1 && v2Tabs.includes(activeTab)) {
      setActiveTab('insights');
    }
  }, [version, activeTab]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string; issue?: string }>).detail;
      if (!detail?.tab) return;

      if (detail.issue && typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('issue', detail.issue);
        window.history.replaceState({}, '', url.toString());
      }

      setActiveTab(detail.tab);
    };

    window.addEventListener('aethos:navigate', handleNavigate);
    return () => window.removeEventListener('aethos:navigate', handleNavigate);
  }, []);

  const renderContent = () => {
    if (!isTabAllowedForMode(activeTab, isDemoMode)) {
      return <ComingSoonView tab={activeTab} />;
    }

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
        return <DocumentControlModule />;
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
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-700 ${isDaylight ? 'bg-[#F8FAFC]' : 'bg-[#0B0F19]'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => setActiveTab(id)} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        openCalibration={() => {}}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 md:h-20 lg:px-10">
          <div className="flex min-w-0 flex-1 items-center gap-6 md:max-w-2xl">
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

          <div className="ml-3 flex shrink-0 items-center gap-2 sm:ml-10 sm:gap-6">
            <RuntimeModeBadge />
            <div className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 md:flex">
              <Users className="ml-2 h-4 w-4 text-slate-500" aria-hidden="true" />
              {(['admin', 'steward', 'worker'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updatePersonaMode(mode)}
                  className={`min-h-[36px] rounded-xl px-3 text-xs font-black uppercase tracking-[0.12em] transition ${
                    personaMode === mode
                      ? 'bg-[#1AFFFF] text-[#061018]'
                      : 'text-slate-500 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-pressed={personaMode === mode}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-slate-500 transition-colors hover:text-[#00F0FF]">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5733] rounded-full border border-[#0B0F19]" />
            </button>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Clarity</span>
              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[88%] bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-28 pt-2 custom-scrollbar sm:p-6 sm:pb-28 sm:pt-4 md:pb-10 lg:p-10">
          <Suspense fallback={<ViewLoadingFallback />}>
            {renderContent()}
          </Suspense>
        </div>

        {/* Global Ambient Decorative Blur */}
        <div className="pointer-events-none fixed right-0 top-0 -z-10 h-[360px] w-[360px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#00F0FF]/5 blur-[90px] sm:h-[800px] sm:w-[800px] sm:blur-[160px]" />
        <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[320px] w-[320px] -translate-x-1/3 translate-y-1/3 rounded-full bg-[#FF5733]/3 blur-[90px] sm:h-[600px] sm:w-[600px] sm:blur-[140px]" />
      </main>
    </div>
  );
};

export default function App() {
  const demoMode = isDemoModeEnabled();

  useEffect(() => {
    installDiagnostics();
  }, []);

  if (isMicrosoftAuthPopupResponse()) {
    return <PopupAuthResponseFallback />;
  }

  return (
    <ThemeProvider>
      <VersionProvider defaultVersion="V1" demoMode={demoMode}>
        <AuthProvider>
          <DiagnosticsBridge />
          <LoginGate>
            <AethosProvider>
              <UserProvider>
                <SettingsProvider>
                  <OperationalMeritProvider>
                    <OracleProvider>
                      <NotificationProvider>
                        <GlobalOverlays />
                        <Layout />
                        <VersionToggle />
                      </NotificationProvider>
                    </OracleProvider>
                  </OperationalMeritProvider>
                </SettingsProvider>
              </UserProvider>
            </AethosProvider>
          </LoginGate>
          <Toaster closeButton position="bottom-right" theme="dark" />
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
