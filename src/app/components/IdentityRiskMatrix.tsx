import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Zap, 
  Target, 
  AlertTriangle, 
  ArrowUpRight, 
  Globe, 
  Slack, 
  Box, 
  Database,
  Lock,
  Eye,
  Activity
} from 'lucide-react';
import { useAethos } from '../context/AethosContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IdentityRiskMatrix: React.FC = () => {
  const { state: { identities } } = useAethos();

  // Filter for high risk identities
  const highRiskNodes = identities.filter(id => id.riskFactor > 10 || id.status === 'orphaned');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Risk Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[32px] bg-[#FF5733]/5 border border-[#FF5733]/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[#FF5733]/10 text-[#FF5733]">
                <ShieldAlert size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5733]">Global Blast Radius</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-white font-mono">14.2</h3>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">PB / node</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium italic">
              "Average data exposure per identity if a single node is compromised across the Tier 1/2 spectrum."
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FF5733]/5 rounded-full blur-[80px]" />
        </div>

        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Orphaned Nodes</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-mono">28</h3>
            <span className="text-sm font-bold text-[#FF5733] uppercase tracking-widest">+4 this wk</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium italic">
            "Identities detected in Tier 2 (Box/Google) with no active anchor in Tier 1 (M365/HRIS)."
          </p>
        </div>

        <div className="p-8 rounded-[32px] bg-[#00F0FF]/5 border border-[#00F0FF]/20 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
               <Activity size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00F0FF]">Integrity Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-white font-mono">82%</h3>
            <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Stable</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium italic">
            "System-wide confidence in identity-to-asset mapping across all universal adapters."
          </p>
        </div>
      </div>

      {/* Main Risk Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Risk Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Critical Exposure Log</h2>
            <div className="flex items-center gap-4">
              <button className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest hover:underline">Download Audit</button>
              <div className="h-4 w-px bg-white/10" />
              <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Sort by Radius</button>
            </div>
          </div>

          <div className="space-y-4">
            {highRiskNodes.map((node, i) => (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[24px] bg-[#0B0F19]/60 backdrop-blur-xl border border-white/10 hover:border-[#FF5733]/50 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl border-2 border-white/10 overflow-hidden bg-slate-800">
                        <img src={node.avatar || `https://ui-avatars.com/api/?name=${node.name}&background=random`} alt={node.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B0F19] border border-white/10 flex items-center justify-center">
                        {node.provider === 'microsoft' ? <Globe size={10} className="text-blue-500" /> :
                         node.provider === 'slack' ? <Slack size={10} className="text-[#E01E5A]" /> :
                         <Box size={10} className="text-blue-400" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-3">
                        {node.name}
                        {node.status === 'orphaned' && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FF5733]/10 border border-[#FF5733]/30 text-[8px] text-[#FF5733] font-black uppercase">Orphaned Node</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{node.role} • {node.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-center md:text-right">
                       <span className="block text-[8px] text-slate-600 uppercase font-black mb-1">Blast Radius</span>
                       <div className="flex items-center gap-2">
                         <span className="text-lg font-black text-[#FF5733] font-mono">{node.riskFactor * 1.5}TB</span>
                         <ArrowUpRight size={14} className="text-[#FF5733]" />
                       </div>
                    </div>
                    <div className="h-10 w-px bg-white/5" />
                    <div className="flex gap-2">
                       <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Deconstruct</button>
                       <button className="px-4 py-2 rounded-xl bg-[#FF5733] text-white text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF5733]/20">Mitigate</button>
                    </div>
                  </div>
                </div>
                
                {/* Visual risk intensity indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5733]" style={{ opacity: node.riskFactor / 100 }} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Risk Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-8">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Exposure Vectors</h3>
            <div className="space-y-6">
              {[
                { label: 'Tier 2 Shadow Admin', value: '4 nodes', color: '#FF5733' },
                { label: 'Unanchored Box Accounts', value: '12 nodes', color: '#FF5733' },
                { label: 'Cross-Tenant Perm Drift', value: 'High', color: '#amber-500' },
                { label: 'Orphaned Pulse Channels', value: 'Low', color: '#00F0FF' },
              ].map((v, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.label}</span>
                    <span className="text-[11px] font-black text-white uppercase">{v.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF5733]" style={{ width: i === 0 ? '80%' : i === 1 ? '60%' : '30%', opacity: 1 - (i * 0.2) }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Operational Advisory</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  "I've detected a significant increase in orphaned nodes originating from the Google Workspace adapter. This typically indicates a failure in the HRIS-to-Google sync protocol."
                </p>
                <button className="w-full py-2 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all">
                  Initialize Sync Audit
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#FF5733]/10 to-transparent border border-[#FF5733]/20 space-y-6">
             <div className="flex items-center gap-3">
               <Lock size={18} className="text-[#FF5733]" />
               <h3 className="text-[10px] uppercase tracking-[0.4em] text-white font-black">Auto-Mitigation</h3>
             </div>
             <p className="text-xs text-slate-300 leading-relaxed">
               Enable Aethos to automatically "Soft-Gate" orphaned nodes after 14 days of inactivity.
             </p>
             <button className="w-full py-4 rounded-2xl bg-[#FF5733] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#FF5733]/20 hover:scale-105 active:scale-95 transition-all">
               Enable Risk Automations
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
