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
import { getReportSummary, type ReportSummaryResponse } from '@/lib/api';
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

function openRemediation(issue?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab: 'archival', issue },
  }));
}

export const IntelligenceDashboard = () => {
  const { isDaylight } = useTheme();
  const { isDemoMode } = useVersion();
  const [activeView, setActiveView] = useState<IntelligenceView>('dashboard');

  const views = [
    { id: 'dashboard' as IntelligenceView, label: 'Overview', icon: Sparkles },
    { id: 'stream' as IntelligenceView, label: 'Stream', icon: Activity },
    { id: 'metadata' as IntelligenceView, label: 'Metadata', icon: Brain },
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
        return <OverviewDashboard />;
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

const OverviewDashboard = () => {
  const { isDaylight } = useTheme();
  const { version, isDemoMode } = useVersion();
  const { getAccessToken } = useAuth();
  const hasSlack = useFeature('slackIntegration');
  const hasGoogle = useFeature('googleWorkspaceShadow');
  const hasBox = useFeature('boxShadowDiscovery');
  const [reportSummary, setReportSummary] = useState<ReportSummaryResponse['summary'] | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

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
        <GlassCard className="p-5 md:p-8 border-[#00F0FF]/20 bg-[#00F0FF]/[0.03]">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                Data source: Live tenant
              </p>
              <p className={`mt-3 text-4xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                {healthDisplay}
              </p>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#00F0FF]">
                Tenant Health Score
              </p>
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
              onClick={() => openRemediation(reportSummary.riskDrivers[0]?.filterTarget.split('issue=')[1])}
              className="min-h-[44px] rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#0B0F19] transition hover:bg-[#00F0FF]"
            >
              {healthLabel === 'not_enough_data' ? 'Expand Discovery' : 'View Signal Queue'}
            </button>
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
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  metric.trend === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {metric.change}
                </span>
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
              </div>
              <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                Data source: Live tenant
              </span>
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                No owner groups are available yet. Run Discovery against SharePoint, Teams, and OneDrive to populate owner liability.
              </div>
            )}
          </GlassCard>

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
              <ShieldAlert className="h-5 w-5 text-[#FF5733]" />
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <GlassCard className="p-5 md:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center justify-between">
              Recent Activity
              <Activity className="w-4 h-4 text-[#00F0FF]" />
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
              Provider Status
              <Database className="w-4 h-4 text-[#00F0FF]" />
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
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">
          Quick Actions
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
