import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Target, 
  ShieldAlert, 
  Settings2, 
  Search, 
  ChevronRight, 
  ArrowUpRight,
  Database,
  Cpu,
  Info,
  Sparkles,
  Zap,
  TrendingUp,
  History,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { ForensicLab } from './ForensicLab';
import { LinkageWorkbench } from './LinkageWorkbench';
import { DirectoryManager } from './PeopleCenter';
import { IdentityRiskMatrix } from './IdentityRiskMatrix';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAethos } from '../context/AethosContext';
import { synthesizeSkills } from '../utils/skill-synthesis';
import { toast } from 'sonner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MetricCard: React.FC<{ label: string; value: string; trend: string; positive?: boolean }> = ({ label, value, trend, positive = true }) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00F0FF]/30 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
      <div className={cn("flex items-center gap-1 text-[10px] font-bold", positive ? "text-[#00F0FF]" : "text-[#FF5733]")}>
        {trend} <ArrowUpRight size={10} />
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-1000", positive ? "bg-[#00F0FF]" : "bg-[#FF5733]")} style={{ width: '65%' }} />
    </div>
  </div>
);

export const IdentityEngine: React.FC = () => {
  const { state: { identities, containers } } = useAethos();
  const [activeTab, setActiveTab] = useState('Profiles');
  const [labOpen, setLabOpen] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<any>(null);

  const tabs = [
    { id: 'Profiles', icon: Users, label: 'People Profiles', persona: 'Who is who?' },
    { id: 'Connections', icon: Target, label: 'Account Linkage', persona: 'Who has what?' },
    { id: 'Risk', icon: ShieldAlert, label: 'Risk Exposure', persona: 'Where is the risk?' },
    { id: 'Admin', icon: Settings2, label: 'System Admin', persona: 'How to manage?' },
  ];

  const handleOpenLab = (identity?: any) => {
    setSelectedIdentity(identity);
    setLabOpen(true);
  };

  const handleApplyMerit = (name: string, badge: string) => {
    toast.success('Operational Merit Awarded', {
      description: `${badge} badge has been applied to ${name}'s public profile.`
    });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-6 pb-10">{/* Engine Header */}
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Identity Engine
            <div className="px-2 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF]">
              OPERATIONAL CLARITY
            </div>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Plain-English administrative workbench for federated identity control.</p>
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-[#00F0FF] text-[#0B0F19]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={14} />
              <div className="flex flex-col items-start leading-none">
                <span>{tab.label}</span>
                <span className={cn("text-[7px] uppercase tracking-widest mt-0.5", activeTab === tab.id ? "text-black/60" : "text-slate-600")}>{tab.persona}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Dynamic Content Based on Tab */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'Connections' ? (
              <motion.div 
                key="linkage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <LinkageWorkbench />
              </motion.div>
            ) : activeTab === 'Profiles' ? (
              <motion.div 
                key="profiles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <DirectoryManager />
              </motion.div>
            ) : activeTab === 'Risk' ? (
              <motion.div 
                key="risk"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <IdentityRiskMatrix />
              </motion.div>
            ) : activeTab === 'Admin' ? (
              <motion.div 
                key="admin"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Identity Source Bridge', status: 'Ready', icon: 'B', desc: 'Workday / HRIS Sync', type: 'HRIS' },
                    { name: 'Directory Architecture', status: 'Available', icon: 'D', desc: 'Org Structure Logic', type: 'Admin' },
                    { name: 'Skill Synthesis', status: 'Active', icon: 'S', desc: 'AI Persona Mapping', type: 'Intelligence' },
                    { name: 'Universal SCIM', status: 'Configurable', icon: 'U', desc: 'Cross-platform Sync', type: 'Bridge' }
                  ].map((bridge) => (
                    <div key={bridge.name} className="p-8 rounded-[32px] bg-white/5 border border-white/10 group hover:border-[#00F0FF]/50 transition-all relative overflow-hidden">
                       <div className="flex justify-between items-start relative z-10">
                          <div className="flex gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF] font-black text-xl">
                               {bridge.icon}
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">{bridge.name}</h3>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{bridge.desc}</p>
                             </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-500 font-black uppercase tracking-widest">{bridge.status}</span>
                       </div>
                       <div className="mt-8 flex gap-2 relative z-10">
                          <button className="flex-1 py-3 rounded-xl bg-[#00F0FF] text-[#0B0F19] text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Configure</button>
                          <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Logs</button>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 italic text-sm text-center max-w-md mx-auto">
                <ShieldAlert size={48} className="mb-4 opacity-20" />
                <p>Advanced risk analytics for identity nodes are currently being synthesized with Tier 2 data sources.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Quick Look Stats */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <MetricCard label="Identity Velocity" value="84.5" trend="+12.4%" />
          <MetricCard label="Reconciliation Gap" value="142" trend="-4.2%" positive={false} />
          
          <div className="p-6 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col">
               <div className="flex items-center gap-2 mb-4">
                 <Database className="text-[#00F0FF]" size={16} />
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Oracle Insights</span>
               </div>
               <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                 "I've identified a talent cluster in your M365 tenant specialized in 'Cloud Security'. Should I synthesize a specialized Pulse Channel for them?"
               </p>
               <button className="mt-auto w-full py-2 px-4 rounded-lg bg-[#00F0FF] text-[#0B0F19] text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                 Generate Channel
               </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-3xl group-hover:bg-[#00F0FF]/20 transition-all" />
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Recent Synthesis</h3>
             <div className="space-y-3">
                {[
                  { user: 'Sarah Chen', badge: 'M365 Guru', time: '2h ago' },
                  { user: 'Marcus Thorne', badge: 'Pulse Pioneer', time: '5h ago' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="p-1.5 rounded-lg bg-white/5">
                        <History size={12} className="text-slate-400" />
                     </div>
                     <div>
                        <p className="text-[10px] text-white font-bold">{s.user}</p>
                        <p className="text-[8px] text-slate-500 uppercase font-black">{s.badge} • {s.time}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <ForensicLab 
        isOpen={labOpen} 
        onClose={() => setLabOpen(false)} 
        identity={selectedIdentity} 
      />
    </div>
  );
};