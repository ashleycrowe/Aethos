import React, { useCallback, useEffect, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Info, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Shield, 
  Zap,
  Clock,
  Database,
  FileText,
  Loader2,
  Trash2,
  Share2,
  Filter
} from 'lucide-react';
import { useOracle, OracleInsight } from '../context/OracleContext';
import { useTheme } from '../context/ThemeContext';
import { useVersion } from '@/app/context/VersionContext';
import { useAuth } from '@/app/context/AuthContext';
import { getReportSummary, type ReportSummaryResponse } from '@/lib/api';
import { GlassCard } from './GlassCard';

type LiveSignal = {
  id: string;
  filter: 'waste' | 'identity' | 'governance';
  title: string;
  narrative: string;
  metric: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  actionLabel: string;
  action: () => void;
};

function openAppTab(tab: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab },
  }));
}

function openRemediation(issue?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab: 'archival', issue },
  }));
}

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

function impactFromValue(value: number): LiveSignal['impact'] {
  if (value >= 75) return 'critical';
  if (value >= 45) return 'high';
  if (value >= 20) return 'medium';
  return 'low';
}

function buildLiveSignals(summary: ReportSummaryResponse['summary']): LiveSignal[] {
  const signals: LiveSignal[] = [];

  if (summary.lastScan.status === 'none') {
    signals.push({
      id: 'run-first-discovery',
      filter: 'governance',
      title: 'Run first Microsoft Discovery',
      narrative: 'Aethos is connected, but no persisted discovery scan has completed yet. Run Discovery to populate tenant-backed reports.',
      metric: 'No completed scan',
      impact: 'medium',
      actionLabel: 'Open Admin',
      action: () => openAppTab('admin'),
    });
  }

  if (summary.lastScan.status === 'running') {
    signals.push({
      id: 'scan-running',
      filter: 'governance',
      title: 'Discovery scan is running',
      narrative: 'Aethos is collecting Microsoft 365 metadata. Return here after completion to review prioritized signals.',
      metric: `${summary.lastScan.filesDiscovered.toLocaleString()} files so far`,
      impact: 'low',
      actionLabel: 'Open Admin',
      action: () => openAppTab('admin'),
    });
  }

  if (summary.lastScan.status === 'failed' || summary.lastScan.status === 'partial') {
    signals.push({
      id: 'scan-needs-review',
      filter: 'governance',
      title: 'Discovery scan needs review',
      narrative: 'The latest scan did not finish cleanly. Review errors before relying on report coverage.',
      metric: `${summary.lastScan.errorCount.toLocaleString()} errors`,
      impact: summary.lastScan.status === 'failed' ? 'high' : 'medium',
      actionLabel: 'Review Scan',
      action: () => openAppTab('admin'),
    });
  }

  if (summary.risk.externallySharedFiles > 0) {
    signals.push({
      id: 'external-shares',
      filter: 'governance',
      title: 'Unsecured External Shares',
      narrative: 'Externally shared files are indexed and ready for security review before any link revocation is attempted.',
      metric: `${summary.risk.externallySharedFiles.toLocaleString()} files`,
      impact: impactFromValue(summary.risk.externallySharedFiles),
      actionLabel: 'Review Exposure',
      action: () => openRemediation('external_share'),
    });
  }

  if (summary.risk.missingOwnerFiles > 0) {
    signals.push({
      id: 'missing-owners',
      filter: 'identity',
      title: 'Unmanaged Knowledge Gaps',
      narrative: 'Some indexed files have missing owner metadata. Assign stewardship before cleanup or offboarding decisions.',
      metric: `${summary.risk.missingOwnerFiles.toLocaleString()} files`,
      impact: impactFromValue(summary.risk.missingOwnerFiles),
      actionLabel: 'Review Owners',
      action: () => openRemediation('missing_owner'),
    });
  }

  if (summary.risk.highRiskFiles > 0) {
    signals.push({
      id: 'high-risk-files',
      filter: 'governance',
      title: 'Critical Knowledge Exposure',
      narrative: 'High-risk files are indexed. Preserve context and reduce exposure before considering cleanup.',
      metric: `${summary.risk.highRiskFiles.toLocaleString()} files`,
      impact: impactFromValue(summary.risk.highRiskFiles),
      actionLabel: 'Review Risk',
      action: () => openRemediation('high_risk'),
    });
  }

  if (summary.risk.staleFiles > 0) {
    signals.push({
      id: 'stale-content',
      filter: 'waste',
      title: 'Accumulated Stale Burden',
      narrative: 'Old content may be creating search noise and handoff risk. Start with archive review, not deletion.',
      metric: `${summary.risk.staleFiles.toLocaleString()} files / ${formatBytes(summary.risk.staleBytes)}`,
      impact: impactFromValue(summary.risk.staleFiles),
      actionLabel: 'Review Stale',
      action: () => openRemediation('stale'),
    });
  }

  summary.workspaceOpportunities.slice(0, 2).forEach((opportunity) => {
    signals.push({
      id: `workspace-${opportunity.label}`,
      filter: 'governance',
      title: opportunity.label,
      narrative: opportunity.reason,
      metric: `${opportunity.fileCount.toLocaleString()} files`,
      impact: 'low',
      actionLabel: 'Open Workspaces',
      action: () => openAppTab('nexus'),
    });
  });

  if (signals.length === 0 && summary.discovery.totalFiles > 0) {
    signals.push({
      id: 'healthy-tenant',
      filter: 'governance',
      title: 'Discovery is ready for action',
      narrative: 'Aethos has tenant-backed metadata and no major signal queue items. Use Search or Workspaces to turn the inventory into working context.',
      metric: `${summary.discovery.totalFiles.toLocaleString()} files indexed`,
      impact: 'low',
      actionLabel: 'Open Workspaces',
      action: () => openAppTab('nexus'),
    });
  }

  return signals;
}

export const IntelligenceStream = () => {
  const { insights } = useOracle();
  const { isDaylight } = useTheme();
  const { isDemoMode } = useVersion();
  const { getAccessToken } = useAuth();
  const [filter, setFilter] = useState<'all' | 'waste' | 'identity' | 'governance'>('all');
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [liveSummary, setLiveSummary] = useState<ReportSummaryResponse['summary'] | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const loadLiveSignals = useCallback(async () => {
    if (isDemoMode) {
      setLiveSummary(null);
      setLiveError(null);
      return;
    }

    try {
      setIsLoadingLive(true);
      setLiveError(null);
      const response = await getReportSummary({ accessToken: await getAccessToken() });
      setLiveSummary(response.summary);
    } catch (error) {
      setLiveError(error instanceof Error ? error.message : 'Unable to load live signal queue');
    } finally {
      setIsLoadingLive(false);
    }
  }, [getAccessToken, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
      setLiveSummary(null);
      setLiveError(null);
      return;
    }

    let cancelled = false;
    const loadInitialLiveSignals = async () => {
      try {
        setIsLoadingLive(true);
        setLiveError(null);
        const response = await getReportSummary({ accessToken: await getAccessToken() });
        if (!cancelled) setLiveSummary(response.summary);
      } catch (error) {
        if (!cancelled) setLiveError(error instanceof Error ? error.message : 'Unable to load live signal queue');
      } finally {
        if (!cancelled) setIsLoadingLive(false);
      }
    };

    void loadInitialLiveSignals();
    return () => {
      cancelled = true;
    };
  }, [getAccessToken, isDemoMode]);

  const liveSignals = liveSummary ? buildLiveSignals(liveSummary) : [];
  const filteredSignals = liveSignals.filter((signal) => filter === 'all' || signal.filter === filter);
  const liveSignalCount = liveSignals.length;
  const sourceInsights = isDemoMode ? insights : [];
  const filteredInsights = sourceInsights.filter(ins => filter === 'all' || ins.type === filter);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
        {/* Intelligence Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                {isDemoMode ? 'Demo Intelligence Stream' : 'Live Signal Queue'}
              </h2>
            </div>
            <h1 className={`text-fluid-3xl font-black uppercase tracking-tighter leading-[0.8] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              Operational<br /><span className="text-[#00F0FF]">{isDemoMode ? 'Insights' : 'Signal Queue'}</span>
            </h1>
            <div className="flex items-center gap-6">
              <p className={`text-sm ${isDaylight ? 'text-slate-500' : 'text-slate-400'} max-w-xl italic font-medium leading-relaxed`}>
                {isDemoMode
                  ? '"Predictive heuristics identifying Dead Capital, Identity Decay, and Workspace Drag in real-time."'
                  : 'Live intelligence will populate after Microsoft Discovery and enrichment generate tenant-specific signals.'}
              </p>
              <span className={`hidden sm:inline-flex w-fit rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                isDemoMode
                  ? 'border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              }`}>
                Data source: {isDemoMode ? 'Demo fixtures' : 'Live tenant'}
              </span>
              <div className="w-px h-10 bg-white/10" />
              {isDemoMode ? (
                <button
                  type="button"
                  onClick={() => setIsStoryMode(!isStoryMode)}
                  className={`flex min-h-11 items-center gap-3 rounded-2xl border px-6 py-3 transition-all ${isStoryMode ? 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                >
                  <Cpu size={14} className={isStoryMode ? 'animate-pulse' : ''} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{isStoryMode ? 'Story Mode Active' : 'Enable Story Mode'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void loadLiveSignals()}
                  disabled={isLoadingLive}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-emerald-400 transition-all hover:border-[#00F0FF]/40 hover:text-[#00F0FF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingLive ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {isLoadingLive ? 'Refreshing Signals' : 'Refresh Live Signals'}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className={`flex items-center p-1.5 rounded-2xl border transition-all shrink-0 ${isDaylight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
            {(['all', 'waste', 'identity', 'governance'] as const).map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all ${
                  filter === f 
                    ? (isDaylight ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-black shadow-xl') 
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Insights Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Main Feed */}
          <div className="xl:col-span-8 space-y-8">
            {!isDemoMode ? (
              <AnimatePresence mode="popLayout">
                {isLoadingLive ? (
                  <GlassCard className="p-10 border border-white/10 bg-white/[0.03]">
                    <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin text-[#00F0FF]" />
                      <span className="text-sm font-black uppercase tracking-widest">Loading live signal queue</span>
                    </div>
                  </GlassCard>
                ) : liveError ? (
                  <GlassCard className="p-10 border border-[#FF5733]/30 bg-[#FF5733]/5">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <AlertCircle className="mb-5 h-10 w-10 text-[#FF5733]" />
                      <h3 className={`mb-3 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        Signal Queue Unavailable
                      </h3>
                      <p className="max-w-xl text-sm leading-6 text-slate-500">
                        {liveError}. Run Microsoft Discovery from Admin or check the report-summary API configuration.
                      </p>
                    </div>
                  </GlassCard>
                ) : filteredSignals.length > 0 ? (
                  filteredSignals.map((signal, idx) => (
                    <LiveSignalCard key={signal.id} signal={signal} index={idx} isDaylight={isDaylight} />
                  ))
                ) : (
                  <GlassCard className="p-10 border border-white/10 bg-white/[0.03]">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Sparkles className="mb-5 h-10 w-10 text-[#00F0FF]" />
                      <h3 className={`mb-3 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        No Signals Match This Filter
                      </h3>
                      <p className="max-w-xl text-sm leading-6 text-slate-500">
                        Try All, or run Microsoft Discovery again if you expect new risk, ownership, or stale-content signals.
                      </p>
                    </div>
                  </GlassCard>
                )}
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map((insight, idx) => (
                    <InsightCard key={insight.id} insight={insight} index={idx} isDaylight={isDaylight} isStoryMode={isStoryMode} />
                  ))
              ) : (
                <GlassCard className="p-10 border border-white/10 bg-white/[0.03]">
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Sparkles className="mb-5 h-10 w-10 text-[#00F0FF]" />
                    <h3 className={`mb-3 text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      No Demo Insights Match This Filter
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-slate-500">
                      Try All or switch to a different demo insight type. Live tenant recommendations stay hidden
                      until Live Mode is active.
                    </p>
                  </div>
                </GlassCard>
              )}
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar: Operational Velocity */}
          <div className="xl:col-span-4 space-y-8">
            <GlassCard className="p-8 space-y-8 sticky top-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                {isDemoMode ? 'System Metrics' : 'Queue Metrics'}
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {isDemoMode ? 'Inference Confidence' : 'Open Signals'}
                    </span>
                    <span className="text-xl font-black text-white font-mono">{isDemoMode ? '98.4%' : liveSignalCount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" style={{ width: isDemoMode ? '98.4%' : `${Math.min(100, liveSignalCount * 18)}%` }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {isDemoMode ? 'Reconciliation Velocity' : 'Discovery Coverage'}
                    </span>
                    <span className="text-xl font-black text-white font-mono">
                      {isDemoMode ? '1.2s' : liveSummary ? `${liveSummary.discovery.totalFiles.toLocaleString()} files` : 'Pending'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: isDemoMode ? '85%' : liveSummary?.discovery.totalFiles ? '75%' : '0%' }} />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <h4 className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Architect Tip</h4>
                <p className="text-[11px] text-slate-400 italic leading-relaxed">
                  {isDemoMode
                    ? "Oracle insights are prioritized by capital recovery potential. Focus on high-impact flags to maximize 30-day ROI."
                    : 'Live signals are generated from report-summary counts and route to reviewed remediation, Admin scan status, or Workspaces.'}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveSignalCard = ({ signal, index, isDaylight }: { signal: LiveSignal; index: number; isDaylight: boolean }) => {
  const color =
    signal.impact === 'critical' ? '#FF5733' :
    signal.impact === 'high' ? '#F59E0B' :
    signal.impact === 'medium' ? '#00F0FF' :
    '#10B981';
  const Icon =
    signal.filter === 'waste' ? Trash2 :
    signal.filter === 'identity' ? Shield :
    signal.id.includes('discovery') || signal.id.includes('scan') ? Database :
    FileText;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
    >
      <GlassCard
        className="overflow-hidden border p-6 md:p-8 transition-all hover:border-[#00F0FF]/40"
        style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
            style={{ borderColor: `${color}40`, backgroundColor: `${color}18`, color }}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-widest"
                style={{ borderColor: `${color}40`, backgroundColor: `${color}14`, color }}
              >
                {signal.impact}
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-400">
                Data source: Live tenant
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {signal.metric}
              </span>
            </div>

            <h3 className={`text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              {signal.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {signal.narrative}
            </p>
          </div>

          <button
            onClick={signal.action}
            className="min-h-[44px] rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#0B0F19] transition hover:bg-[#00F0FF]"
          >
            {signal.actionLabel}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const InsightCard = forwardRef<HTMLDivElement, { insight: OracleInsight, index: number, isDaylight: boolean, isStoryMode: boolean }>(({ insight, index, isDaylight, isStoryMode }, ref) => {
  const [showLogic, setShowLogic] = useState(false);

  // Auto-show logic if Story Mode is OFF, otherwise hide it behind the CPU icon as per guidelines
  // Actually, guidelines say: "Narrative Logic Layer: Never show raw technical calculations by default. Hide them behind the Cpu or Info icon. Provide a 'Story' version of every metric."
  // So Story mode should probably focus on the NARRATIVE, while Logic mode shows the CALCULATION.
  
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className={`p-10 border group overflow-hidden transition-all duration-500 ${
        insight.impact === 'critical' ? 'border-[#FF5733]/40 bg-[#FF5733]/5' : 
        insight.impact === 'high' ? 'border-[#00F0FF]/40 bg-[#00F0FF]/5' : 
        'border-white/10'
      } ${isStoryMode ? 'ring-1 ring-[#00F0FF]/20 shadow-[0_0_40px_rgba(0,240,255,0.05)]' : ''}`}>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Status Indicator */}
          <div className="flex flex-col items-center gap-4 shrink-0">
             <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-700 ${
               isStoryMode ? 'rotate-[360deg] bg-[#00F0FF] text-black border-[#00F0FF]' :
               insight.impact === 'critical' ? 'bg-[#FF5733]/20 border-[#FF5733]/40 text-[#FF5733]' : 
               insight.impact === 'high' ? 'bg-[#00F0FF]/20 border-[#00F0FF]/40 text-[#00F0FF]' : 
               'bg-white/5 border-white/10 text-slate-400'
             }`}>
               {isStoryMode ? <Sparkles className="w-8 h-8" /> :
                insight.type === 'waste' ? <Trash2 className="w-8 h-8" /> : 
                insight.type === 'identity' ? <Shield className="w-8 h-8" /> : 
                <Zap className="w-8 h-8" />}
             </div>
             <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
               insight.impact === 'critical' ? 'bg-[#FF5733]/10 border-[#FF5733]/20 text-[#FF5733]' : 
               'bg-white/5 border-white/10 text-slate-500'
             }`}>
               {isStoryMode ? 'STORY' : insight.impact}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                {insight.type} Intelligence • {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex items-center gap-4">
                {isStoryMode && <div className="px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] text-[7px] font-black uppercase tracking-widest">Oracle Optimized</div>}
                <button className="text-slate-600 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className={`text-2xl font-black uppercase tracking-tighter leading-tight transition-all ${isDaylight ? 'text-slate-900' : 'text-white'} ${isStoryMode ? 'text-[#00F0FF]' : ''}`}>
                {isStoryMode ? `The Story of ${insight.title}` : insight.title}
              </h3>
              <p className={`text-sm leading-relaxed italic font-medium transition-all ${isDaylight ? 'text-slate-600' : 'text-slate-400'} ${isStoryMode ? 'text-lg text-white not-italic' : ''}`}>
                {insight.narrative}
              </p>
            </div>

            {/* Hidden Logic Layer */}
            <AnimatePresence>
              {(showLogic || (isStoryMode && !showLogic)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`mt-6 p-6 rounded-2xl border font-mono text-[10px] space-y-2 transition-all ${
                    isStoryMode ? 'bg-[#00F0FF]/5 border-[#00F0FF]/20 text-white font-sans text-xs italic' : 'bg-black/40 border-white/10 text-[#00F0FF]'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isStoryMode ? <Info className="w-3.5 h-3.5 text-[#00F0FF]" /> : <Cpu className="w-3.5 h-3.5" />}
                      <span className="uppercase font-black tracking-widest">
                        {isStoryMode ? 'Operational Context' : 'Heuristic Calculation'}
                      </span>
                    </div>
                    <p className="leading-relaxed opacity-80">
                      {isStoryMode ? `This intelligence was synthesized by the Oracle to help you achieve operational clarity. By acting on this, you move from a "Security Janitor" to an "Operational Architect," ensuring your tenant is optimized for growth rather than maintenance.` : insight.calculation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-white/5">
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogic(!showLogic)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${showLogic ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  {showLogic ? <Info className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  {showLogic ? 'Hide Narrative Logic' : 'Deconstruct Intelligence'}
                </button>
              </div>

              <button className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 ${
                isStoryMode ? 'bg-[#00F0FF] text-black shadow-[0_0_30px_rgba(0,240,255,0.4)]' :
                insight.impact === 'critical' || insight.impact === 'high'
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}>
                {insight.suggestedAction} <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
});

InsightCard.displayName = 'InsightCard';
