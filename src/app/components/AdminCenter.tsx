import React from 'react';
import {
  CheckCircle2,
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
  isDemoModeEnabled,
} from '@/app/config/demoMode';
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

  const demoMode = isDemoModeEnabled();
  const envDemoDefault = getEnvDemoModeDefault();
  const sessionDemoOverride =
    typeof window !== 'undefined' ? window.localStorage.getItem(DEMO_MODE_STORAGE_KEY) : null;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const microsoftAuthority = 'login.microsoftonline.com/organizations';
  const redirectUri =
    import.meta.env.VITE_MICROSOFT_REDIRECT_URI ||
    (typeof window !== 'undefined' ? window.location.origin : 'Current origin');

  const applyDemoMode = (enabled: boolean) => {
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, String(enabled));
    setDemoMode(enabled);
    toast.success(enabled ? 'Demo Mode enabled' : 'Live Mode enabled', {
      description: 'Reloading the app so every module uses the new mode.',
    });
    window.setTimeout(() => window.location.reload(), 450);
  };

  const resetDemoOverride = () => {
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
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#00F0FF] transition hover:bg-[#00F0FF]/20"
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
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-slate-300">
                Found {scanResult.results.totalFiles.toLocaleString()} files across{' '}
                {scanResult.results.totalSites.toLocaleString()} sites. New indexed files:{' '}
                {scanResult.results.newFiles.toLocaleString()}.
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
                className="min-h-11 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-emerald-200 transition hover:bg-emerald-400/20"
              >
                Force Live Mode
              </button>
              <button
                type="button"
                onClick={resetDemoOverride}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.08]"
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
