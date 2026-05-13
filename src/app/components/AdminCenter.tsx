import React from 'react';
import {
  Bug,
  CheckCircle2,
  Clipboard,
  Database,
  ExternalLink,
  FileSearch,
  KeyRound,
  LogIn,
  LogOut,
  MonitorCog,
  RefreshCw,
  Server,
  ShieldCheck,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeContext';
import { useVersion } from '@/app/context/VersionContext';
import {
  DEMO_MODE_STORAGE_KEY,
  getEnvDemoModeDefault,
  getRuntimeSurface,
  isDemoModeEnabled,
  isDemoOverrideAllowed,
} from '@/app/config/demoMode';
import {
  clearLocalDiagnostics,
  getLocalDiagnostics,
  type StoredDiagnostic,
} from '@/app/utils/diagnostics';
import { runDiscoveryScan, type DiscoveryScanResponse } from '@/lib/api';

type AdminStatusCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: 'cyan' | 'green' | 'amber' | 'slate';
};

const toneClasses = {
  cyan: 'border-[#00F0FF]/25 bg-[#00F0FF]/10 text-[#00F0FF]',
  green: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  amber: 'border-amber-300/25 bg-amber-300/10 text-amber-200',
  slate: 'border-white/10 bg-white/[0.04] text-slate-300',
};

const AdminStatusCard = ({ icon: Icon, label, value, tone = 'slate' }: AdminStatusCardProps) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="break-words text-sm font-bold text-white">{value}</p>
  </div>
);

const AdminRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-1 border-b border-white/10 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</span>
    <span className="break-words text-sm font-semibold text-slate-200 sm:text-right">{value}</span>
  </div>
);

function openAppTab(tab: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab },
  }));
}

const SetupStep = ({
  number,
  title,
  description,
  complete,
  action,
}: {
  number: number;
  title: string;
  description: string;
  complete: boolean;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${
          complete
            ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-300'
            : 'border-[#00F0FF]/25 bg-[#00F0FF]/10 text-[#00F0FF]'
        }`}
      >
        {complete ? <CheckCircle2 className="h-5 w-5" /> : number}
      </div>
      <div>
        <h3 className="text-sm font-black text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const AdminCenter = () => {
  const { isDaylight } = useTheme();
  const { version, setDemoMode } = useVersion();
  const {
    user,
    tenantId,
    userId,
    accessToken,
    isAuthenticated,
    isLoading,
    getAccessToken,
    login,
    logout,
  } = useAuth();
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<DiscoveryScanResponse | null>(null);
  const [localDiagnostics, setLocalDiagnostics] = React.useState<StoredDiagnostic[]>([]);

  const demoMode = isDemoModeEnabled();
  const demoOverrideAllowed = isDemoOverrideAllowed();
  const runtimeSurface = getRuntimeSurface();
  const envDemoDefault = getEnvDemoModeDefault();
  const sessionDemoOverride =
    typeof window !== 'undefined' ? window.localStorage.getItem(DEMO_MODE_STORAGE_KEY) : null;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const microsoftAuthority = 'login.microsoftonline.com/organizations';
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : 'Current origin';
  const hasTenantContext = Boolean(tenantId || user?.tenantId);
  const hasDiscoveryResult = Boolean(scanResult);
  const diagnosticIssueCount = localDiagnostics.filter((event) =>
    event.severity === 'error' || event.severity === 'fatal' || event.severity === 'warn'
  ).length;

  const refreshDiagnostics = React.useCallback(() => {
    setLocalDiagnostics(getLocalDiagnostics());
  }, []);

  React.useEffect(() => {
    if (!demoMode) return;
    refreshDiagnostics();
  }, [demoMode, refreshDiagnostics]);

  const applyDemoMode = (enabled: boolean) => {
    if (!demoOverrideAllowed) {
      toast.info('Runtime mode is locked for this domain', {
        description: `${runtimeSurface} is controlled by deployment configuration.`,
      });
      return;
    }

    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, String(enabled));
    setDemoMode(enabled);
    toast.success(enabled ? 'Demo Mode enabled' : 'Live Mode enabled', {
      description: 'Reloading the app so every module uses the new mode.',
    });
    window.setTimeout(() => window.location.reload(), 450);
  };

  const resetDemoOverride = () => {
    if (!demoOverrideAllowed) {
      toast.info('Runtime mode is locked for this domain', {
        description: `${runtimeSurface} is controlled by deployment configuration.`,
      });
      return;
    }

    window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    setDemoMode(envDemoDefault);
    toast.success('Demo override cleared', {
      description: 'Reloading with the environment default.',
    });
    window.setTimeout(() => window.location.reload(), 450);
  };

  const handleLogout = () => {
    void logout();
  };

  const handleLogin = () => {
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'false');
    setDemoMode(false);
    void login();
  };

  const handleDiscoveryScan = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'false');
      setDemoMode(false);

      const token = await getAccessToken();
      if (!token) {
        toast.error('Microsoft session required', {
          description: 'Sign in again before running discovery.',
        });
        return;
      }

      const result = await runDiscoveryScan({ accessToken: token, scanType: 'full' });
      setScanResult(result);
      toast.success('Discovery scan complete', {
        description: `${result.results.totalFiles.toLocaleString()} files found across ${result.results.totalSites.toLocaleString()} sites.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Discovery scan failed';
      toast.error('Discovery scan failed', { description: message });
    } finally {
      setIsScanning(false);
    }
  };

  const copyDiagnostics = async () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      route: typeof window !== 'undefined' ? window.location.href : 'unknown',
      mode: demoMode ? 'demo' : 'live',
      events: localDiagnostics,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
      toast.success('All diagnostics copied');
    } catch {
      toast.error('Unable to copy diagnostics');
    }
  };

  const copyDiagnosticEvent = async (event: StoredDiagnostic) => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      route: typeof window !== 'undefined' ? window.location.href : 'unknown',
      mode: demoMode ? 'demo' : 'live',
      actionTaken: event.actionTaken || 'No recent UI action captured',
      expectedResult:
        event.expectedResult || 'The selected app action completes without a browser or API error.',
      actualResult: event.actualResult || event.message,
      errorMessage: event.message,
      errorType: event.eventName,
      severity: event.severity,
      source: event.source,
      eventRoute: event.route,
      occurredAt: event.createdAt,
      metadata: event.metadata,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
      toast.success('Diagnostic event copied');
    } catch {
      toast.error('Unable to copy diagnostic event');
    }
  };

  const clearDiagnostics = () => {
    clearLocalDiagnostics();
    setLocalDiagnostics([]);
    toast.success('Diagnostics cleared');
  };

  return (
    <div
      className={`min-h-full px-4 pb-24 pt-4 sm:px-6 lg:px-8 ${
        isDaylight ? 'text-slate-950' : 'text-white'
      }`}
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#00F0FF]">
              Admin Center
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Tenant and Session Controls
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              V1 admin focuses on what matters for live testing: authentication state, tenant context,
              demo overrides, API readiness, and a reliable sign-out path.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => applyDemoMode(!demoMode)}
              disabled={!demoOverrideAllowed}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {demoMode ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
              {demoMode ? 'Use Live Mode' : 'Use Demo Mode'}
            </button>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-rose-300/25 bg-rose-400/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-4 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-[#00F0FF] disabled:cursor-wait disabled:opacity-60"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatusCard
            icon={demoMode ? ToggleRight : ToggleLeft}
            label="Runtime Mode"
            value={demoMode ? 'Demo data active' : 'Live APIs active'}
            tone={demoMode ? 'amber' : 'green'}
          />
          <AdminStatusCard
            icon={ShieldCheck}
            label="Microsoft Auth"
            value={isAuthenticated ? 'Signed in' : demoMode ? 'Bypassed by Demo Mode' : 'Not signed in'}
            tone={isAuthenticated ? 'green' : demoMode ? 'amber' : 'slate'}
          />
          <AdminStatusCard
            icon={Database}
            label="Tenant"
            value={tenantId || user?.tenantId || 'Pending tenant context'}
            tone={tenantId || user?.tenantId ? 'cyan' : 'slate'}
          />
          <AdminStatusCard
            icon={KeyRound}
            label="Token"
            value={accessToken ? 'Graph access token available' : 'No active token'}
            tone={accessToken ? 'green' : 'slate'}
          />
        </div>

        <section className="rounded-[28px] border border-[#00F0FF]/20 bg-[#00F0FF]/[0.045] p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#00F0FF]">
                Phase 1 Setup
              </p>
              <h2 className="text-xl font-black text-white">Live Tenant Walkthrough</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Use this checklist when testing a real Microsoft account. Demo data stays available in Demo Mode,
                but Live Mode should only show what has been indexed from this tenant.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-bold text-slate-300">
              {demoMode ? 'Demo Mode active' : 'Live Mode active'} - {runtimeSurface} surface
            </div>
          </div>

          <div className="grid gap-3">
            <SetupStep
              number={1}
              title="Confirm Microsoft session"
              description={isAuthenticated ? 'Microsoft account is signed in.' : 'Sign in before testing live tenant data.'}
              complete={isAuthenticated}
              action={!isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="min-h-11 rounded-xl border border-[#00F0FF]/25 bg-[#00F0FF] px-4 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-white"
                >
                  Sign In
                </button>
              )}
            />
            <SetupStep
              number={2}
              title="Verify tenant context"
              description={hasTenantContext ? 'Aethos has resolved a tenant for this session.' : 'Tenant provisioning is still pending or failed.'}
              complete={hasTenantContext}
            />
            <SetupStep
              number={3}
              title="Run Microsoft Discovery"
              description={hasDiscoveryResult ? 'Discovery completed in this session.' : 'Populate the files table from this Microsoft tenant before expecting Search or Remediation results.'}
              complete={hasDiscoveryResult}
              action={
                <button
                  type="button"
                  onClick={handleDiscoveryScan}
                  disabled={isScanning || !isAuthenticated}
                  className="min-h-11 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isScanning ? 'Scanning' : 'Run Scan'}
                </button>
              }
            />
            <SetupStep
              number={4}
              title="Create first workspace"
              description="Open Workspaces from the sidebar and create a manual workspace. This should work even when no files are indexed."
              complete={false}
            />
          </div>
        </section>

        {demoMode && (
          <section className="rounded-[28px] border border-amber-300/20 bg-amber-300/[0.045] p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-200">
                  <Bug className="h-6 w-6" />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-200">
                    Demo Diagnostics
                  </p>
                  <h2 className="text-xl font-black text-white">
                    {diagnosticIssueCount > 0
                      ? `${diagnosticIssueCount} browser events captured`
                      : 'No browser events captured'}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    This session view mirrors the client-side diagnostics sent to the backend. Use it during
                    walkthroughs when a browser error needs to be shared for debugging.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  onClick={refreshDiagnostics}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/[0.08]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={copyDiagnostics}
                  disabled={localDiagnostics.length === 0}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-4 text-xs font-black uppercase tracking-[0.14em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy All
                </button>
                <button
                  type="button"
                  onClick={clearDiagnostics}
                  disabled={localDiagnostics.length === 0}
                  className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 text-xs font-black uppercase tracking-[0.14em] text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>

            {localDiagnostics.length > 0 ? (
              <div className="grid gap-3">
                {localDiagnostics.slice(0, 10).map((event, index) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">
                          Event {index + 1}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                            event.severity === 'error' || event.severity === 'fatal'
                              ? 'border-rose-300/25 bg-rose-400/10 text-rose-200'
                              : event.severity === 'warn'
                                ? 'border-amber-300/25 bg-amber-300/10 text-amber-200'
                                : 'border-[#00F0FF]/25 bg-[#00F0FF]/10 text-[#00F0FF]'
                          }`}
                        >
                          {event.severity}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          {event.eventName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <span className="text-xs font-semibold text-slate-500">
                          {new Date(event.createdAt).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyDiagnosticEvent(event)}
                          className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                          Copy Event
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Action Taken
                        </p>
                        <p className="break-words text-xs font-semibold leading-5 text-slate-200">
                          {event.actionTaken || 'No recent UI action captured'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Expected Result
                        </p>
                        <p className="break-words text-xs font-semibold leading-5 text-slate-200">
                          {event.expectedResult || 'The selected app action completes without a browser or API error.'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                          Actual Result
                        </p>
                        <p className="break-words text-xs font-semibold leading-5 text-slate-200">
                          {event.actualResult || event.message}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                        Error Message
                      </p>
                      <p className="break-words text-sm font-semibold text-slate-100">{event.message}</p>
                      <p className="mt-2 break-words text-xs text-slate-500">{event.route}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-slate-400">
                No local diagnostics have been captured in this browser session.
              </div>
            )}
          </section>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#0B0F19]/70 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#00F0FF]/20 bg-[#00F0FF]/10 text-[#00F0FF]">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Session</h2>
                <p className="text-xs text-slate-500">Current user, tenant, and sign-in posture.</p>
              </div>
            </div>

            <div className="mt-4">
              <AdminRow label="Account" value={user?.name || user?.username || 'No Microsoft account active'} />
              <AdminRow label="Email" value={user?.username || 'Unavailable'} />
              <AdminRow label="Tenant ID" value={tenantId || user?.tenantId || 'Unavailable'} />
              <AdminRow label="Aethos User ID" value={userId || 'Pending API provisioning'} />
              <AdminRow
                label="Sign Out"
                value={
                  isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-400/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out of Microsoft
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20"
                    >
                      <LogIn className="h-4 w-4" />
                      Start Live Sign In
                    </button>
                  )
                }
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#0B0F19]/70 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Deployment Readiness</h2>
                <p className="text-xs text-slate-500">Live test configuration visible in-app.</p>
              </div>
            </div>

            <div className="mt-4">
              <AdminRow label="Version" value={version} />
              <AdminRow label="API Base" value={apiBaseUrl} />
              <AdminRow label="MS Authority" value={microsoftAuthority} />
              <AdminRow label="Redirect URI" value={redirectUri} />
              <AdminRow
                label="Env Default"
                value={envDemoDefault ? 'VITE_DEMO_MODE=true' : 'VITE_DEMO_MODE=false'}
              />
              <AdminRow label="Runtime Surface" value={runtimeSurface} />
              <AdminRow label="Demo Override" value={demoOverrideAllowed ? 'Allowed' : 'Domain locked'} />
              <AdminRow
                label="Browser Override"
                value={sessionDemoOverride === null ? 'None' : `aethos_demo_mode=${sessionDemoOverride}`}
              />
            </div>
          </section>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[#00F0FF]/20 bg-[#00F0FF]/[0.06] p-5 backdrop-blur-xl">
            <FileSearch className="mb-4 h-6 w-6 text-[#00F0FF]" />
            <h3 className="mb-2 text-base font-black text-white">Microsoft Discovery</h3>
            <p className="mb-5 text-sm leading-6 text-slate-400">
              Live search reads from the indexed `files` table. Run discovery after signing in to populate it
              from your Microsoft 365 tenant.
            </p>
            <button
              type="button"
              onClick={handleDiscoveryScan}
              disabled={isScanning || !isAuthenticated}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF] px-4 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSearch className="h-4 w-4" />
              {isScanning ? 'Scanning Microsoft 365' : 'Run Discovery Scan'}
            </button>
            {scanResult && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs leading-6 text-slate-300">
                  Found {scanResult.results.totalFiles.toLocaleString()} files across{' '}
                  {scanResult.results.totalSites.toLocaleString()} sites. New indexed files:{' '}
                  {scanResult.results.newFiles.toLocaleString()}.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => openAppTab('oracle')}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20"
                  >
                    <FileSearch className="h-4 w-4" />
                    Search Files
                  </button>
                  <button
                    type="button"
                    onClick={() => openAppTab('nexus')}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200 transition hover:bg-emerald-400/20"
                  >
                    <Database className="h-4 w-4" />
                    Create Workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => openAppTab('archival')}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-300/20"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Review Risk
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <MonitorCog className="mb-4 h-6 w-6 text-[#00F0FF]" />
            <h3 className="mb-2 text-base font-black text-white">Mode Control</h3>
            <p className="mb-5 text-sm leading-6 text-slate-400">
              The environment variable sets the default. This browser can override it for testing without
              changing Vercel.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => applyDemoMode(false)}
                disabled={!demoOverrideAllowed}
                className="min-h-11 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Force Live Mode
              </button>
              <button
                type="button"
                onClick={resetDemoOverride}
                disabled={!demoOverrideAllowed}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Override
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <ShieldCheck className="mb-4 h-6 w-6 text-emerald-300" />
            <h3 className="mb-2 text-base font-black text-white">Security Baseline</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                Multitenant Microsoft authority uses the organizations endpoint.
              </p>
              <p className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                Tenant context is provisioned through the V1 auth API when live mode is active.
              </p>
              <p className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                Sign-out clears Aethos session state before Microsoft logout redirect.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <ExternalLink className="mb-4 h-6 w-6 text-amber-200" />
            <h3 className="mb-2 text-base font-black text-white">V1 Admin Scope</h3>
            <p className="mb-5 text-sm leading-6 text-slate-400">
              Billing, deep policy controls, and connector governance stay out of the V1 walkthrough until
              their workflows are fully backed by live APIs.
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-slate-400">
              Core V1 modules remain Search, Intelligence, Workspace, Remediation, and this Admin surface.
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};
