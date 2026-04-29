import React, { useState, useRef } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Settings, 
  Layout, 
  Database, 
  Lock,
  User, 
  Palette,
  BellRing,
  Globe,
  Monitor,
  Sun,
  Moon,
  Eye,
  Zap,
  ShieldAlert,
  Upload,
  CheckCircle2,
  X,
  Type,
  RotateCcw,
  Image as ImageIcon,
  Check,
  Sparkles,
  Info,
  CreditCard,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'sonner';
import { ShadowDiscoveryAdapter } from './ShadowDiscoveryAdapter';
import { OperationalPolicyArchitect } from './OperationalPolicyArchitect';
import { UniversalAdapterSetup } from './UniversalAdapterSetup';
import { OracleAnalytics } from './OracleAnalytics';
import { ComplianceCenter } from './ComplianceCenter';

import { useOracle } from '../context/OracleContext';

export const AdminCenter = () => {
  const { isDaylight, toggleDaylight, brand, updateBrand, getBrandColor, getContrastText } = useTheme();
  const { user } = useUser();
  const { notifications, governance, updateNotification, updateGovernance } = useSettings();
  const { tier, setTier, isAiOptOut, setIsAiOptOut } = useOracle();
  
  const isElevated = user.actualRole === 'CURATOR' || user.actualRole === 'AUDITOR';
  
  const tabs = isElevated ? [
    { id: 'command', label: 'Command Center', icon: Layout, desc: 'Health & Overrides' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, desc: 'Billing & Tier' },
    { id: 'rules', label: 'Operational Rules', icon: ShieldCheck, desc: 'Policy & Simulation' },
    { id: 'oracle', label: 'Oracle Analytics', icon: Sparkles, desc: 'Intelligence Metrics' },
    { id: 'compliance', label: 'Compliance', icon: Lock, desc: 'Sovereignty & Audit' },
    { id: 'sync', label: 'Universal Sync', icon: Database, desc: 'Adapters & Hub' },
    { id: 'persona', label: 'Persona', icon: Palette, desc: 'Identity & Environment' },
  ] : [
    { id: 'persona', label: 'Persona', icon: Palette, desc: 'Identity & Environment' },
  ];

  const [activeSubTab, setActiveSubTab] = React.useState<any>(isElevated ? 'command' : 'persona');
  const [tempHex, setTempHex] = useState(brand.color);
  const presetColors = ['#00F0FF', '#FF5733', '#7000FF', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#6366F1'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateBrand({ logoUrl: event.target?.result as string });
        toast.success("Insignia updated successfully.");
      };
      reader.readAsDataURL(file);
    }
  };

  const SystemHealthCard = ({ name, status, load }: { name: string, status: string, load: string }) => (
    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${isDaylight ? 'bg-slate-50 border-slate-100 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
      <div className="min-w-0">
        <h4 className={`text-[10px] font-black uppercase tracking-widest truncate ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{status}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{load}</p>
        <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Load</p>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-[1440px] mx-auto space-y-8 md:space-y-12 px-4 md:px-0 pb-10">
      {/* Simplified Architectural Pillar Navigation - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex flex-col gap-3 md:gap-4 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border text-left transition-all relative overflow-hidden group ${
              activeSubTab === tab.id 
                ? (isDaylight ? 'bg-white border-slate-900 shadow-xl' : 'bg-[#00F0FF]/5 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.1)]') 
                : (isDaylight ? 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10 text-slate-500')
            }`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${
                activeSubTab === tab.id 
                  ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black') 
                  : (isDaylight ? 'bg-white border border-slate-200 text-slate-400' : 'bg-white/5 text-slate-500')
              }`}>
                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              {activeSubTab === tab.id && (
                <motion.div layoutId="active-indicator" className={`w-1.5 h-1.5 rounded-full ${isDaylight ? 'bg-slate-900' : 'bg-[#00F0FF]'}`} />
              )}
            </div>
            <div className="relative z-10">
              <p className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${activeSubTab === tab.id ? (isDaylight ? 'text-slate-900' : 'text-white') : 'text-slate-500'}`}>
                {tab.label}
              </p>
              <p className="text-[7px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-60 line-clamp-1">
                {tab.desc}
              </p>
            </div>
            
            {activeSubTab === tab.id && !isDaylight && (
              <motion.div layoutId="glow-tab" className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'command' ? (
          <motion.div key="command" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
              <div className="lg:col-span-8 space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <GlassCard className="p-6 md:p-8">
                    <h3 className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 md:mb-8`}>System Velocity</h3>
                    <div className="flex items-center gap-6 md:gap-10">
                      <div>
                        <p className={`text-3xl md:text-4xl font-black font-['Space_Grotesk'] tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>8.4ms</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                          <Zap className="w-3 h-3" /> Optimized
                        </p>
                      </div>
                      <div className="flex-1 h-12 md:h-14 flex items-end gap-1 md:gap-1.5">
                        {[40, 60, 45, 80, 50, 90, 70, 55, 85].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }} 
                            animate={{ height: `${h}%` }} 
                            className={`flex-1 rounded-t-sm md:rounded-t-lg ${isDaylight ? 'bg-slate-200' : 'bg-[#00F0FF]/20'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-6 md:p-8">
                    <h3 className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 md:mb-8`}>Identity Integrity</h3>
                    <div className="flex items-center gap-6 md:gap-10">
                      <div>
                        <p className={`text-3xl md:text-4xl font-black font-['Space_Grotesk'] tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>99.9%</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2">Federated Security</p>
                      </div>
                      <ShieldCheck className={`w-10 h-10 md:w-14 md:h-14 ${isDaylight ? 'text-slate-100' : 'text-white/5'}`} />
                    </div>
                  </GlassCard>
                </div>
                
                <section className="space-y-6 md:space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Active Sync Adapters</h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[7px] md:text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                       Health: Optimal
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <SystemHealthCard name="Microsoft Graph Adapter" status="Active" load="12%" />
                    <SystemHealthCard name="Slack Webhook Controller" status="Active" load="4%" />
                    <SystemHealthCard name="Google Workspace Federated" status="Active" load="8%" />
                    <SystemHealthCard name="Box Governance Engine" status="Degraded" load="92%" />
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-6 md:space-y-10">
                <GlassCard className="p-6 md:p-8 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8 md:mb-10">
                    <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-[#FF5733]/10 text-[#FF5733]">
                      <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white">Security Overrides</h3>
                      <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global System Locks</p>
                    </div>
                  </div>
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 md:space-y-1">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Motion Control</span>
                        <p className="text-[7px] md:text-[8px] text-slate-600 font-bold uppercase tracking-widest">Lock UI Animations</p>
                      </div>
                      <button 
                        onClick={() => updateGovernance('forceLowMotion', !governance.forceLowMotion)}
                        className={`w-12 h-6 md:w-14 md:h-7 rounded-full p-1 md:p-1.5 transition-all ${governance.forceLowMotion ? 'bg-[#FF5733]' : 'bg-slate-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${governance.forceLowMotion ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 md:space-y-1">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Fidelity Lock</span>
                        <p className="text-[7px] md:text-[8px] text-slate-600 font-bold uppercase tracking-widest">Disable High-Res Blur</p>
                      </div>
                      <button 
                        onClick={() => updateGovernance('disableHighFidelity', !governance.disableHighFidelity)}
                        className={`w-12 h-6 md:w-14 md:h-7 rounded-full p-1 md:p-1.5 transition-all ${governance.disableHighFidelity ? 'bg-[#FF5733]' : 'bg-slate-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${governance.disableHighFidelity ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8 md:mt-10 p-3 md:p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl md:rounded-2xl flex items-start gap-3">
                    <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[7px] md:text-[8px] text-amber-500 font-black uppercase tracking-widest leading-relaxed">
                      Overrides personal user preferences for performance stability.
                    </p>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6 md:p-8">
                  <h3 className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 md:mb-8`}>Audit Stream</h3>
                  <div className="space-y-6 md:space-y-8">
                    {[
                      { user: 'Sarah Jenkins', action: 'Modified Box permissions', time: '2m ago' },
                      { user: 'Admin System', action: 'Executed deep purge', time: '14m ago' },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 md:gap-5">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${isDaylight ? 'bg-slate-100' : 'bg-white/5'}`}>
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest truncate ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{act.user}</p>
                          <p className="text-[9px] text-slate-500 mt-1 truncate">{act.action}</p>
                          <p className="text-[7px] md:text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1.5">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'subscription' ? (
          <motion.div key="subscription" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            {/* Current Subscription Tier */}
            <GlassCard className="p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <CreditCard className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Active Subscription</h3>
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      Content Oracle <span className="text-[#00F0FF]">{tier === 'pro' ? 'AI+' : 'Base'}</span>
                    </h2>
                    <p className="text-sm text-slate-400 mt-3">Enterprise metadata intelligence for Microsoft 365</p>
                  </div>
                  <div className={`px-8 py-6 rounded-[24px] ${isDaylight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Monthly Cost</p>
                    <p className={`text-5xl font-black font-['Space_Grotesk'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      ${tier === 'pro' ? '698' : '499'}
                      <span className="text-sm text-slate-500 font-medium">/mo</span>
                    </p>
                  </div>
                </div>

                {/* Tier Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Base Tier */}
                  <div className={`p-8 rounded-[24px] border-2 transition-all ${tier === 'basic' ? (isDaylight ? 'bg-white border-slate-900' : 'bg-[#00F0FF]/5 border-[#00F0FF]') : (isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10')}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className={`text-2xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Base Tier</h4>
                      <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'bg-slate-900 text-white' : 'bg-white/10 text-slate-300'}`}>
                        $499/mo
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {[
                        'Discovery (The Constellation)',
                        'Workspace Management (The Nexus)',
                        'Basic Search & Metadata Index',
                        'Universal Adapter Sync (M365, Slack)',
                        'Identity Reconciliation',
                        'Storage Waste Detection'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-400 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {tier === 'basic' && (
                      <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Current Active Tier</p>
                      </div>
                    )}
                    {tier === 'pro' && (
                      <button 
                        onClick={() => { setTier('basic'); toast.success('Downgrade scheduled for next billing cycle'); }}
                        className={`w-full mt-6 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDaylight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        Downgrade to Base
                      </button>
                    )}
                  </div>

                  {/* Pro Tier (AI+) */}
                  <div className={`p-8 rounded-[24px] border-2 transition-all relative overflow-hidden ${tier === 'pro' ? (isDaylight ? 'bg-white border-slate-900' : 'bg-[#00F0FF]/5 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.1)]') : (isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10')}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <Brain className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className={`text-2xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>AI+ Tier</h4>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF] mt-1">Content Reading Enabled</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black'}`}>
                          $698/mo
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-6 italic">Everything in Base, plus:</p>
                      <ul className="space-y-4">
                        {[
                          'AI Content Reading & Summarization',
                          'Auto-Tag Generation (GPT-4)',
                          'Intelligent Q&A (Oracle Engine)',
                          'Semantic Search Across Content',
                          'Auto-Description Enrichment',
                          'Predictive Insights & Recommendations'
                        ].map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Brain className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-300 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {tier === 'pro' && (
                        <div className="mt-6 p-4 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-xl">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">Current Active Tier</p>
                        </div>
                      )}
                      {tier === 'basic' && (
                        <button 
                          onClick={() => { setTier('pro'); toast.success('Upgrade to AI+ activated'); }}
                          className="w-full mt-6 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#00F0FF] text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                        >
                          Upgrade to AI+ (+$199/mo)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Usage Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Assets Indexed</h4>
                </div>
                <p className={`text-3xl font-black font-['Space_Grotesk'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>24,847</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> +2.4k this month
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Enrichments</h4>
                </div>
                <p className={`text-3xl font-black font-['Space_Grotesk'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {tier === 'pro' ? '8,492' : '—'}
                </p>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${tier === 'pro' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {tier === 'pro' ? 'Active this month' : 'Upgrade required'}
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Oracle Queries</h4>
                </div>
                <p className={`text-3xl font-black font-['Space_Grotesk'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {tier === 'pro' ? '1,247' : '—'}
                </p>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${tier === 'pro' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {tier === 'pro' ? 'Unlimited queries' : 'Upgrade required'}
                </p>
              </GlassCard>
            </div>

            {/* Billing Information */}
            <GlassCard className="p-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Billing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Next Billing Date</p>
                  <p className={`text-lg font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>March 27, 2026</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Payment Method</p>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-2 rounded-lg ${isDaylight ? 'bg-slate-100' : 'bg-white/5'}`}>
                      <CreditCard className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className={`text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>•••• 4242</span>
                  </div>
                </div>
              </div>
              <button className={`mt-8 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDaylight ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                Update Payment Method
              </button>
            </GlassCard>

            {/* AI Opt-Out Toggle (for privacy compliance) */}
            {tier === 'pro' && (
              <GlassCard className="p-8 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-6">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-black uppercase tracking-tight mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      AI Content Reading Controls
                    </h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      For privacy-sensitive organizations, you can disable AI content reading while keeping metadata intelligence active. This downgrade is included in your AI+ subscription at no additional cost.
                    </p>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">AI Content Reading</p>
                        <p className="text-[8px] text-slate-600 uppercase tracking-widest">{isAiOptOut ? 'Disabled (Metadata Only)' : 'Enabled (Full AI)'}</p>
                      </div>
                      <button 
                        onClick={() => { setIsAiOptOut(!isAiOptOut); toast.success(isAiOptOut ? 'AI content reading enabled' : 'AI content reading disabled'); }}
                        className={`w-14 h-7 rounded-full p-1.5 transition-all ${isAiOptOut ? 'bg-slate-700' : 'bg-[#00F0FF]'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${isAiOptOut ? 'translate-x-0' : 'translate-x-7'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        ) : activeSubTab === 'rules' ? (
          <motion.div key="rules" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            <OperationalPolicyArchitect />
          </motion.div>
        ) : activeSubTab === 'oracle' ? (
          <motion.div key="oracle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            <OracleAnalytics />
          </motion.div>
        ) : activeSubTab === 'compliance' ? (
          <motion.div key="compliance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            <ComplianceCenter />
          </motion.div>
        ) : activeSubTab === 'sync' ? (
          <motion.div key="sync" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            <UniversalAdapterSetup />
            <ShadowDiscoveryAdapter />
          </motion.div>
        ) : activeSubTab === 'persona' ? (
          <motion.div key="persona" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 md:space-y-10">
            
            {/* 1. Header-Style Profile Section (Full Width) */}
            <GlassCard className="p-6 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                <Globe className="w-48 h-48" />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[28px] md:rounded-[40px] border-4 border-white/5 flex items-center justify-center text-3xl md:text-4xl font-black shadow-2xl transition-all group-hover:rotate-3 ${isDaylight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white/5 text-[#00F0FF]'}`}>
                  {user.role.charAt(0)}
                </div>
                <div className="text-center md:text-left space-y-2 md:space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                     <h3 className={`text-2xl md:text-4xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{user.role}</h3>
                     <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] md:text-[9px] font-black text-blue-500 uppercase tracking-widest mx-auto md:mx-0">
                        {user.tier} Protocol Access
                     </div>
                  </div>
                  <p className="text-[10px] md:text-sm text-slate-500 font-medium italic max-w-lg leading-relaxed">
                    "Authenticated as a Lead Architect. You have delegated authority to manage universal adapters and simulate global remediation policies across the federated workspace."
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* 2. Responsive Grid for Branding and Environment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
              
              {/* Branding Section */}
              <div className="lg:col-span-8 space-y-6 md:space-y-10">
                <GlassCard className="p-6 md:p-10">
                  <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Palette className="w-4 h-4" />
                      </div>
                      <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Corporate Identity</h3>
                    </div>
                    <button 
                      onClick={() => updateBrand({ name: 'Aethos', color: '#00F0FF', logoUrl: undefined })} 
                      className="text-[8px] md:text-[9px] font-black text-slate-600 hover:text-[#FF5733] flex items-center gap-2 transition-colors"
                    >
                       <RotateCcw className="w-3 h-3" /> Reset Brand
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Left Column: Name and Logo */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Type className="w-3 h-3" /> Operational Identifier
                        </label>
                        <div className="relative">
                          <input 
                            type="text" value={brand.name} onChange={(e) => updateBrand({ name: e.target.value })}
                            className={`w-full p-4 md:p-5 rounded-2xl border outline-none font-black text-xs md:text-sm transition-all ${isDaylight ? 'bg-white border-slate-200 focus:border-slate-900 shadow-sm' : 'bg-white/5 border-white/5 focus:border-[#00F0FF] text-white'}`}
                            placeholder="Organization Name"
                          />
                        </div>
                        <p className="text-[8px] text-slate-600 uppercase font-bold tracking-widest ml-1">The primary label used in system communications.</p>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <ImageIcon className="w-3 h-3" /> Insignia Asset
                        </label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={`group border-2 border-dashed p-8 md:p-14 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${isDaylight ? 'bg-slate-50 border-slate-200 hover:border-slate-900' : 'bg-white/5 border-white/10 hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5'}`}
                        >
                           {brand.logoUrl ? (
                             <div className="relative group/logo">
                               <img src={brand.logoUrl} className="h-10 md:h-12 object-contain transition-transform group-hover/logo:scale-105" alt="Brand Logo" />
                               <div className="absolute -top-4 -right-4 p-1.5 rounded-full bg-[#FF5733] text-white opacity-0 group-hover/logo:opacity-100 transition-opacity shadow-lg" onClick={(e) => { e.stopPropagation(); updateBrand({ logoUrl: undefined }); }}>
                                  <X className="w-3 h-3" />
                               </div>
                             </div>
                           ) : (
                             <div className="text-center">
                               <Upload className="w-6 h-6 md:w-8 md:h-8 text-slate-600 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                               <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">Upload Vector Insignia</span>
                               <p className="text-[7px] text-slate-700 mt-2 font-black uppercase tracking-widest">SVG or PNG Preferred</p>
                             </div>
                           )}
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column: Color Palette */}
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                             <Palette className="w-3 h-3" /> Signal Color Palette
                          </label>
                          <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] border ${isDaylight ? 'bg-slate-50 border-slate-200 shadow-inner' : 'bg-white/5 border-white/10'}`}>
                             <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                                <div className="relative group/picker">
                                  <input 
                                    type="color" value={brand.color} onChange={(e) => { updateBrand({ color: e.target.value }); setTempHex(e.target.value); }} 
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[24px] cursor-pointer bg-transparent relative z-10 opacity-0" 
                                  />
                                  <div className="absolute inset-0 rounded-2xl md:rounded-[24px] shadow-lg border-2 border-white/10 transition-transform group-hover/picker:scale-105" style={{ backgroundColor: brand.color }} />
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                    <div className="p-1 rounded bg-black/20 backdrop-blur-sm">
                                      <Check className={`w-4 h-4 text-white opacity-0 ${getContrastText(brand.color) === 'white' ? 'opacity-40' : 'text-black opacity-40'}`} />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                   <div className="flex items-center gap-2">
                                     <span className="text-slate-500 font-black text-lg">#</span>
                                     <input type="text" value={tempHex.replace('#', '')} onChange={(e) => { const val = e.target.value; setTempHex('#' + val); if (val.length === 6) updateBrand({ color: '#' + val }); }} className={`w-full bg-transparent border-none font-black text-xl md:text-2xl uppercase outline-none ${isDaylight ? 'text-slate-900' : 'text-white'}`} maxLength={6} />
                                   </div>
                                   <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Universal Signal Accent</p>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-4 gap-3">
                                {presetColors.map(c => (
                                  <button 
                                    key={c} 
                                    onClick={() => { updateBrand({ color: c }); setTempHex(c); }} 
                                    className={`aspect-square rounded-xl md:rounded-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${brand.color === c ? 'ring-2 ring-white ring-offset-4 ring-offset-[#0B0F19] shadow-xl' : 'hover:shadow-lg'}`} 
                                    style={{ backgroundColor: c }}
                                  >
                                    {brand.color === c && <Check className={`w-3 h-3 md:w-4 md:h-4 ${getContrastText(c) === 'white' ? 'text-white' : 'text-black'}`} />}
                                  </button>
                                ))}
                             </div>
                          </div>
                       </div>
                       
                       <div className={`p-5 rounded-2xl border border-dashed ${isDaylight ? 'bg-blue-50/50 border-blue-200 text-blue-800' : 'bg-[#00F0FF]/5 border-[#00F0FF]/20 text-[#00F0FF]'} flex items-center gap-4`}>
                          <Info className="w-5 h-5 shrink-0" />
                          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-relaxed">
                            These brand signals are used to theme the Aethos interface globally for all authenticated users in your organization.
                          </p>
                       </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Preferences Section */}
              <div className="lg:col-span-4 space-y-6 md:space-y-10">
                <GlassCard className="p-6 md:p-10 space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <Settings className="w-4 h-4" />
                    </div>
                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Global Environment</h3>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Visual Mode Toggle */}
                    <div className={`group p-6 rounded-[24px] border transition-all ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Clarity Mode</span>
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest italic">"{isDaylight ? 'High-Velocity Sunlight' : 'Deep Space Focus'}"</p>
                        </div>
                        <button 
                          onClick={toggleDaylight} 
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-center shadow-lg ${isDaylight ? 'bg-slate-900 text-white border-slate-700 hover:scale-105' : 'bg-white text-slate-900 border-white hover:scale-105'}`}
                        >
                          {isDaylight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="w-full bg-slate-500/10 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={false}
                          animate={{ width: isDaylight ? '100%' : '30%' }}
                          className={`h-full ${isDaylight ? 'bg-amber-400' : 'bg-[#00F0FF]'}`}
                        />
                      </div>
                    </div>

                    {/* Oracle Intelligence Settings */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                       <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Oracle Intelligence</p>
                          </div>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] uppercase`}>{tier} Tier</span>
                       </div>
                       <div className="space-y-3">
                          {/* Tier Toggle */}
                          <div 
                            onClick={() => setTier(tier === 'basic' ? 'pro' : 'basic')}
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                              tier === 'pro' 
                                ? (isDaylight ? 'bg-blue-50 border-blue-100' : 'bg-[#00F0FF]/5 border-[#00F0FF]/20') 
                                : (isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/5')
                            }`}
                          >
                             <div className="space-y-1">
                               <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${tier === 'pro' ? (isDaylight ? 'text-blue-900' : 'text-[#00F0FF]') : 'text-slate-400'}`}>
                                 Conversational AI
                               </span>
                               <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Enable Oracle Content Synthesis</p>
                             </div>
                             <div className={`w-10 h-5 rounded-full p-1 transition-all ${tier === 'pro' ? 'bg-[#00F0FF]' : 'bg-slate-700'}`}>
                                <motion.div 
                                  animate={{ x: tier === 'pro' ? 20 : 0 }}
                                  className={`w-3 h-3 bg-white rounded-full shadow-md`} 
                                />
                             </div>
                          </div>

                          {/* AI Air-Gap Toggle */}
                          <div 
                            onClick={() => setIsAiOptOut(!isAiOptOut)}
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                              isAiOptOut 
                                ? 'bg-red-500/10 border-red-500/20' 
                                : (isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/5')
                            }`}
                          >
                             <div className="space-y-1">
                               <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isAiOptOut ? 'text-red-500' : 'text-slate-400'}`}>
                                 AI Air-Gap (Opt-Out)
                               </span>
                               <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Disable all AI document processing</p>
                             </div>
                             <div className={`w-10 h-5 rounded-full p-1 transition-all ${isAiOptOut ? 'bg-red-500' : 'bg-slate-700'}`}>
                                <motion.div 
                                  animate={{ x: isAiOptOut ? 20 : 0 }}
                                  className={`w-3 h-3 bg-white rounded-full shadow-md`} 
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Notification Streams */}
                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <BellRing className="w-3.5 h-3.5 text-slate-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Streams</p>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       </div>
                       <div className="space-y-3">
                          {[
                            { id: 'intelligenceSummary', label: 'Consolidated Pulse', desc: 'Batch notifications' },
                            { id: 'securityCritical', label: 'Security Supernova', desc: 'Critical alerts only' }
                          ].map(pref => (
                            <div 
                              key={pref.id} 
                              onClick={() => updateNotification(pref.id as any, !notifications[pref.id as keyof typeof notifications])}
                              className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border cursor-pointer transition-all ${
                                notifications[pref.id as keyof typeof notifications] 
                                  ? (isDaylight ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-500/5 border-emerald-500/20') 
                                  : (isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]')
                              }`}
                            >
                               <div className="space-y-1">
                                 <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${notifications[pref.id as keyof typeof notifications] ? (isDaylight ? 'text-emerald-900' : 'text-emerald-400') : 'text-slate-400'}`}>
                                   {pref.label}
                                 </span>
                                 <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{pref.desc}</p>
                               </div>
                               <div className={`w-10 md:w-12 h-5 md:h-6 rounded-full p-1 transition-all ${notifications[pref.id as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                  <motion.div 
                                    animate={{ x: notifications[pref.id as keyof typeof notifications] ? (window.innerWidth < 768 ? 16 : 24) : 0 }}
                                    className={`w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-md`} 
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <GlassCard className={`p-6 border-l-4 border-l-[#00F0FF] ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Sync Status</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Protocol Synchronized</span>
                      </div>
                    </GlassCard>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Commit Actions (Bottom) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] italic text-center md:text-left">
                * All changes made to identity assets and environment signals are persistent across user sessions.
              </p>
              <button 
                onClick={() => toast.success("Identity Protocol Committed")}
                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 ${
                  isDaylight ? 'bg-slate-900 text-white shadow-xl' : 'bg-[#00F0FF] text-black shadow-[0_0_30px_rgba(0,240,255,0.3)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Commit Identity Protocol
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <Settings className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-slate-600">Module Under Calibration</h3>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
