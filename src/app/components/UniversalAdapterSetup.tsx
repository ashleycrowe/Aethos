import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Globe, 
  Slack, 
  Box as BoxIcon, 
  Share2,
  ExternalLink,
  ChevronRight,
  Zap,
  Lock,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { ProviderType } from '../types/aethos.types';
import { toast } from 'sonner';

const providerIcons: Record<ProviderType, any> = {
  microsoft: Share2,
  google: Globe,
  slack: Slack,
  box: BoxIcon,
  local: Database
};

export const UniversalAdapterSetup = () => {
  const { isDaylight } = useTheme();
  const [connecting, setConnecting] = useState<string | null>(null);
  
  const adapters = [
    { id: 'ms-1', name: 'Microsoft 365 Tenant', provider: 'microsoft', status: 'connected', tier: 'Tier 1 (Anchor)', capabilities: ['Full Management', 'Bi-directional Sync', 'Direct Archival'] },
    { id: 'sl-1', name: 'Slack Enterprise', provider: 'slack', status: 'connected', tier: 'Tier 1 (Anchor)', capabilities: ['Channel Archival', 'Identity Pulse', 'Message Audit'] },
    { id: 'go-1', name: 'Google Workspace', provider: 'google', status: 'discovery', tier: 'Tier 2 (Shadow)', capabilities: ['Leakage Identification', 'Shadow Discovery', 'Alert & Redirect'] },
    { id: 'bx-1', name: 'Box Governance', provider: 'box', status: 'error', tier: 'Tier 2 (Shadow)', capabilities: ['Vault Movement', 'File Locking'] },
  ];

  const handleConnect = (name: string) => {
    setConnecting(name);
    setTimeout(() => {
      setConnecting(null);
      toast.success(`Adapter Handshake Successful`, {
        description: `${name} is now synchronized with the Universal Metadata Engine.`
      });
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl md:text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Adapter Synthesis</h3>
          <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 leading-relaxed">Connect and calibrate your operational environment</p>
        </div>
        <button className={`w-full md:w-auto px-6 py-4 md:py-3 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center justify-center gap-3 transition-all ${
          isDaylight ? 'bg-slate-900 text-white shadow-xl' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20 hover:scale-105 active:scale-95'
        }`}>
          <Plus className="w-4 h-4" />
          Provision New Adapter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adapters.map((adapter) => (
          <div 
            key={adapter.id}
            className={`p-6 rounded-[28px] border transition-all relative overflow-hidden group ${
              isDaylight 
                ? 'bg-white border-slate-100 hover:border-slate-300' 
                : 'bg-white/5 border-white/5 hover:border-white/10 shadow-2xl'
            }`}
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${
                  adapter.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 
                  adapter.status === 'error' ? 'bg-[#FF5733]/10 text-[#FF5733]' : 
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {React.createElement(providerIcons[adapter.provider as ProviderType], { className: "w-6 h-6" })}
                </div>
                <div>
                  <h4 className={`text-sm font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{adapter.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      adapter.status === 'connected' ? 'bg-emerald-500' : 
                      adapter.status === 'error' ? 'bg-[#FF5733]' : 'bg-blue-500'
                    }`} />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{adapter.status} • {adapter.tier}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 transition-colors">
                <RefreshCw className={`w-4 h-4 ${connecting === adapter.name ? 'animate-spin text-[#00F0FF]' : ''}`} onClick={() => handleConnect(adapter.name)} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Enabled Capabilities
              </p>
              <div className="flex flex-wrap gap-2">
                {adapter.capabilities.map((cap, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                    isDaylight ? 'bg-slate-50 text-slate-500 border border-slate-100' : 'bg-black/20 text-slate-400 border border-white/5'
                  }`}>
                    {cap}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-2">
                Manage Permissions <ExternalLink className="w-3 h-3" />
              </button>
              <div className={`p-2 rounded-lg ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
                <Activity className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            
            {adapter.status === 'error' && (
              <div className="absolute inset-0 bg-[#FF5733]/5 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <div className="bg-[#FF5733] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Handshake Failed
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`p-8 rounded-[32px] border ${isDaylight ? 'bg-blue-50 border-blue-100' : 'bg-[#00F0FF]/5 border-[#00F0FF]/10'}`}>
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF] shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <h4 className={`text-sm font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`}>Universal Adapter Logic</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl italic">
              Aethos abstracts the complexity of individual provider APIs. You define the **Operational Intent**, and our adapters handle the **Technical Execution**. No additional configuration is required on the source systems.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No Local Agent Required
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-Scaling Discovery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
