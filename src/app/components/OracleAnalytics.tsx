import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Search, 
  Target, 
  AlertCircle, 
  Cpu, 
  Activity, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Globe,
  Slack,
  Box as BoxIcon,
  Share2,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

export const OracleAnalytics = () => {
  const { isDaylight } = useTheme();
  
  const stats = [
    { label: "Success Rate", value: "94.2%", trend: "+2.1%", icon: Target, color: "#10B981" },
    { label: "Avg Latency", value: "2.4s", trend: "-0.4s", icon: Clock, color: "#00F0FF" },
    { label: "Index Storage", value: "1.2 TB", trend: "+14 GB", icon: Database, color: "#A855F7" },
    { label: "RAM Purged", value: "42.8 GB", trend: "+4.2 GB", icon: Zap, color: "#FF5733" },
  ];

  const topIntents = [
    { label: "Financial Budgeting", count: 420, growth: 12 },
    { label: "Identity Permissions", count: 310, growth: 8 },
    { label: "Project Alpha", count: 285, growth: 24 },
    { label: "Vendor Contracts", count: 180, growth: -2 },
    { label: "Legal Compliance", count: 120, growth: 5 },
  ];

  const commonMisses = [
    { query: "Project Omega timeline", misses: 42, suggested: "Scan Ghost Towns" },
    { query: "Q4 Marketing Spend", misses: 38, suggested: "Check Archive Vault" },
    { query: "Azure SLA 2025", misses: 15, suggested: "Identity Sync Needed" },
  ];

  const providerHealth = [
    { name: "Microsoft Graph", icon: Share2, latency: "1.8s", status: "Healthy" },
    { name: "Slack Enterprise", icon: Slack, latency: "0.9s", status: "Healthy" },
    { name: "Google Workspace", icon: Globe, latency: "2.1s", status: "Healthy" },
    { name: "Box Governance", icon: BoxIcon, latency: "3.2s", status: "Degraded" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className={`text-4xl font-bold font-['Space_Grotesk'] tracking-tight uppercase ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Oracle Insights</h1>
            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'bg-blue-50 text-blue-600' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
              Live Intelligence
            </div>
          </div>
          <p className={isDaylight ? 'text-slate-500' : 'text-slate-400'}>Operational efficiency metrics for the Federated Answer Engine.</p>
        </div>
        <div className="flex gap-4">
          <button className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDaylight ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-600' : 'bg-white/5 border-white/5 text-white hover:border-[#00F0FF]'}`}>
            Export Manifest
          </button>
          <button className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${isDaylight ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'}`}>
            Optimize Index
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className={`p-6 ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                {stat.trend}
              </div>
            </div>
            <div className={`text-2xl font-black font-['Space_Grotesk'] tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className={`lg:col-span-2 p-8 ${isDaylight ? 'bg-white border-slate-100' : ''}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-bold uppercase tracking-widest flex items-center gap-3 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              <Target className={`w-5 h-5 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
              Intent Utilization
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last 30 Days</span>
          </div>
          <div className="space-y-6">
            {topIntents.map((intent, i) => (
              <div key={intent.label} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className={isDaylight ? 'text-slate-700' : 'text-slate-300'}>{intent.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{intent.count} Queries</span>
                    <span className={intent.growth > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                      {intent.growth > 0 ? '+' : ''}{intent.growth}%
                    </span>
                  </div>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDaylight ? 'bg-slate-100' : 'bg-white/5'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(intent.count / 420) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${isDaylight ? 'bg-blue-600' : 'bg-gradient-to-r from-[#00F0FF] to-[#00F0FF]/40'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className={`p-8 ${isDaylight ? 'bg-white border-slate-100' : ''}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-bold uppercase tracking-widest flex items-center gap-3 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              <AlertCircle className="w-5 h-5 text-[#FF5733]" />
              Failed Queries
            </h3>
          </div>
          <div className="space-y-4">
            {commonMisses.map((miss) => (
              <div key={miss.query} className={`p-4 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                <div className="flex justify-between items-start mb-2">
                  <p className={`text-xs font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>"{miss.query}"</p>
                  <span className="text-[10px] font-black text-[#FF5733]">{miss.misses} misses</span>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  Recommended: {miss.suggested}
                </div>
              </div>
            ))}
          </div>
          <button className={`w-full mt-6 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDaylight ? 'bg-slate-50 border-slate-100 hover:bg-slate-100' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
            View Full Log <ArrowRight className="w-4 h-4" />
          </button>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {providerHealth.map((provider) => (
          <GlassCard key={provider.name} className={`p-6 ${isDaylight ? 'bg-white border-slate-100' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
                <provider.icon className={`w-4 h-4 ${isDaylight ? 'text-slate-600' : 'text-slate-400'}`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{provider.name}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black font-['Space_Grotesk'] tracking-tight text-white">{provider.latency}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Response</p>
              </div>
              <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${provider.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#FF5733]/10 text-[#FF5733]'}`}>
                {provider.status}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
