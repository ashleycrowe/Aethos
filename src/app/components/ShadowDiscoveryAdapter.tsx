import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Box as BoxIcon, 
  HardDrive, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  ShieldAlert, 
  Database,
  ArrowUpRight,
  TrendingDown,
  Info,
  ChevronRight,
  Lock,
  Ghost
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';
import { UniversalForensicLab } from './UniversalForensicLab';

interface Adapter {
  id: string;
  name: string;
  type: 'google' | 'box' | 'local';
  status: 'active' | 'syncing' | 'degraded' | 'disconnected';
  waste: string;
  lastScan: string;
  exposure: number;
}

const adapters: Adapter[] = [
  { id: '1', name: 'Google Workspace Federated', type: 'google', status: 'active', waste: '$4,200', lastScan: '14m ago', exposure: 24 },
  { id: '2', name: 'Box Governance Engine', type: 'box', status: 'active', waste: '$1,850', lastScan: '1h ago', exposure: 12 },
  { id: '3', name: 'Local Blob Storage', type: 'local', status: 'syncing', waste: '$8,230', lastScan: 'Syncing...', exposure: 0 },
];

export const ShadowDiscoveryAdapter = () => {
  const { isDaylight } = useTheme();
  const [selectedAdapter, setSelectedAdapter] = useState<Adapter | null>(adapters[0]);
  const [isLabOpen, setIsLabOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'google': return Globe;
      case 'box': return BoxIcon;
      case 'local': return HardDrive;
      default: return Database;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'syncing': return 'bg-blue-500';
      case 'degraded': return 'bg-amber-500';
      case 'disconnected': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Shadow Discovery Adapters</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Tier 2: Leakage Identification & Storage Waste (Dead Capital)</p>
          </div>
          <button className={`px-6 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
            isDaylight ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20'
          }`}>
            + Provision New Adapter
          </button>
        </div>

        <div className="space-y-4">
          {adapters.map((adapter) => {
            const Icon = getIcon(adapter.type);
            const isSelected = selectedAdapter?.id === adapter.id;
            
            return (
              <Motion.div 
                key={adapter.id}
                onClick={() => setSelectedAdapter(adapter)}
                className={`p-6 rounded-[32px] border cursor-pointer transition-all group ${
                  isSelected 
                    ? isDaylight ? 'bg-white border-slate-900 shadow-xl' : 'bg-white/10 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.1)]'
                    : isDaylight ? 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200' : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${isDaylight ? 'bg-white' : 'bg-black/40'} border border-white/5 shadow-inner`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-[#00F0FF]' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{adapter.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(adapter.status)} ${adapter.status === 'syncing' ? 'animate-pulse' : ''}`} />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{adapter.status}</span>
                        </div>
                        <span className="text-slate-800 dark:text-white/10 text-[10px]">|</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Scan: {adapter.lastScan}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-[#FF5733]'}`}>{adapter.waste}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Dead Capital Identified</p>
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>

        <div className={`p-8 rounded-[40px] border border-dashed ${isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.02]'} flex flex-col items-center justify-center text-center space-y-4`}>
          <div className="p-4 rounded-2xl bg-white/5">
            <ShieldAlert className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-tight text-slate-400">Restricted Remediation Zone</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 leading-relaxed max-w-xs mx-auto">
              Tier 2 adapters use the **Alert & Redirect** protocol. Aethos identifies waste but redirection to source governance is required for terminal action.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          {selectedAdapter ? (
            <Motion.div 
              key={selectedAdapter.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="sticky top-10 space-y-8"
            >
              <GlassCard className="p-8 border-t-4 border-t-[#00F0FF]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Operational Artifact Analysis</h3>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[#0B0F19] flex items-center justify-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-[#00F0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       {React.createElement(getIcon(selectedAdapter.type), { className: "w-8 h-8 text-[#00F0FF]" })}
                    </div>
                    <div>
                      <h4 className={`text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{selectedAdapter.name}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Universal Adapter UUID: {selectedAdapter.id}x99-ADPTR</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-3 h-3 text-[#FF5733]" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Reclaimable</span>
                      </div>
                      <p className={`text-2xl font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{selectedAdapter.waste}</p>
                    </div>
                    <div className={`p-5 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-3 h-3 text-amber-500" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Leaks</span>
                      </div>
                      <p className={`text-2xl font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{selectedAdapter.exposure} Clusters</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Disclosure Protocol</h5>
                    <div className="space-y-3">
                      {[
                        { label: 'Notify Source Administrator', icon: AlertTriangle },
                        { label: 'Generate Disclosure Link', icon: ExternalLink },
                        { label: 'Initialize Shadow Sync', icon: RefreshCw },
                      ].map((action, i) => (
                        <button key={i} className={`w-full p-4 rounded-xl border flex items-center justify-between group transition-all ${
                          isDaylight ? 'bg-white border-slate-200 hover:border-slate-900' : 'bg-white/5 border-white/10 hover:border-[#00F0FF]/30'
                        }`}>
                          <div className="flex items-center gap-3">
                            <action.icon className="w-4 h-4 text-slate-500 group-hover:text-[#00F0FF] transition-colors" />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-600' : 'text-slate-400 group-hover:text-white'}`}>{action.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className={`p-8 rounded-[40px] bg-slate-900 border border-white/10 space-y-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/10 blur-[60px] rounded-full" />
                <div className="flex items-center gap-3">
                  <Ghost className="w-5 h-5 text-slate-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Dead Capital Insight</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "Tier 2 adapters are optimized for **leakage detection**. 24 clusters in Google Workspace have been identified as having 'Public on the Web' visibility without being anchored to a Workspace Engine Nexus."
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setIsLabOpen(true)}
                    className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF] hover:underline flex items-center gap-2"
                  >
                    Review In Shadow Forensic Lab <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Motion.div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select an adapter to review architectural depth</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      <UniversalForensicLab 
        isOpen={isLabOpen} 
        onClose={() => setIsLabOpen(false)} 
        selectedAdapter={selectedAdapter?.name} 
      />
    </div>
  );
};
