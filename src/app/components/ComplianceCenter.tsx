import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  Server, 
  FileCheck,
  Zap,
  ShieldAlert,
  Fingerprint,
  Info,
  ExternalLink,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

export const ComplianceCenter: React.FC = () => {
  const { isDaylight } = useTheme();

  const auditLogs = [
    { action: 'Sidecar Sync', status: 'Verified', proof: 'P-9482', time: '12m ago' },
    { action: 'PII Scrubbing', status: 'Clean', proof: 'S-2104', time: '45m ago' },
    { action: 'Pointer Validation', status: 'Healthy', proof: 'V-1102', time: '1h ago' },
    { action: 'Zero-Persistence Check', status: 'Passed', proof: 'Z-8837', time: '4h ago' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00F0FF] mb-2">Security & Sovereignty</h2>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Compliance <span className="text-slate-500">Center</span></h1>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
             <FileCheck size={14} /> Audit Report
           </button>
           <button className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-[#0B0F19] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
             <RefreshCcw size={14} /> Re-Verify Sovereignty
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Sovereignty Card */}
        <GlassCard className="lg:col-span-2 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <ShieldCheck size={180} />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">The Sidecar Protocol</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Zero-Persistence Data Non-Retention Proof</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 shrink-0 h-fit">
                    <EyeOff size={18} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">PII Scrubbing</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic">"All content fetched from Microsoft 365 is scrubbed in-memory for PII before metadata extraction. No raw content ever touches the Aethos database."</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 shrink-0 h-fit">
                    <Fingerprint size={18} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Metadata Pointers</h4>
                    <p className="text-xs text-slate-400 leading-relaxed italic">"Aethos stores pointers (IDs and URLs) only. Your data remains in the source system (M365, Google, Box) at all times."</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full border-4 border-[#00F0FF]/20 flex items-center justify-center relative">
                   <CheckCircle2 className="w-12 h-12 text-[#00F0FF]" />
                   <Motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 border-2 border-dashed border-[#00F0FF]/20 rounded-full scale-125"
                   />
                </div>
                <div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Compliance Status</span>
                   <p className="text-2xl font-black text-white uppercase tracking-tight mt-1 text-[#00F0FF]">Fidelity Verified</p>
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Last Audit: Today, 09:12 AM</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Audit Stream */}
        <GlassCard className="p-8 space-y-8">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Sovereignty Audit Stream</h3>
           <div className="space-y-4">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${log.status === 'Verified' ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-emerald-500/10 text-emerald-500'}`}>
                         <ShieldCheck size={14} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white uppercase tracking-tight">{log.action}</p>
                         <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{log.proof}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-[9px] font-black ${log.status === 'Verified' ? 'text-[#00F0FF]' : 'text-emerald-500'} uppercase`}>{log.status}</p>
                      <p className="text-[7px] text-slate-600 font-bold uppercase mt-1">{log.time}</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full py-3 rounded-xl border border-white/10 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={12} /> View Full Transparency Log
           </button>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Infrastructure', value: 'Azure US-East', icon: Server },
           { label: 'Encryption', value: 'AES-256-GCM', icon: Database },
           { label: 'Audit Standard', value: 'SOC2 Type II', icon: FileCheck },
           { label: 'Latency', value: '142ms Peak', icon: Zap }
         ].map((stat, i) => (
           <GlassCard key={i} className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500">
                 <stat.icon size={18} />
              </div>
              <div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-sm font-black text-white uppercase tracking-tight">{stat.value}</p>
              </div>
           </GlassCard>
         ))}
      </div>

      <GlassCard className="p-10 bg-gradient-to-r from-[#FF5733]/5 to-transparent border-[#FF5733]/20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5733]/10 border border-[#FF5733]/20 w-fit">
                  <ShieldAlert size={12} className="text-[#FF5733]" />
                  <span className="text-[8px] font-black text-[#FF5733] uppercase tracking-widest">Policy Exception Alert</span>
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tight">Security Transparency Guarantee</h3>
               <p className="text-sm text-slate-400 max-w-2xl italic leading-relaxed font-medium">
                  "Aethos is architected as an 'Intelligence Overlay'. We never store your passwords, your files, or your messages. Our code is open for review by your IT Security team at any time."
               </p>
            </div>
            <button className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
               Request Security Audit
            </button>
         </div>
      </GlassCard>
    </div>
  );
};
