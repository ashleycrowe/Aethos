import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { 
  Link2, 
  Unlink, 
  Search, 
  HardDrive, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  ArrowRightLeft,
  Filter,
  Layers,
  Box,
  Slack,
  FileText
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IdentityNode {
  id: string;
  source: 'm365' | 'slack' | 'google' | 'box' | 'local';
  type: 'core' | 'shadow';
  label: string;
  email: string;
  confidence: number;
}

const sourceIcons = {
  m365: <Cloud size={16} className="text-[#00F0FF]" />,
  slack: <Slack size={16} className="text-[#E01E5A]" />,
  google: <FileText size={16} className="text-yellow-500" />,
  box: <Box size={16} className="text-blue-500" />,
  local: <HardDrive size={16} className="text-slate-400" />
};

export const LinkageWorkbench: React.FC = () => {
  const [candidates, setCandidates] = useState<IdentityNode[]>([
    { id: '1', source: 'm365', type: 'core', label: 'Sarah J. Miller', email: 'sarah.miller@corp.com', confidence: 100 },
    { id: '2', source: 'google', type: 'shadow', label: 'Sarah Miller', email: 'smiller22@gmail.com', confidence: 94 },
    { id: '3', source: 'box', type: 'shadow', label: 'Sarah Miller', email: 's.miller@box.com', confidence: 88 },
    { id: '4', source: 'local', type: 'shadow', label: 'User_SM', email: 'sm@local-storage', confidence: 65 },
  ]);

  const [linked, setLinked] = useState<string[]>(['1', '2']);

  const toggleLink = (id: string) => {
    if (id === '1') return; // Cannot unlink core anchor
    setLinked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]/40 rounded-2xl border border-white/5 overflow-hidden">
      {/* Workbench Header */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <Layers className="text-[#00F0FF]" size={18} />
          <span className="text-sm font-bold text-white uppercase tracking-wider">Linkage Synthesis</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border border-[#0B0F19] bg-slate-800" />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">3 Experts Linking</span>
        </div>
      </div>

      <div className="flex-1 flex gap-px bg-white/10">
        {/* Left: Search & Filters */}
        <div className="w-1/3 bg-[#0B0F19] p-4 flex flex-col gap-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <input 
               type="text" 
               placeholder="Filter Identity Nodes..." 
               className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#00F0FF]/50 transition-all"
             />
           </div>

           <div className="space-y-1">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Universal Adapter Tiers</span>
             <button className="w-full flex items-center justify-between p-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-medium">
               <div className="flex items-center gap-2">
                 <Cloud size={14} /> Tier 1: Core Anchors
               </div>
               <span className="bg-[#00F0FF]/20 px-1.5 py-0.5 rounded text-[8px]">12</span>
             </button>
             <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-400 text-xs font-medium transition-all">
               <div className="flex items-center gap-2">
                 <Search size={14} /> Tier 2: Shadow Discovery
               </div>
               <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px]">48</span>
             </button>
           </div>

           <div className="mt-auto p-4 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20">
             <div className="flex items-center gap-2 mb-2">
               <ArrowRightLeft className="text-[#00F0FF]" size={14} />
               <span className="text-[10px] font-bold text-white">RECONCILIATION LOGIC</span>
             </div>
             <p className="text-[10px] text-slate-400 leading-relaxed italic">
               "Linking shadow nodes to core anchors transforms 'Dead Capital' into governed assets."
             </p>
           </div>
        </div>

        {/* Right: Interaction Area */}
        <div className="flex-1 bg-[#0B0F19] p-6 relative">
          <div className="grid grid-cols-1 gap-3">
            {candidates.map((node) => (
              <motion.div 
                layout
                key={node.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group",
                  linked.includes(node.id) 
                    ? "bg-[#00F0FF]/5 border-[#00F0FF]/30" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    node.type === 'core' ? "bg-[#00F0FF]/20" : "bg-slate-800"
                  )}>
                    {sourceIcons[node.source]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{node.label}</span>
                      {linked.includes(node.id) && (
                        <CheckCircle2 size={12} className="text-[#00F0FF]" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{node.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Matching</span>
                    <span className={cn(
                      "text-xs font-mono font-bold",
                      node.confidence > 90 ? "text-[#00F0FF]" : "text-[#FF5733]"
                    )}>{node.confidence}%</span>
                  </div>

                  <button 
                    onClick={() => toggleLink(node.id)}
                    disabled={node.type === 'core'}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 transition-all",
                      node.type === 'core' 
                        ? "bg-[#00F0FF]/10 text-[#00F0FF] cursor-default border border-[#00F0FF]/20" 
                        : linked.includes(node.id)
                          ? "bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20 hover:bg-[#FF5733]/20"
                          : "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 hover:bg-[#00F0FF]/20"
                    )}
                  >
                    {node.type === 'core' ? (
                      <>OPERATIONAL ANCHOR</>
                    ) : linked.includes(node.id) ? (
                      <><Unlink size={12} /> DISCONNECT</>
                    ) : (
                      <><Link2 size={12} /> LINK ASSET</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <button className="w-full py-4 rounded-xl bg-[#00F0FF] text-[#0B0F19] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all">
              Execute Universal Synthesis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
