import React, { useState } from 'react';
import { 
  Target, 
  Trash2, 
  Archive, 
  Search, 
  Filter, 
  Layers, 
  Layout, 
  List, 
  Activity,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { StarMap } from './StarMap';
import { GlassCard } from './GlassCard';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VoyagerWorkbench: React.FC = () => {
  const [viewMode, setViewMode] = useState<'lattice' | 'inventory'>('lattice');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const remediationQueue = [
    { id: 'rem-1', title: 'Archive: Project_X_Legacy', provider: 'M365', size: '1.2TB', reason: 'No owner detected for 180 days', status: 'Pending' },
    { id: 'rem-2', title: 'Vault: Q3_Financials_Drafts', provider: 'Box', size: '42GB', reason: 'High exposure risk', status: 'Pending' },
    { id: 'rem-3', title: 'Purge: Temp_Working_Files', provider: 'Google', size: '200GB', reason: 'Storage waste identified', status: 'Pending' }
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      {/* 1. PURPOSE: The Executive Narrative Layer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <GlassCard className="p-6 bg-white/5 border-white/10">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Operational Anchor</span>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/20">
               <Target className="text-[#00F0FF]" size={20} />
             </div>
             <div>
               <h3 className="text-xl font-black text-white leading-none">88%</h3>
               <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Tenant Clarity</p>
             </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 bg-[#FF5733]/5 border-[#FF5733]/20 col-span-2">
           <div className="flex justify-between items-center h-full">
              <div className="space-y-1">
                <span className="block text-[8px] font-black text-[#FF5733] uppercase tracking-[0.4em]">Governance Target</span>
                <h3 className="text-3xl font-black text-white font-mono">$14,280<span className="text-xs text-slate-500 ml-2">Potential Savings</span></h3>
              </div>
              <div className="flex items-center gap-6 pr-4">
                 <div className="text-right">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Waste Ratio</span>
                    <span className="text-lg font-black text-white font-mono">42%</span>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div className="text-right">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Ghost Nodes</span>
                    <span className="text-lg font-black text-white font-mono">142</span>
                 </div>
              </div>
           </div>
        </GlassCard>

        <div className="flex flex-col gap-3">
           <button className="flex-1 rounded-2xl bg-[#00F0FF] text-[#0B0F19] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              Initialize Mass Archive
              <ArrowRight size={14} />
           </button>
           <button className="flex-1 rounded-2xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              Batch Deletion Strategy
           </button>
        </div>
      </div>

      {/* 2. FUNCTIONALITY: The Forensic Interaction Layer */}
      <div className="flex-1 min-h-0 flex gap-6">
        {/* Sidebar Controls */}
        <div className="w-80 flex flex-col gap-6 shrink-0">
           {/* Remediation Queue - The actual functional engine of Voyager */}
           <GlassCard className="p-6 bg-white/5 border-white/10 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Remediation Queue</h4>
                <div className="px-1.5 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] text-[8px] font-black">3 PENDING</div>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                 {remediationQueue.map((item) => (
                   <div 
                     key={item.id}
                     className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 group hover:border-[#00F0FF]/30 transition-all"
                   >
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-white block">{item.title}</span>
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.provider} • {item.size}</span>
                        </div>
                        <span className="text-[8px] font-black text-[#FF5733] uppercase">Risk</span>
                     </div>
                     <p className="text-[9px] text-slate-500 italic leading-relaxed">
                        {item.reason}
                     </p>
                     <button 
                       onClick={() => {
                         toast.success(`Initializing ${item.provider} Protocol`, {
                           description: item.provider === 'M365' ? 'Container set to Read-Only. Metadata preserved.' : 
                                        item.provider === 'Box' ? 'Artifact moved to Governance_Vault. File locked.' : 
                                        'Artifact moved to [Aethos_Archive]. Permissions revoked.'
                         });
                       }}
                       className="w-full py-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-[9px] font-black uppercase tracking-widest hover:bg-[#00F0FF] hover:text-black transition-all"
                     >
                       Execute Universal Adapter
                     </button>
                   </div>
                 ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                 <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
                   View Full History
                 </button>
              </div>
           </GlassCard>

           <GlassCard className="p-6 bg-white/5 border-white/10 shrink-0">
              <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-4">View Protocol</h4>
              <div className="space-y-2">
                 {[
                   { id: 'lattice', label: 'Relational Lattice', icon: Layers },
                   { id: 'inventory', label: 'Inventory List', icon: List },
                 ].map((mode) => (
                   <button 
                     key={mode.id}
                     onClick={() => setViewMode(mode.id as any)}
                     className={cn(
                       "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider",
                       viewMode === mode.id 
                        ? "bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]" 
                        : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-white"
                     )}
                   >
                     <mode.icon size={14} />
                     {mode.label}
                   </button>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-6 bg-white/5 border-white/10 flex-1 flex flex-col">
              <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-4">Forensic Filters</h4>
              <div className="space-y-4 flex-1">
                 <div className="space-y-2">
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Storage Age</span>
                    <input type="range" className="w-full accent-[#00F0FF] opacity-50" />
                 </div>
                 <div className="space-y-2">
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Sensitivity Score</span>
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map(i => (
                         <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-[#00F0FF]' : 'bg-white/10'}`} />
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/10">
                 <div className="p-4 rounded-xl bg-[#FF5733]/5 border border-[#FF5733]/20 space-y-2">
                    <div className="flex items-center gap-2 text-[#FF5733]">
                       <ShieldAlert size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">System Warning</span>
                    </div>
                    <p className="text-[9px] text-slate-500 italic leading-relaxed">
                      "14% of your M365 containers have had no operational activity in 180 days."
                    </p>
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative rounded-[40px] border border-white/10 overflow-hidden bg-[#0B0F19]/60">
           <AnimatePresence mode="wait">
             {viewMode === 'lattice' ? (
               <Motion.div 
                 key="lattice"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full h-full"
               >
                 <StarMap height="100%" />
               </Motion.div>
             ) : (
               <Motion.div 
                 key="inventory"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 className="w-full h-full p-10 overflow-y-auto custom-scrollbar"
               >
                 <div className="space-y-4">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter">Container Inventory</h3>
                     <div className="flex items-center gap-3">
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                           <input 
                             type="text" 
                             placeholder="Search nodes..." 
                             className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-[#00F0FF]/50" 
                           />
                        </div>
                        <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                           <Filter size={16} />
                        </button>
                     </div>
                   </div>
                   
                   <table className="w-full">
                     <thead>
                       <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-left border-b border-white/10">
                         <th className="pb-4">Name</th>
                         <th className="pb-4 text-center">Provider</th>
                         <th className="pb-4 text-right">Size</th>
                         <th className="pb-4 text-right">Operational Age</th>
                         <th className="pb-4 text-right">Risk Score</th>
                         <th className="pb-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                         <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                           <td className="py-4">
                             <div className="flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full", i % 3 === 0 ? 'bg-[#FF5733]' : 'bg-[#00F0FF]')} />
                                <span className="text-xs font-bold text-white">SharePoint_Root_Archive_{i}</span>
                             </div>
                           </td>
                           <td className="py-4 text-center">
                             <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">M365</span>
                           </td>
                           <td className="py-4 text-right">
                             <span className="text-xs font-mono text-slate-300">420 GB</span>
                           </td>
                           <td className="py-4 text-right">
                             <span className="text-xs font-mono text-slate-300">182 Days</span>
                           </td>
                           <td className="py-4 text-right">
                             <div className="inline-flex items-center gap-2">
                               <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#FF5733]" style={{ width: `${Math.random() * 100}%` }} />
                               </div>
                             </div>
                           </td>
                           <td className="py-4 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-[#00F0FF]/10 text-slate-500 hover:text-[#00F0FF] rounded-lg transition-all"><Archive size={14} /></button>
                                <button className="p-2 hover:bg-[#FF5733]/10 text-slate-500 hover:text-[#FF5733] rounded-lg transition-all"><Trash2 size={14} /></button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </Motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
