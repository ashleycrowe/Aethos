import React, { useState } from 'react';
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
  Loader2
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

type IntelligenceView = 'dashboard' | 'stream' | 'metadata' | 'identity';

export const IntelligenceDashboard = () => {
  const { isDaylight } = useTheme();
  const [activeView, setActiveView] = useState<IntelligenceView>('dashboard');

  const views = [
    { id: 'dashboard' as IntelligenceView, label: 'Overview', icon: Sparkles },
    { id: 'stream' as IntelligenceView, label: 'Stream', icon: Activity },
    { id: 'metadata' as IntelligenceView, label: 'Metadata', icon: Brain },
    { id: 'identity' as IntelligenceView, label: 'Identity', icon: Fingerprint },
  ];

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
  const { version } = useVersion();
  const hasSlack = useFeature('slackIntegration');
  const hasGoogle = useFeature('googleWorkspaceShadow');
  const hasBox = useFeature('boxShadowDiscovery');

  const metrics = [
    {
      id: 'intelligence-score',
      label: 'Intelligence Score',
      value: '92.4%',
      change: '+4.2%',
      trend: 'up',
      icon: Sparkles,
      color: '#00F0FF',
      description: 'Overall metadata quality & enrichment'
    },
    {
      id: 'waste-recovery',
      label: 'Waste Recovery',
      value: '2.4 TB',
      change: '+840 GB',
      trend: 'up',
      icon: TrendingUp,
      color: '#10B981',
      description: 'Dead capital identified this month'
    },
    {
      id: 'identity-health',
      label: 'Identity Health',
      value: '98.1%',
      change: '+0.8%',
      trend: 'up',
      icon: Fingerprint,
      color: '#A855F7',
      description: 'Reconciliation accuracy across providers'
    },
    {
      id: 'sync-status',
      label: 'Sync Status',
      value: version === 'V1' || version === 'V1.5' ? '1/1' : '4/4',
      change: 'All Active',
      trend: 'neutral',
      icon: Zap,
      color: '#F59E0B',
      description: 'Universal adapters operational'
    },
  ];

  const recentActivity = [
    { id: 1, type: 'success', message: 'Microsoft 365 sync completed', time: '2m ago', icon: CheckCircle2 },
    { id: 2, type: 'info', message: '47 new tags enriched via AI', time: '12m ago', icon: Brain },
    { id: 3, type: 'warning', message: 'Identity reconciliation needed for 3 users', time: '1h ago', icon: AlertCircle },
    { id: 4, type: 'success', message: 'Workspace "Project Phoenix" created', time: '2h ago', icon: CheckCircle2 },
    { id: 5, type: 'info', message: 'Metadata quality improved to 92.4%', time: '3h ago', icon: Sparkles },
  ];

  // V1: Microsoft 365 only
  // V2+: Add Slack, Google Workspace
  // V3+: Add Box
  const allProviders = [
    { name: 'Microsoft 365', status: 'active', assets: '12.4K', lastSync: '2m ago', version: 'V1' },
    { name: 'Slack', status: 'active', assets: '8.2K', lastSync: '5m ago', version: 'V2', enabled: hasSlack },
    { name: 'Google Workspace', status: 'active', assets: '6.1K', lastSync: '8m ago', version: 'V2', enabled: hasGoogle },
    { name: 'Box', status: 'active', assets: '4.3K', lastSync: '12m ago', version: 'V3', enabled: hasBox },
  ];

  const providerStatus = allProviders.filter(p => !p.version || p.version === 'V1' || p.enabled);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Discovery Scan Simulation */}
      <DiscoveryScanSimulation />

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <GlassCard className="p-5 md:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center justify-between">
              Recent Activity
              <Activity className="w-4 h-4 text-[#00F0FF]" />
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
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
              Enrich Metadata
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              AI-powered tagging
            </p>
          </button>

          <button className="min-h-[44px] p-5 md:p-6 rounded-2xl bg-[#A855F7]/5 border border-[#A855F7]/20 hover:bg-[#A855F7]/10 transition-all text-left group">
            <Fingerprint className="w-6 h-6 text-[#A855F7] mb-4 group-hover:scale-110 transition-transform" />
            <p className={`text-sm font-bold mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              Reconcile Identities
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              3 pending matches
            </p>
          </button>

          <button className="min-h-[44px] p-5 md:p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all text-left group">
            <TrendingUp className="w-6 h-6 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className={`text-sm font-bold mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              Review Waste
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              2.4TB identified
            </p>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
