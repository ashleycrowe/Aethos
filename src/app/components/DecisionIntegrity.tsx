import React, { useState, forwardRef, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Target, 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  Cpu, 
  ArrowUpRight,
  Clock,
  AlertCircle,
  Archive,
  Trash2,
  Info,
  ExternalLink,
  History,
  Lock,
  Globe,
  RotateCcw,
  Layers,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { ProviderType } from '../types/aethos.types';

const velocityData = [
  { day: 'Mon', velocity: 85 },
  { day: 'Tue', velocity: 92 },
  { day: 'Wed', velocity: 78 },
  { day: 'Thu', velocity: 95 },
  { day: 'Fri', velocity: 120 },
  { day: 'Sat', velocity: 110 },
  { day: 'Sun', velocity: 130 },
];

const driftData = [
  { name: 'Week 1', drift: 100 },
  { name: 'Week 2', drift: 85 },
  { name: 'Week 3', drift: 70 },
  { name: 'Week 4', drift: 45 },
  { name: 'Week 5', drift: 30 },
  { name: 'Week 6', drift: 12 },
];

interface ProtocolLogic {
  provider: ProviderType;
  label: string;
  action: string;
  impact: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROTOCOLS: ProtocolLogic[] = [
  { provider: 'microsoft', label: 'M365 SharePoint', action: 'Read-Only Archival', impact: 'Metadata preserved. URL active.', icon: Globe },
  { provider: 'google', label: 'Google Workspace', action: '[Aethos_Archive] Move', impact: 'Shared Drive migration. Access revoked.', icon: Layers },
  { provider: 'slack', label: 'Slack Channels', action: 'Native Archiving', impact: 'Searchable but non-interactive.', icon: History },
  { provider: 'box', label: 'Box Governance', action: 'Vault Sealing', impact: 'Governance_Vault move. File locked.', icon: Lock },
];

const CustomTooltip = forwardRef<HTMLDivElement, any>(({ active, payload, label, isDaylight }, ref) => {
  if (active && payload && payload.length) {
    return (
      <div ref={ref} className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${isDaylight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[#0B0F19]/90 border-white/10 text-white'}`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              <p className="text-xs font-bold font-mono">{p.value}{p.dataKey === 'velocity' ? 'hr' : '%'}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

export const DecisionIntegrity = () => {
  const { isDaylight } = useTheme();
  const { state, openForensicLab, remediateContainer, commitRules } = useAethos();
  const [activeProtocol, setActiveProtocol] = useState<ProviderType>('microsoft');
  const [showCalculation, setShowCalculation] = useState<Record<string, boolean>>({});

  const toggleMetric = (id: string) => {
    setShowCalculation(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePurge = (id: string, name: string) => {
    remediateContainer(id, 'delete');
    toast.error('Deep Purge Initialized', {
      description: `Protocol execution started for artifact ${name}.`
    });
  };

  const handleRestore = (id: string, name: string) => {
    remediateContainer(id, 'restore');
    toast.success('Soft-Gate Restored', {
      description: `Artifact ${name} has been moved back to active status.`
    });
  };

  const handleExecuteProtocol = () => {
    commitRules();
    toast.success("Governance Protocol Committed", {
      description: "Automatic soft-gate logic initialized organization-wide."
    });
  };

  const softGateItems = useMemo(() => {
    return state.containers
      .filter(c => c.retentionDaysLeft !== undefined && c.status !== 'orphaned')
      .map(c => ({
        id: c.id,
        name: c.title,
        provider: c.provider,
        daysLeft: c.retentionDaysLeft,
        size: (c.storageUsed / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
      }));
  }, [state.containers]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      {/* Narrative Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Decision Integrity Matrix</h2>
          </div>
          <h1 className={`text-5xl font-black uppercase tracking-tighter leading-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Operational Drift <span className="text-[#00F0FF]">Reduced 88%</span>
          </h1>
          <p className="text-lg text-slate-500 mt-6 leading-relaxed max-w-2xl">
            Aethos is suppressing decision friction by automating high-confidence remediation. The Universal Adapter Pattern ensures provider-specific integrity across the lattice.
          </p>
        </div>
        
        <div className="flex gap-4">
           {[
             { id: 'confidence', label: 'Confidence', value: '94.2%', story: 'High Trust Sync', calc: 'P(Success|History) > 0.9' },
             { id: 'velocity', label: 'Velocity', value: '12.4 hrs', story: 'Architect Speed', calc: 'T(Request) - T(Commit)' },
           ].map(metric => (
             <div 
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`px-8 py-6 rounded-[32px] border cursor-pointer group transition-all min-w-[180px] ${
                isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10 hover:border-[#00F0FF]/30'
              }`}
             >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-[#00F0FF]" />
                </div>
                <AnimatePresence mode="wait">
                   {showCalculation[metric.id] ? (
                     <Motion.span 
                       key="calc"
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -5 }}
                       className="text-xs font-mono font-bold text-[#00F0FF] block"
                     >
                       {metric.calc}
                     </Motion.span>
                   ) : (
                     <Motion.span 
                       key="val"
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -5 }}
                       className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}
                     >
                       {metric.value}
                     </Motion.span>
                   )}
                </AnimatePresence>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Remediation Protocol Simulator */}
        <div className="lg:col-span-8 space-y-8">
           <GlassCard className="p-8 space-y-8 bg-[#0B0F19]/60 border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Remediation Protocol Simulator</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Universal Adapter Pattern Verification</p>
                </div>
                <button 
                  onClick={() => openForensicLab({ type: 'universal' })}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2"
                >
                  Universal Forensic Lab <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {PROTOCOLS.map(p => (
                   <button
                    key={p.provider}
                    onClick={() => setActiveProtocol(p.provider)}
                    className={`p-6 rounded-[24px] border text-left transition-all group ${
                      activeProtocol === p.provider 
                        ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                   >
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${activeProtocol === p.provider ? 'text-[#00F0FF]' : 'text-slate-500'}`}>
                        {p.provider}
                      </p>
                      <p className="text-xs font-bold text-white mb-1">{p.label}</p>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Active</p>
                   </button>
                 ))}
              </div>

              <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                   <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Integrity Verified</span>
                   </div>
                </div>

                <div className="flex items-start gap-8 max-w-2xl">
                   <div className="w-16 h-16 rounded-2xl bg-[#0B0F19] border border-white/10 flex items-center justify-center text-[#00F0FF] shadow-2xl">
                      {React.createElement(PROTOCOLS.find(p => p.provider === activeProtocol)?.icon || Globe, { className: "w-8 h-8" })}
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight">
                         {PROTOCOLS.find(p => p.provider === activeProtocol)?.action}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed italic">
                        "{PROTOCOLS.find(p => p.provider === activeProtocol)?.impact}"
                      </p>
                      <div className="flex items-center gap-6 pt-2">
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-emerald-500">Pointer Persistence: 100%</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-[#00F0FF]">Decision Reversibility: 30 Days</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Velocity Chart */}
              <GlassCard className="p-8 h-[360px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-white">Decision Velocity</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Blast-to-Remediation (7-Day Trend)</p>
                  </div>
                  <Zap className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={velocityData}>
                      <defs>
                        <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 900 }} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip isDaylight={isDaylight} />} cursor={{ stroke: '#00F0FF', strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="velocity" stroke="#00F0FF" strokeWidth={3} fill="url(#velGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Drift Chart */}
              <GlassCard className="p-8 h-[360px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-white">Drift Suppression</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Unclassified Content Reduction</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        toast.promise(new Promise(r => setTimeout(r, 2000)), {
                          loading: 'Scanning Universal Adapter for Drift...',
                          success: 'Drift Suppressed: 142 Orphaned Containers Identified',
                          error: 'Audit failed',
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF5733]/10 text-[#FF5733] text-[8px] font-black uppercase tracking-widest hover:bg-[#FF5733]/20 transition-all border border-[#FF5733]/20"
                    >
                      Audit Drift
                    </button>
                    <div className="p-2.5 rounded-xl bg-[#FF5733]/10 text-[#FF5733]">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={driftData}>
                      <defs>
                        <linearGradient id="driftGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF5733" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF5733" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 900 }} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip isDaylight={isDaylight} />} cursor={{ stroke: '#FF5733', strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="drift" stroke="#FF5733" strokeWidth={3} fill="url(#driftGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
           </div>
        </div>

        {/* Sidebar: The Soft-Gate Ledger */}
        <div className="lg:col-span-4 space-y-8">
           <GlassCard className="p-8 space-y-8 bg-[#0B0F19]/60 border-white/10 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">The Soft-Gate Ledger</h3>
                <div className="p-2 rounded-lg bg-[#FF5733]/10 text-[#FF5733]">
                   <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-[#FF5733]/10 border border-[#FF5733]/20">
                 <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-4 h-4 text-[#FF5733]" />
                    <span className="text-[10px] font-black text-[#FF5733] uppercase tracking-widest">Awaiting Purge</span>
                 </div>
                 <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                    "Artifacts below are in the 30-day decision reversal window. 'Deep Purge' will permanently erase all provider records."
                 </p>
              </div>

              <div className="space-y-4">
                 {softGateItems.length > 0 ? softGateItems.map(item => (
                   <div key={item.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#0B0F19] border border-white/10 flex items-center justify-center text-slate-500">
                               <Archive className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[140px]">{item.name}</p>
                               <p className="text-[9px] font-black text-[#FF5733] uppercase tracking-widest mt-0.5">{item.daysLeft} Days Remaining</p>
                            </div>
                         </div>
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.size}</span>
                      </div>
                      
                      <div className="flex gap-2">
                         <button 
                          onClick={() => handleRestore(item.id, item.name)}
                          className="flex-1 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                         >
                           <RotateCcw className="w-3.5 h-3.5" /> Restore
                         </button>
                         <button 
                          onClick={() => handlePurge(item.id, item.name)}
                          className="flex-1 py-2 rounded-xl bg-[#FF5733]/10 text-[9px] font-black uppercase tracking-widest text-[#FF5733] hover:bg-[#FF5733]/20 transition-all flex items-center justify-center gap-2"
                         >
                           <Trash2 className="w-3.5 h-3.5" /> Purge
                         </button>
                      </div>
                   </div>
                 )) : (
                   <div className="py-10 text-center space-y-4">
                      <ShieldCheck className="w-10 h-10 text-slate-800 mx-auto" />
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Lattice Clear of Soft-Gates</p>
                   </div>
                 )}
              </div>

              <GlassCard className="p-6 bg-indigo-600 dark:bg-indigo-600/20 border-indigo-500/30 overflow-hidden relative mt-auto">
                 <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-400/20 blur-[80px] rounded-full" />
                 <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-3">
                      <Cpu className="text-white w-5 h-5" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Integrity Logic</h3>
                   </div>
                   <p className="text-[10px] font-medium text-white/80 leading-relaxed italic">
                     "92% of users accept archival suggestions. Initialize 'Automatic Soft-Gate' for all items with Utility Score &lt; 5%."
                   </p>
                   <div className="pt-2 flex items-center justify-between">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Architect Suggestion</span>
                      <button 
                        onClick={handleExecuteProtocol}
                        className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Execute
                      </button>
                   </div>
                 </div>
              </GlassCard>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};