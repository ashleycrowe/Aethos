import React, { useState, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Archive, 
  Trash2, 
  ShieldAlert, 
  Layers, 
  Database, 
  Globe, 
  Slack, 
  Box, 
  HardDrive, 
  ChevronRight,
  Search,
  Zap,
  Lock,
  Eye,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  Info,
  History,
  CheckCircle2,
  LockKeyhole,
  ExternalLink,
  Target as TargetIcon
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface Container {
  id: string;
  name: string;
  provider: 'microsoft' | 'google' | 'slack' | 'box' | 'local';
  size: string;
  lastActive: string;
  inactivityDays: number;
  riskScore: number;
  owner: string;
  type: 'Tier 1' | 'Tier 2';
}

const PROVIDER_CONFIG = {
  microsoft: { icon: Globe, color: '#00F0FF', archiveAction: 'Set Read-Only', archiveLabel: 'Immutable Anchor' },
  google: { icon: Database, color: '#34A853', archiveAction: 'Migrate to [Aethos_Archive]', archiveLabel: 'Vaulted Drive' },
  slack: { icon: Slack, color: '#A855F7', archiveAction: 'Freeze Channel', archiveLabel: 'Shadow Archive' },
  box: { icon: Box, color: '#0061D5', archiveAction: 'Move to Governance_Vault', archiveLabel: 'Locked Vault' },
  local: { icon: HardDrive, color: '#64748B', archiveAction: 'Move to Cold Tier', archiveLabel: 'Deep Storage' }
};

export const UniversalArchivalConsole = () => {
  const { isDaylight } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const containers: Container[] = useMemo(() => [
    { id: 'c1', name: 'Executive Strategy 2024', provider: 'microsoft', size: '14.2 GB', lastActive: '92 days ago', inactivityDays: 92, riskScore: 84, owner: 'Sarah Chen', type: 'Tier 1' },
    { id: 'c2', name: 'Legacy Marketing Assets', provider: 'box', size: '128 GB', lastActive: '214 days ago', inactivityDays: 214, riskScore: 92, owner: 'Mark Wilson', type: 'Tier 2' },
    { id: 'c3', name: '#temp-project-phoenix', provider: 'slack', size: '420 MB', lastActive: '45 days ago', inactivityDays: 45, riskScore: 45, owner: 'Alex Rivera', type: 'Tier 1' },
    { id: 'c4', name: 'Q3 Product Roadmap (Drafts)', provider: 'google', size: '2.1 GB', lastActive: '120 days ago', inactivityDays: 120, riskScore: 68, owner: 'Elena Vance', type: 'Tier 2' },
    { id: 'c5', name: 'Local DB Backup (2023)', provider: 'local', size: '4.5 TB', lastActive: '365+ days ago', inactivityDays: 365, riskScore: 98, owner: 'SysAdmin', type: 'Tier 2' }
  ], []);

  const filteredContainers = containers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContainer = containers.find(c => c.id === selectedId);

  const handleArchiveExecution = async () => {
    if (!selectedContainer) return;
    setIsExecuting(true);
    
    // Simulate provider-specific archival protocol
    const protocol = PROVIDER_CONFIG[selectedContainer.provider].archiveAction;
    toast.info(`Initializing Archival Protocol: ${protocol}`, {
      description: `Executing bi-directional sync for ${selectedContainer.name}.`
    });

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsExecuting(false);
    setSelectedId(null);
    toast.success("Operational Integrity Restored", {
      description: `${selectedContainer.name} has been successfully transitioned to the ${PROVIDER_CONFIG[selectedContainer.provider].archiveLabel}.`
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Narrative */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
              <Archive className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Universal Archival Spectrum</h2>
          </div>
          <h1 className={`text-6xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Operational <span className="text-[#00F0FF]">Remediation</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Execute provider-specific archival protocols. Transition "Dead Capital" into immutable governance layers without losing operational metadata.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Containers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white focus:border-[#00F0FF] outline-none transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Container Inventory List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-4 mb-2">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Target Container Identity</span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Inactivity / Risk</span>
          </div>
          
          <AnimatePresence mode="popLayout">
            {filteredContainers.map((container, i) => {
              const config = PROVIDER_CONFIG[container.provider];
              const isSelected = selectedId === container.id;
              
              return (
                <Motion.div
                  key={container.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <button
                    onClick={() => setSelectedId(container.id)}
                    className={`w-full p-6 rounded-[32px] border transition-all flex items-center justify-between group relative overflow-hidden ${
                      isSelected 
                        ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.1)]' 
                        : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all ${isSelected ? 'border-[#00F0FF]/30' : ''}`}>
                        <config.icon className="w-5 h-5" style={{ color: config.color }} />
                      </div>
                      <div className="text-left">
                        <h3 className={`text-sm font-black uppercase tracking-tight mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{container.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{container.type}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-800" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{container.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10 relative z-10 text-right">
                      <div className="space-y-1">
                        <p className={`text-[11px] font-black uppercase tracking-tighter ${container.inactivityDays > 100 ? 'text-[#FF5733]' : 'text-slate-400'}`}>
                          {container.lastActive}
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(b => (
                            <div key={b} className={`w-1 h-3 rounded-full ${b <= (container.riskScore / 20) ? 'bg-[#FF5733]' : 'bg-white/10'}`} />
                          ))}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-[#00F0FF]' : 'text-slate-700'}`} />
                    </div>

                    {isSelected && (
                      <Motion.div 
                        layoutId="active-glimmer"
                        className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-transparent pointer-events-none"
                      />
                    )}
                  </button>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Archival Spectrum Control Panel */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedContainer ? (
              <Motion.div
                key="panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="sticky top-8"
              >
                <GlassCard className="p-10 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#00F0FF]">Architectural Target</span>
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedContainer.name}</h2>
                    </div>
                    <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* Archival Spectrum Selection */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Select Remediation Protocol</p>
                      
                      <div className="p-6 rounded-3xl bg-[#00F0FF]/5 border border-[#00F0FF]/30 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <LockKeyhole className="w-4 h-4 text-[#00F0FF]" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">
                              {PROVIDER_CONFIG[selectedContainer.provider].archiveAction}
                            </span>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-[#00F0FF] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                          This protocol is unique to {selectedContainer.provider.toUpperCase()}. It will transition the container to the {PROVIDER_CONFIG[selectedContainer.provider].archiveLabel} while maintaining full metadata history and searchability.
                        </p>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#FF5733]/30 transition-all opacity-50 hover:opacity-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Trash2 className="w-4 h-4 text-[#FF5733]" />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Initialize Soft-Gate (30 Day)</span>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-white/10" />
                        </div>
                      </div>
                    </div>

                    {/* Narrative Logic Layer */}
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-[#00F0FF]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-[#00F0FF]">Story Narrative</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        "The {selectedContainer.name} has been identified as <span className="text-white font-bold">Dead Capital</span>. It has not been accessed in {selectedContainer.inactivityDays} days by {selectedContainer.owner} or the wider team. Archiving will recover {selectedContainer.size} of operational mass."
                      </p>
                    </div>

                    {/* Execution Button */}
                    <button 
                      onClick={handleArchiveExecution}
                      disabled={isExecuting}
                      className="w-full py-6 rounded-2xl bg-[#00F0FF] text-[#0B0F19] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-[#00F0FF]/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isExecuting ? (
                        <>
                          <Motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Activity className="w-4 h-4" />
                          </Motion.div>
                          <span>Executing Protocol...</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Remediation</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button className="w-full py-4 rounded-xl border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2">
                      <Eye className="w-3.5 h-3.5" /> Deconstruct Intelligence
                    </button>
                  </div>
                </GlassCard>
              </Motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-8 border-2 border-dashed border-white/5 rounded-[48px]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                  <TargetIcon className="w-10 h-10 text-slate-700" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">No Target Selected</h3>
                  <p className="text-[11px] text-slate-600 max-w-[240px] leading-relaxed uppercase tracking-widest font-bold italic">
                    Select a container from the lattice to initialize archival protocols.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Impact Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="p-8 border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-slate-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Success Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">99.8%</span>
            <span className="text-[10px] font-black text-[#00F0FF]">+0.2%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '99.8%' }} />
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-slate-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Metadata Integrity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">100%</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex-1 h-1 bg-emerald-500 rounded-full" />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-slate-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Entropy</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">LOW</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Optimal Sync State</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
