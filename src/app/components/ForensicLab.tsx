import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Cpu, 
  ChevronRight, 
  ArrowRight,
  User,
  Zap,
  History,
  Target,
  Database,
  Search
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { LatticeDeconstruction } from './LatticeDeconstruction';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const velocityData = [
  { name: 'Mon', risk: 20, clarity: 40 },
  { name: 'Tue', risk: 35, clarity: 38 },
  { name: 'Wed', risk: 25, clarity: 55 },
  { name: 'Thu', risk: 45, clarity: 65 },
  { name: 'Fri', risk: 30, clarity: 75 },
  { name: 'Sat', risk: 15, clarity: 85 },
  { name: 'Sun', risk: 10, clarity: 92 },
];

interface NarrativeMetricProps {
  label: string;
  value: string | number;
  story: string;
  calculation: string;
  status?: 'success' | 'warning' | 'error';
}

const NarrativeMetric: React.FC<NarrativeMetricProps> = ({ label, value, story, calculation, status = 'success' }) => {
  const [showLogic, setShowLogic] = useState(false);

  return (
    <div className="relative group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00F0FF]/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-slate-400 font-medium">{label}</span>
        <button 
          onMouseEnter={() => setShowLogic(true)}
          onMouseLeave={() => setShowLogic(false)}
          className="text-slate-500 hover:text-[#00F0FF] transition-colors"
        >
          {showLogic ? <Cpu size={14} className="text-[#00F0FF]" /> : <Info size={14} />}
        </button>
      </div>
      
      <div className="text-2xl font-semibold tracking-tight text-white mb-1">
        {value}
      </div>

      <div className="min-h-[40px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!showLogic ? (
            <motion.p 
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-slate-300 italic"
            >
              "{story}"
            </motion.p>
          ) : (
            <motion.div 
              key="logic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[10px] font-mono text-[#00F0FF]/80 leading-relaxed"
            >
              {calculation}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500",
        status === 'success' ? "bg-[#00F0FF]" : "bg-[#FF5733]"
      )} />
    </div>
  );
};

export const ForensicLab: React.FC<{ isOpen: boolean; onClose: () => void; identity?: any; label?: string }> = ({ isOpen, onClose, identity, label }) => {
  const [isDeconOpen, setIsDeconOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0F19]/90 backdrop-blur-md p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[32px] border border-white/10 bg-[#0B0F19] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#00F0FF]/5 to-transparent">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20">
                <Dna className="text-[#00F0FF]" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                  Identity Forensic Lab
                  <span className="px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 font-black">
                    Architect Mode
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Analyzing cross-tenant synthesis for {identity?.name || 'Candidate_Alpha'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <Zap size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="grid grid-cols-12 gap-10">
              
              {/* Left Column: Metrics & Story */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Snapshot Analytics</h3>
                
                <NarrativeMetric 
                  label="Identity Velocity" 
                  value="94.2" 
                  story="Active movement across core and shadow systems indicates high operational integration."
                  calculation="SUM(delta_actions) / normalized_time_window"
                />
                
                <NarrativeMetric 
                  label="Risk Resonance" 
                  value="12%" 
                  story="Negligible leakage identified. Identity is anchored primarily in Microsoft 365."
                  calculation="COUNT(unverified_links) / TOTAL_LINKS(identity)"
                  status="success"
                />

                <NarrativeMetric 
                  label="Storage Waste" 
                  value="4.2 GB" 
                  story="Orphaned containers found in personal Box storage from 2024 legacy project."
                  calculation="SUM(file_size) WHERE status = 'unmanaged'"
                  status="warning"
                />

                <div className="p-6 rounded-3xl bg-[#FF5733]/5 border border-[#FF5733]/20 mt-10">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="text-[#FF5733]" size={18} />
                    <span className="text-sm font-black text-[#FF5733] uppercase tracking-tight">Inefficiency Identified</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium italic">
                    "This identity has duplicate records in Google Workspace and Microsoft 365. Suggesting immediate reconciliation to purge dead capital."
                  </p>
                  <button className="w-full py-3 px-4 rounded-xl bg-[#FF5733]/10 hover:bg-[#FF5733]/20 text-[#FF5733] text-[10px] font-black uppercase tracking-widest transition-all border border-[#FF5733]/20">
                    Initialize Purge Sequence
                  </button>
                </div>
              </div>

              {/* Middle/Right Column: Visualization & Interaction */}
              <div className="col-span-12 lg:col-span-8 space-y-10">
                
                {/* Identity Velocity Chart */}
                <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <Activity className="text-[#00F0FF]" size={20} />
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Cross-Lattice Velocity</span>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Clarity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF5733]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Risk</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={velocityData}>
                        <defs>
                          <linearGradient id="colorClarity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={9} 
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="clarity" 
                          stroke="#00F0FF" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorClarity)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="risk" 
                          stroke="#FF5733" 
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#FF5733', strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Linking Engine Section */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                    <Target size={16} className="text-[#00F0FF]" />
                    Universal Linkage Workbench
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Tier 1 - Primary */}
                    <div className="p-6 rounded-[32px] bg-[#00F0FF]/5 border border-[#00F0FF]/20 flex flex-col justify-center items-center text-center group transition-all">
                      <div className="w-14 h-14 rounded-[20px] bg-[#0B0F19] border border-[#00F0FF]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="text-[#00F0FF]" size={28} />
                      </div>
                      <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-[0.2em] mb-1">Operational Anchor</span>
                      <span className="text-base font-black text-white uppercase tracking-tight">Microsoft 365</span>
                      <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">ID: m365_8829_alpha</span>
                    </div>

                    {/* Tier 2 - Potential */}
                    <div className="p-6 rounded-[32px] bg-white/5 border border-dashed border-white/20 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white/10 transition-all">
                      <div className="w-14 h-14 rounded-[20px] bg-[#0B0F19] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <History className="text-slate-500 group-hover:text-white transition-colors" size={28} />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Shadow Discovery</span>
                      <span className="text-base font-black text-slate-400 uppercase tracking-tight group-hover:text-white transition-colors">Google Workspace</span>
                      <span className="text-[9px] font-black text-[#00F0FF] mt-2 uppercase tracking-widest animate-pulse">94% Match Identified</span>
                    </div>
                  </div>
                </div>

                {/* Deconstruct Intelligence Button */}
                <div className="pt-6">
                  <button 
                    onClick={() => setIsDeconOpen(true)}
                    className="w-full group relative overflow-hidden p-8 rounded-[36px] bg-gradient-to-br from-[#00F0FF]/20 to-[#00F0FF]/5 border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 transition-all duration-500 shadow-2xl shadow-[#00F0FF]/10"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                           <Database className="w-5 h-5 text-[#00F0FF]" />
                           <span className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.3em]">Lattice Protocol v4</span>
                        </div>
                        <span className="block text-3xl font-black text-white uppercase tracking-tighter group-hover:tracking-wider transition-all">Deconstruct Intelligence</span>
                        <span className="text-xs font-medium text-slate-400 mt-2 block">Analyze raw telemetry nodes, temporal anchors, and operational gravity points.</span>
                      </div>
                      <div className="p-5 rounded-3xl bg-black/40 border border-white/10 group-hover:bg-[#00F0FF] group-hover:text-black group-hover:scale-110 transition-all">
                        <ArrowRight size={32} />
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(0,240,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <LatticeDeconstruction 
        isOpen={isDeconOpen} 
        onClose={() => setIsDeconOpen(false)} 
        label={label || identity?.name} 
      />
    </>
  );
};
