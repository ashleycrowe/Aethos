import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Fingerprint, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Database,
  Users,
  FileText,
  Activity,
  Play,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/app/context/ThemeContext';
import { useFeature, useVersion } from '@/app/context/VersionContext';
import { GlassCard } from '@/app/components/GlassCard';
import { IntelligenceStream } from '@/app/components/IntelligenceStream';
import { MetadataIntelligenceDashboard } from '@/app/components/MetadataIntelligenceDashboard';
import { IdentityEngine } from '@/app/components/IdentityEngine';
import { DiscoveryScanSimulation } from '@/app/components/DiscoveryScanSimulation';
import { toast } from 'sonner';
import { getReportSummary, syncOwnerStatus, type ReportSummaryResponse } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

type IntelligenceView = 'dashboard' | 'stream' | 'metadata' | 'identity';

function formatBytes(bytes?: number | null) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getScoreColor(score: number) {
  if (score >= 75) return '#FF5733';
  if (score >= 45) return '#F59E0B';
  return '#10B981';
}

function formatDate(value?: string | null) {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatAction(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatScanStatus(value: string) {
  return value.replace(/_/g, ' ').toUpperCase();
}

function formatOwnerStatus(value?: string | null) {
  if (!value) return 'Not Synced';
  return value.replace(/_/g, ' ').toUpperCase();
}

function getOwnerStatusColor(value?: string | null) {
  switch (value) {
    case 'active':
      return '#10B981';
    case 'disabled':
    case 'not_found':
      return '#FF5733';
    case 'guest':
    case 'permission_required':
      return '#F59E0B';
    default:
      return '#94A3B8';
  }
}

function openRemediation(issue?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab: 'archival', issue },
  }));
}

function openAppTab(tab: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab },
  }));
}

const DataSourceBadge = ({ mode }: { mode: 'live' | 'demo' }) => (
  <span className={`w-fit rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
    mode === 'live'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
      : 'border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]'
  }`}>
    Data source: {mode === 'live' ? 'Live tenant' : 'Demo fixtures'}
  </span>
);

const LastScanStrip = ({
  reportSummary,
  isDaylight,
}: {
  reportSummary: ReportSummaryResponse['summary'];
  isDaylight: boolean;
}) => {
  const status = reportSummary.lastScan.status;
  const statusColor =
    status === 'completed' ? '#10B981' :
    status === 'partial' ? '#F59E0B' :
    status === 'failed' ? '#FF5733' :
    status === 'running' ? '#00F0FF' :
    '#94A3B8';

  const stats = [
    ['Completed', formatDate(reportSummary.lastScan.completedAt)],
    ['Files', reportSummary.lastScan.filesDiscovered.toLocaleString()],
    ['Sites/Teams', reportSummary.lastScan.sitesDiscovered.toLocaleString()],
    ['New Files', reportSummary.lastScan.newFiles.toLocaleString()],
    ['Errors', reportSummary.lastScan.errorCount.toLocaleString()],
  ];

  return (
    <GlassCard className="p-4 md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            style={{ borderColor: `${statusColor}40`, backgroundColor: `${statusColor}14`, color: statusColor }}
          >
            {status === 'running' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-sm font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Last Scan: {formatScanStatus(status)}
              </p>
              <DataSourceBadge mode="live" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Persisted discovery summary from the latest Microsoft 365 scan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 xl:min-w-[640px]">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className={`rounded-xl border p-3 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
              <p className={`mt-1 truncate text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export const IntelligenceDashboard = () => {
  const { isDaylight } = useTheme();
  const { isDemoMode } = useVersion();
  const [activeView, setActiveView] = useState<IntelligenceView>('dashboard');

  const views = [
    { id: 'dashboard' as IntelligenceView, label: 'Discovery Summary', icon: Sparkles },
    { id: 'stream' as IntelligenceView, label: isDemoMode ? 'Stream' : 'Signal Queue', icon: Activity },
    { id: 'metadata' as IntelligenceView, label: 'Metadata Quality', icon: Brain },
    ...(isDemoMode ? [{ id: 'identity' as IntelligenceView, label: 'Identity', icon: Fingerprint }] : []),
  ];

  useEffect(() => {
    if (!isDemoMode && activeView === 'identity') {
      setActiveView('dashboard');
    }
  }, [activeView, isDemoMode]);

  const renderView = () => {
    switch (activeView) {
      case 'stream':
        return <IntelligenceStream />;
      case 'metadata':
        return <MetadataIntelligenceDashboard />;
      case 'identity':
        return <IdentityEngine />;
      default:
        return <OverviewDashboard onOpenSignalQueue={() => setActiveView('stream')} />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5 md:space-y-6">
      {/* Header with View Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 md:gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Intelligence Center
            </h2>
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Operational <span className="text-[#00F0FF]">Intelligence</span>
          </h1>
          <p className="text-xs text-[#94A3B8] italic">
            Consolidated insights, metadata, and identity intelligence
          </p>
        </div>

        {/* View Tabs */}
        <div className={`grid grid-cols-2 sm:flex sm:items-center gap-1 p-1 rounded-xl w-full lg:w-auto ${
          isDaylight ? 'bg-slate-100' : 'bg-white/5 border border-white/10'
        }`}>
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`min-h-[44px] justify-center px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === view.id
                  ? 'bg-[#00F0FF] text-[#0B0F19]'
                  : isDaylight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderView()}
          </Motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const OverviewDashboard = ({ onOpenSignalQueue }: { onOpenSignalQueue?: () => void }) => {
  const { isDaylight } = useTheme();
  const { version, isDemoMode } = useVersion();
  const { getAccessToken } = useAuth();
  const hasSlack = useFeature('slackIntegration');
  const hasGoogle = useFeature('googleWorkspaceShadow');
  const hasBox = useFeature('boxShadowDiscovery');
  const [reportSummary, setReportSummary] = useState<ReportSummaryResponse['summary'] | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isSyncingOwners, setIsSyncingOwners] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setReportSummary(null);
      setSummaryError(null);
      return;
    }

    let cancelled = false;
    const loadSummary = async () => {
      try {
        setIsLoadingSummary(true);
        setSummaryError(null);
        const response = await getReportSummary({ accessToken: await getAccessToken() });
        if (!cancelled) setReportSummary(response.summary);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load live report summary';
        if (!cancelled) setSummaryError(message);
      } finally {
        if (!cancelled) setIsLoadingSummary(false);
      }
    };

    void loadSummary();
    return () => {
      cancelled = true;
    };
  }, [isDemoMode]);

  const totalFiles = reportSummary?.discovery.totalFiles ?? 0;
  const healthScore = reportSummary?.healthScore.score;
  const healthLabel = reportSummary?.healthScore.label;
  const healthDisplay = healthScore === null || healthScore === undefined ? 'Pending' : `${healthScore}/100`;
  const maturity = reportSummary?.healthScore.dataMaturity ?? 'none';
  const lastScanStatus = reportSummary?.lastScan.status ?? 'none';
  const shouldShowPathToValue = !isDemoMode && reportSummary?.healthScore.label === 'not_enough_data';
  const ownerMetadataState = reportSummary
    ? reportSummary.discovery.totalFiles === 0
      ? 'no_files'
      : reportSummary.ownership.uniqueOwners === 0
      ? 'missing_owner_metadata'
      : 'available'
    : 'loading';
  const ownerStatusCoverage = reportSummary?.ownership.ownerStatusCoverage;

  const refreshReportSummary = async () => {
    const response = await getReportSummary({ accessToken: await getAccessToken() });
    setReportSummary(response.summary);
  };

  const handleOwnerStatusSync = async () => {
    try {
      setIsSyncingOwners(true);
      const accessToken = await getAccessToken();
      const response = await syncOwnerStatus({ accessToken, limit: 25 });
      await refreshReportSummary();
      if (response.permissionRequired > 0) {
        toast.warning('Owner status sync needs additional Microsoft Graph permissions');
      } else {
        toast.success(`Owner status synced for ${response.checked} owner${response.checked === 1 ? '' : 's'}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sync owner status');
    } finally {
      setIsSyncingOwners(false);
    }
  };

  const metrics = [
    {
      id: 'intelligence-score',
      label: isDemoMode ? 'Intelligence Score' : 'Tenant Health',
      value: isDemoMode ? '92.4%' : healthDisplay,
      change: isDemoMode ? '+4.2%' : isLoadingSummary ? 'Loading' : reportSummary?.globalRisk.riskRating ?? 'Live',
      trend: 'up',
      icon: Sparkles,
      color: '#00F0FF',
      description: isDemoMode ? 'Overall metadata quality & enrichment' : 'Global health from live discovery data'
    },
    {
      id: 'waste-recovery',
      label: isDemoMode ? 'Waste Recovery' : 'Indexed Files',
      value: isDemoMode ? '2.4 TB' : totalFiles.toLocaleString(),
      change: isDemoMode ? '+840 GB' : `${reportSummary?.discovery.totalSites ?? 0} sites`,
      trend: 'up',
      icon: TrendingUp,
      color: '#10B981',
      description: isDemoMode ? 'Dead capital identified this month' : 'Files indexed from Microsoft 365'
    },
    {
      id: 'identity-health',
      label: isDemoMode ? 'Identity Health' : 'Owner Liability',
      value: isDemoMode
        ? '98.1%'
        : `${reportSummary?.ownership.topRiskOwners[0]?.ownerLiabilityScore ?? 0}/100`,
      change: isDemoMode ? '+0.8%' : `${reportSummary?.ownership.unknownOwnerFiles ?? 0} unowned`,
      trend: 'up',
      icon: Fingerprint,
      color: '#A855F7',
      description: isDemoMode ? 'Reconciliation accuracy across providers' : 'Top owner/offboarding risk score'
    },
    {
      id: 'sync-status',
      label: isDemoMode ? 'Sync Status' : 'Last Scan',
      value: isDemoMode ? (version === 'V1' || version === 'V1.5' ? '1/1' : '4/4') : lastScanStatus.toUpperCase(),
      change: isDemoMode ? 'All Active' : `${reportSummary?.lastScan.errorCount ?? 0} errors`,
      trend: 'neutral',
      icon: Zap,
      color: '#F59E0B',
      description: isDemoMode ? 'Universal adapters operational' : 'Most recent discovery scan status'
    },
  ];

  const recentActivity = [
    { id: 1, type: 'success', message: 'Microsoft 365 sync completed', time: '2m ago', icon: CheckCircle2 },
    { id: 2, type: 'info', message: '47 new tags enriched via AI', time: '12m ago', icon: Brain },
    { id: 3, type: 'warning', message: 'Identity reconciliation needed for 3 users', time: '1h ago', icon: AlertCircle },
    { id: 4, type: 'success', message: 'Workspace "Project Phoenix" created', time: '2h ago', icon: CheckCircle2 },
    { id: 5, type: 'info', message: 'Metadata quality improved to 92.4%', time: '3h ago', icon: Sparkles },
  ];
  const liveActivity = reportSummary
    ? [
        {
          id: 1,
          type: 'info',
          message: `${reportSummary.discovery.totalFiles.toLocaleString()} Microsoft files indexed`,
          time: 'Live tenant',
          icon: FileText,
        },
        {
          id: 2,
          type: 'info',
          message: reportSummary.globalRisk.primaryRiskFactor
            ? `Primary driver: ${reportSummary.globalRisk.primaryRiskFactor}`
            : 'No health score yet. Expand discovery coverage to calculate one.',
          time: 'Live tenant',
          icon: AlertCircle,
        },
      ]
    : [];

  // V1: Microsoft 365 only
  // V2+: Add Slack, Google Workspace
  // V3+: Add Box
  const allProviders = [
    {
      name: 'Microsoft 365',
      status: isDemoMode ? 'active' : summaryError ? 'needs attention' : 'active',
      assets: isDemoMode ? '12.4K' : totalFiles.toLocaleString(),
      lastSync: isDemoMode ? '2m ago' : reportSummary?.lastScan.completedAt ? 'Live discovery' : 'Not scanned',
      version: 'V1',
    },
    { name: 'Slack', status: 'active', assets: '8.2K', lastSync: '5m ago', version: 'V2', enabled: hasSlack },
    { name: 'Google Workspace', status: 'active', assets: '6.1K', lastSync: '8m ago', version: 'V2', enabled: hasGoogle },
    { name: 'Box', status: 'active', assets: '4.3K', lastSync: '12m ago', version: 'V3', enabled: hasBox },
  ];

  const providerStatus = allProviders.filter(p => !p.version || p.version === 'V1' || p.enabled);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Discovery Scan Simulation */}
      <DiscoveryScanSimulation />

      {!isDemoMode && summaryError && (
        <GlassCard className="border-[#FF5733]/20 bg-[#FF5733]/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5733]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Live Intelligence Unavailable
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {summaryError}. Run Microsoft Discovery from Admin or check API configuration.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {!isDemoMode && reportSummary && (
        <LastScanStrip reportSummary={reportSummary} isDaylight={isDaylight} />
      )}

      {!isDemoMode && reportSummary && (
        <GlassCard className="p-5 md:p-8 border-[#00F0FF]/20 bg-[#00F0FF]/[0.03]">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                Discovery Summary
              </p>
              <p className={`mt-3 text-4xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                {healthDisplay}
              </p>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#00F0FF]">
                Tenant Health Score
              </p>
              <div className="mt-3">
                <DataSourceBadge mode="live" />
              </div>
            </div>
            <div>
              <p className={`text-sm font-semibold ${isDaylight ? 'text-slate-700' : 'text-slate-200'}`}>
                {healthLabel === 'not_enough_data'
                  ? `Aethos is warming up. We have indexed ${totalFiles.toLocaleString()} files, but need at least 50 files and 3 sites to calculate a reliable Health Score.`
                  : `Your score is mainly impacted by ${reportSummary.globalRisk.primaryRiskFactor}.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(reportSummary.healthScore.drivers.length > 0
                  ? reportSummary.healthScore.drivers
                  : ['Path to Value', `Maturity: ${maturity}`]
                ).map((driver) => (
                  <span
                    key={driver}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    {driver}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => healthLabel === 'not_enough_data'
                ? openAppTab('admin')
                : onOpenSignalQueue?.()
              }
              className="min-h-[44px] rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#0B0F19] transition hover:bg-[#00F0FF]"
            >
              {healthLabel === 'not_enough_data' ? 'Expand Discovery' : 'View Signal Queue'}
            </button>
          </div>
        </GlassCard>
      )}

      {shouldShowPathToValue && reportSummary && (
        <GlassCard className="p-5 md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                Path To Value
              </p>
              <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Complete Your First Reliable Report
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Aethos is connected, but this tenant needs broader discovery coverage before we calculate a reliable health score.
              </p>
            </div>
            <span className="w-fit rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">
              {reportSummary.discovery.totalFiles.toLocaleString()} files / {reportSummary.discovery.totalSites.toLocaleString()} sites
            </span>
            <DataSourceBadge mode="live" />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
            {[
              {
                label: 'Connect Microsoft',
                detail: 'Live tenant session is active.',
                complete: true,
                action: 'Admin',
                tab: 'admin',
              },
              {
                label: 'Confirm Permissions',
                detail: 'Review tenant capability status.',
                complete: reportSummary.lastScan.status !== 'failed',
                action: 'Admin',
                tab: 'admin',
              },
              {
                label: 'Run Discovery',
                detail: 'Target at least 50 files and 3 sites.',
                complete: reportSummary.discovery.totalFiles >= 50 && reportSummary.discovery.totalSites >= 3,
                action: 'Run Scan',
                tab: 'admin',
              },
              {
                label: 'Review First Report',
                detail: 'Verify indexed files, owners, and risk.',
                complete: reportSummary.discovery.totalFiles > 0,
                action: 'Reports',
                tab: 'insights',
              },
              {
                label: 'Create Workspace',
                detail: 'Start organizing even before risk appears.',
                complete: false,
                action: 'Workspace',
                tab: 'nexus',
              },
            ].map((step, index) => (
              <button
                key={step.label}
                onClick={() => openAppTab(step.tab)}
                className={`min-h-[140px] rounded-xl border p-4 text-left transition hover:border-[#00F0FF]/40 ${
                  isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-black ${
                    step.complete
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/10 bg-white/[0.04] text-slate-500'
                  }`}>
                    {step.complete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {step.action}
                  </span>
                </div>
                <p className={`text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {step.label}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {step.detail}
                </p>
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric) => (
          <GlassCard key={metric.id} className="p-5 md:p-6 relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                {isDemoMode ? (
                  <DataSourceBadge mode="demo" />
                ) : (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    metric.trend === 'up'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {metric.change}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  {metric.label}
                </p>
                <p className={`text-2xl md:text-3xl font-black tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {metric.value}
                </p>
                <p className="text-[9px] text-slate-500 mt-2 italic">
                  {metric.description}
                </p>
                {!isDemoMode && (
                  <p className="mt-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Data source: Live tenant
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {!isDemoMode && reportSummary && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <GlassCard className="xl:col-span-2 p-5 md:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                  Ownership & Offboarding Risk
                </p>
                <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Owner Liability Queue
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Owner metadata coverage: {reportSummary.ownership.ownerMetadataCoverage.coveragePercent}% ({reportSummary.ownership.ownerMetadataCoverage.status})
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Owner status enrichment: {ownerStatusCoverage?.ownersWithStatus ?? 0} synced
                  {ownerStatusCoverage?.permissionRequired ? `, ${ownerStatusCoverage.permissionRequired} need permission` : ''}
                  {ownerStatusCoverage?.disabledOwners ? `, ${ownerStatusCoverage.disabledOwners} disabled` : ''}
                  {ownerStatusCoverage?.lastCheckedAt ? ` | Last checked ${formatDate(ownerStatusCoverage.lastCheckedAt)}` : ''}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <DataSourceBadge mode="live" />
                <button
                  onClick={() => void handleOwnerStatusSync()}
                  disabled={isSyncingOwners}
                  className={`min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 transition hover:border-[#00F0FF]/40 hover:text-white ${
                    isSyncingOwners ? 'cursor-wait opacity-60' : ''
                  }`}
                >
                  {isSyncingOwners ? 'Syncing Owners' : 'Sync Owner Status'}
                </button>
              </div>
            </div>

            {reportSummary.ownership.topRiskOwners.length > 0 ? (
              <div className="space-y-3">
                {reportSummary.ownership.topRiskOwners.slice(0, 5).map((owner, index) => {
                  const color = getScoreColor(owner.ownerLiabilityScore);
                  return (
                    <div
                      key={owner.ownerEmail || owner.ownerName || index}
                      className={`rounded-xl border p-4 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                              style={{ backgroundColor: `${color}18`, color }}
                            >
                              OLS {owner.ownerLiabilityScore}/100
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {owner.primaryRiskFactor}
                            </span>
                            <span
                              className="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                              style={{
                                backgroundColor: `${getOwnerStatusColor(owner.ownerStatus)}18`,
                                color: getOwnerStatusColor(owner.ownerStatus),
                              }}
                            >
                              {formatOwnerStatus(owner.ownerStatus || owner.ownerLookupStatus)}
                            </span>
                          </div>
                          <p className={`mt-3 truncate text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                            {owner.ownerName || owner.ownerEmail || 'Unknown Owner'}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {owner.ownerEmail || 'No owner metadata available'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:min-w-[420px]">
                          {[
                            ['Files', owner.fileCount],
                            ['External', owner.externalShareCount],
                            ['High Risk', owner.highRiskCount],
                            ['Stale', owner.staleCount],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-lg bg-white/[0.04] p-3">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                              <p className={`mt-1 text-lg font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                        <button
                          onClick={() => openAppTab('nexus')}
                          className="min-h-[40px] rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#0B0F19] transition hover:bg-[#00F0FF]"
                        >
                          Handoff Workspace
                        </button>
                        <button
                          onClick={() => openRemediation(owner.missingOwnerCount > 0 ? 'missing_owner' : owner.externalShareCount > 0 ? 'external_share' : owner.staleCount > 0 ? 'stale' : 'high_risk')}
                          className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 transition hover:border-[#00F0FF]/40 hover:text-white"
                        >
                          Review Files
                        </button>
                        <span className="flex items-center text-[10px] leading-5 text-slate-500">
                          Workspace creation keeps source files in Microsoft 365 and collects context for stewardship.
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className={`text-sm font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {ownerMetadataState === 'missing_owner_metadata'
                    ? 'Owner metadata not available yet'
                    : 'No owner groups yet'}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {ownerMetadataState === 'missing_owner_metadata'
                    ? 'Aethos indexed files, but Microsoft Graph did not return usable owner fields for this scan. Review missing-owner candidates and confirm discovery permissions before treating this as departed-user risk.'
                    : 'Run Discovery against SharePoint, Teams, and OneDrive to populate owner liability.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => ownerMetadataState === 'missing_owner_metadata' ? openRemediation('missing_owner') : openAppTab('admin')}
                    className="min-h-[40px] rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#0B0F19] transition hover:bg-[#00F0FF]"
                  >
                    {ownerMetadataState === 'missing_owner_metadata' ? 'Review Missing Owners' : 'Run Discovery'}
                  </button>
                  <button
                    onClick={() => openAppTab('admin')}
                    className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 transition hover:border-[#00F0FF]/40 hover:text-white"
                  >
                    Check Permissions
                  </button>
                </div>
              </div>
            )}
          </GlassCard>

          {reportSummary.ownership.ownerStatusReview.reviewRequiredOwners > 0 && (
            <GlassCard className="xl:col-span-3 p-5 md:p-8 border-[#F59E0B]/20">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                    V1.5 Owner Status Review
                  </p>
                  <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    Inactive Owner Candidates
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    These owner groups have cached Entra status evidence such as disabled or not-found accounts. Aethos recommends review and handoff before cleanup.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <DataSourceBadge mode="live" />
                  <span className="rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#F59E0B]">
                    {reportSummary.ownership.ownerStatusReview.reviewRequiredOwners} owner{reportSummary.ownership.ownerStatusReview.reviewRequiredOwners === 1 ? '' : 's'} need review
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {reportSummary.ownership.ownerStatusReview.topOwners.map((owner) => (
                  <div
                    key={owner.ownerEmail}
                    className={`rounded-xl border p-5 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                        style={{
                          backgroundColor: `${getOwnerStatusColor(owner.status)}18`,
                          color: getOwnerStatusColor(owner.status),
                        }}
                      >
                        {formatOwnerStatus(owner.status)}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        OLS {owner.ownerLiabilityScore}/100
                      </span>
                    </div>
                    <p className={`truncate text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      {owner.ownerName || owner.ownerEmail}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">{owner.ownerEmail}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        ['Files', owner.fileCount],
                        ['External', owner.externalShareCount],
                        ['High Risk', owner.highRiskCount],
                        ['Stale', owner.staleCount],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-white/[0.04] p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                          <p className={`mt-1 text-lg font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openAppTab('nexus')}
                        className="min-h-[40px] rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#0B0F19] transition hover:bg-[#00F0FF]"
                      >
                        Handoff Workspace
                      </button>
                      <button
                        onClick={() => openRemediation(owner.externalShareCount > 0 ? 'external_share' : owner.staleCount > 0 ? 'stale' : 'high_risk')}
                        className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 transition hover:border-[#00F0FF]/40 hover:text-white"
                      >
                        Review Files
                      </button>
                      <span className="text-[10px] leading-5 text-slate-500">
                        Review-first. No Microsoft 365 changes are made from this report.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="p-5 md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                  Discovery Reports
                </p>
                <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Risk Snapshot
                </h3>
              </div>
              <div className="flex flex-col items-end gap-3">
                <DataSourceBadge mode="live" />
                <ShieldAlert className="h-5 w-5 text-[#FF5733]" />
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'External Shares',
                  value: reportSummary.risk.externallySharedFiles,
                  helper: 'Exposure Review',
                  color: '#FF5733',
                  issue: 'external_share',
                },
                {
                  label: 'Missing Owners',
                  value: reportSummary.risk.missingOwnerFiles,
                  helper: 'Ownership Review',
                  color: '#A855F7',
                  issue: 'missing_owner',
                },
                {
                  label: 'High-Risk Files',
                  value: reportSummary.risk.highRiskFiles,
                  helper: 'Critical Knowledge Exposure',
                  color: '#F59E0B',
                  issue: 'high_risk',
                },
                {
                  label: 'Stale Storage',
                  value: formatBytes(reportSummary.risk.staleBytes),
                  helper: `${reportSummary.risk.staleFiles.toLocaleString()} stale files`,
                  color: '#10B981',
                  issue: 'stale',
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => openRemediation(item.issue)}
                  className={`w-full rounded-xl border p-4 text-left transition hover:border-[#00F0FF]/40 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                      <p className={`mt-1 text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                      </p>
                    </div>
                    <div className="h-10 w-1 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {item.helper}
                  </p>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {!isDemoMode && reportSummary && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              title: 'Exposure Review',
              eyebrow: 'Unsecured External Shares',
              description: 'Externally shared files that deserve review before they become an incident.',
              issue: 'external_share',
              empty: 'No externally shared files are currently indexed.',
              files: reportSummary.exposureReview.topFiles,
              summaryStats: [
                ['External Users', reportSummary.exposureReview.externalUsersTotal.toLocaleString()],
                ['Stale & Shared', reportSummary.exposureReview.externalSharesOnStaleFiles.toLocaleString()],
              ],
              providerBreakdown: reportSummary.exposureReview.providerBreakdown,
              ownerBreakdown: reportSummary.exposureReview.ownerBreakdown,
              accent: '#FF5733',
              meta: (file: ReportSummaryResponse['summary']['exposureReview']['topFiles'][number]) =>
                `${file.externalUserCount.toLocaleString()} external user${file.externalUserCount === 1 ? '' : 's'} | Risk ${file.riskScore}/100`,
            },
            {
              title: 'Stale Content Review',
              eyebrow: 'Accumulated Stale Burden',
              description: 'Old content that may need archive, ownership handoff, or workspace cleanup.',
              issue: 'stale',
              empty: 'No stale files are currently indexed.',
              files: reportSummary.staleContentReview.topFiles,
              summaryStats: [
                ['Stale Files', reportSummary.risk.staleFiles.toLocaleString()],
                ['Stale Storage', formatBytes(reportSummary.risk.staleBytes)],
              ],
              providerBreakdown: reportSummary.staleContentReview.providerBreakdown,
              ownerBreakdown: reportSummary.staleContentReview.ownerBreakdown,
              accent: '#10B981',
              meta: (file: ReportSummaryResponse['summary']['staleContentReview']['topFiles'][number]) =>
                `${formatBytes(file.sizeBytes)} | Modified ${formatDate(file.modifiedAt)}`,
            },
          ].map((card) => (
            <GlassCard key={card.title} className="p-5 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                  {card.eyebrow}
                  </p>
                  <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {card.title}
                  </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {card.description}
                </p>
              </div>
                <div className="flex flex-col items-end gap-3">
                  <DataSourceBadge mode="live" />
                  <button
                    onClick={() => openRemediation(card.issue)}
                    className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.04] px-3 text-[9px] font-black uppercase tracking-widest text-slate-300 transition hover:border-[#00F0FF]/40 hover:text-white"
                  >
                    Review
                  </button>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {card.summaryStats.map(([label, value]) => (
                  <div
                    key={label}
                    className={`rounded-xl border p-4 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
                  >
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {label}
                    </p>
                    <p className={`mt-1 text-xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {[
                  ['Provider Pattern', card.providerBreakdown],
                  ['Owner Pattern', card.ownerBreakdown],
                ].map(([label, buckets]) => (
                  <div
                    key={label as string}
                    className={`rounded-xl border p-4 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
                  >
                    <p className="mb-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {label as string}
                    </p>
                    {(buckets as ReportSummaryResponse['summary']['exposureReview']['providerBreakdown']).length > 0 ? (
                      <div className="space-y-2">
                        {(buckets as ReportSummaryResponse['summary']['exposureReview']['providerBreakdown']).slice(0, 3).map((bucket) => (
                          <div key={bucket.label} className="flex items-center justify-between gap-3 text-xs">
                            <span className={`truncate font-semibold ${isDaylight ? 'text-slate-700' : 'text-slate-300'}`}>
                              {bucket.label}
                            </span>
                            <span className="shrink-0 font-black text-slate-500">
                              {bucket.fileCount.toLocaleString()} files
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No pattern available yet.</p>
                    )}
                  </div>
                ))}
              </div>

              {card.files.length > 0 ? (
                <div className="space-y-3">
                  {card.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => openRemediation(card.issue)}
                      className={`w-full rounded-xl border p-4 text-left transition hover:border-[#00F0FF]/40 ${
                        isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className={`truncate text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                            {file.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {file.ownerName || file.ownerEmail || 'Unknown owner'} | {file.providerType || 'microsoft'}
                          </p>
                          <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {card.meta(file as any)}
                          </p>
                        </div>
                        <div className="h-10 w-1 shrink-0 rounded-full" style={{ backgroundColor: card.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                  {card.empty}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {!isDemoMode && reportSummary && (
        <GlassCard className="p-5 md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                Workspace Opportunities
              </p>
              <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Turn Discovery Into Working Context
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Suggested workspaces collect related review items without moving source files.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <DataSourceBadge mode="live" />
              <button
                onClick={() => openAppTab('nexus')}
                className="min-h-[44px] rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#0B0F19] transition hover:bg-[#00F0FF]"
              >
                Open Workspaces
              </button>
            </div>
          </div>

          {reportSummary.workspaceOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {reportSummary.workspaceOpportunities.slice(0, 3).map((opportunity) => (
                <button
                  key={opportunity.label}
                  onClick={() => openAppTab('nexus')}
                  className={`min-h-[180px] rounded-xl border p-5 text-left transition hover:border-[#00F0FF]/40 ${
                    isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="rounded-lg border border-[#00F0FF]/20 bg-[#00F0FF]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">
                      {opportunity.fileCount.toLocaleString()} files
                    </div>
                    <Database className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className={`text-base font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {opportunity.label}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {opportunity.reason}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {opportunity.suggestedTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
              No workspace opportunities yet. Run Discovery or review files in Search to create a manual workspace.
            </div>
          )}
        </GlassCard>
      )}

      {!isDemoMode && reportSummary && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <GlassCard className="p-5 md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                  Remediation Dry Run
                </p>
                <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Reviewed Before Action
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Dry runs log intent and affected files without changing Microsoft 365.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <DataSourceBadge mode="live" />
                <button
                  onClick={() => openAppTab('archival')}
                  className="min-h-[44px] rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#0B0F19] transition hover:bg-[#00F0FF]"
                >
                  Open Remediation
                </button>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/10 p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">
                No destructive action taken by default
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {reportSummary.remediationDryRun.totalDryRuns.toLocaleString()} dry-run review{reportSummary.remediationDryRun.totalDryRuns === 1 ? '' : 's'} logged for this tenant.
              </p>
            </div>

            {reportSummary.remediationDryRun.recentDryRuns.length > 0 ? (
              <div className="space-y-3">
                {reportSummary.remediationDryRun.recentDryRuns.map((dryRun) => (
                  <button
                    key={dryRun.id}
                    onClick={() => openAppTab('archival')}
                    className={`w-full rounded-xl border p-4 text-left transition hover:border-[#00F0FF]/40 ${
                      isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className={`text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                          {formatAction(dryRun.actionType)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {dryRun.fileCount.toLocaleString()} files | {dryRun.status} | {formatDate(dryRun.executedAt)}
                        </p>
                      </div>
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        Dry Run
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                No dry-run history yet. Select candidates in Remediation and run a dry-run to create a reviewed action record.
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5 md:p-8">
            <div className="mb-6">
              <div className="mb-4">
                <DataSourceBadge mode="live" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                V1.5 Identity Readiness
              </p>
              <h3 className={`mt-2 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Owner Status Enrichment
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                V1 groups content by owner. V1.5 adds Entra status enrichment so Aethos can distinguish active, inactive, departed, deleted, and guest owners when permissions allow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                ['V1 Ready', 'Owner visibility, unknown owner counts, owner liability scoring.'],
                ['V1.5 Spike', 'Lookup Entra account status for top owner-risk groups.'],
                ['Boundary', 'Do not claim departed-user detection until Entra status is connected.'],
              ].map(([label, detail]) => (
                <div
                  key={label}
                  className={`rounded-xl border p-4 ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <GlassCard className="p-5 md:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center justify-between">
              <span>Recent Activity</span>
              <span className="flex items-center gap-3">
                <DataSourceBadge mode={isDemoMode ? 'demo' : 'live'} />
                <Activity className="w-4 h-4 text-[#00F0FF]" />
              </span>
            </h3>
            <div className="space-y-4">
              {(isDemoMode ? recentActivity : liveActivity).map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-white/5 ${
                    isDaylight ? 'bg-slate-50/50' : 'bg-white/[0.02]'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    activity.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : activity.type === 'warning'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-[#00F0FF]/10 text-[#00F0FF]'
                  }`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {!isDemoMode && !isLoadingSummary && liveActivity.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  No live intelligence activity yet. Run Microsoft Discovery to populate tenant metrics.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Provider Status */}
        <div>
          <GlassCard className="p-5 md:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center justify-between">
              <span>Provider Status</span>
              <span className="flex items-center gap-3">
                <DataSourceBadge mode={isDemoMode ? 'demo' : 'live'} />
                <Database className="w-4 h-4 text-[#00F0FF]" />
              </span>
            </h3>
            <div className="space-y-4">
              {providerStatus.map((provider) => (
                <div 
                  key={provider.name}
                  className={`p-4 rounded-xl ${
                    isDaylight ? 'bg-slate-50/50' : 'bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <span className={`text-xs font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      {provider.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        {provider.assets} assets
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        {provider.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-5 md:p-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center justify-between">
          <span>Quick Actions</span>
          <DataSourceBadge mode={isDemoMode ? 'demo' : 'live'} />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="min-h-[44px] p-5 md:p-6 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 hover:bg-[#00F0FF]/10 transition-all text-left group">
            <Brain className="w-6 h-6 text-[#00F0FF] mb-4 group-hover:scale-110 transition-transform" />
            <p className={`text-sm font-bold mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              {isDemoMode ? 'Enrich Metadata' : 'Review Metadata'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              {isDemoMode ? 'AI-powered tagging' : 'Quality and AI readiness'}
            </p>
          </button>

          <button className="min-h-[44px] p-5 md:p-6 rounded-2xl bg-[#A855F7]/5 border border-[#A855F7]/20 hover:bg-[#A855F7]/10 transition-all text-left group">
            <Fingerprint className="w-6 h-6 text-[#A855F7] mb-4 group-hover:scale-110 transition-transform" />
            <p className={`text-sm font-bold mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              {isDemoMode ? 'Reconcile Identities' : 'Review Owners'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              {isDemoMode ? '3 pending matches' : 'Offboarding risk'}
            </p>
          </button>

          <button className="min-h-[44px] p-5 md:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all text-left group">
            <TrendingUp className="w-6 h-6 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className={`text-sm font-bold mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              {isDemoMode ? 'Review Waste' : 'Open Remediation'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              {isDemoMode ? '2.4TB identified' : 'Dry-run first'}
            </p>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
