import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Trash2, 
  Users, 
  ArrowUpRight, 
  Target,
  Cpu,
  Info,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

interface StarlightMetricProps {
  label: string;
  value: string | number;
  subValue: string;
  score: number;
  icon: any;
  color: string;
  story: string;
}

const StarlightMetric: React.FC<StarlightMetricProps> = ({ label, value, subValue, score, icon: Icon, color, story }) => {
  const { isDaylight } = useTheme();
  const [showStory, setShowStory] = React.useState(false);

  return (
    <GlassCard className="p-8 relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/5 border border-white/10`} style={{ color }}>
              <Icon size={18} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{label}</h4>
          </div>
          
          <div className="space-y-1">
            <p className={`text-4xl font-black font-['Space_Grotesk'] tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              {value}
            </p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{subValue}</p>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-xl font-black font-['JetBrains_Mono']`} style={{ color }}>
            {score}%
          </div>
          <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1">Efficiency Index</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
        <button 
          onClick={() => setShowStory(!showStory)}
          className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
        >
          <Info size={12} className={showStory ? 'text-[#00F0FF]' : ''} />
          {showStory ? 'Hide Logic' : 'Deconstruct Intelligence'}
        </button>
        
        <AnimatePresence>
          {showStory && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-[#00F0FF]/30 pl-4 py-1"
            >
              {story}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Icon size={120} />
      </div>
    </GlassCard>
  );
};

export const StarlightScoreReport: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { isDaylight } = useTheme();

  const metrics = [
    {
      label: "Operational Waste",
      value: "842 GB",
      subValue: "Projected $12.4k/yr Leakage",
      score: 68,
      icon: Trash2,
      color: "#FF5733",
      story: "Calculated based on 142 orphaned containers and 4,200 redundant document versions. Every GB above baseline represents $0.20 in operational dead capital."
    },
    {
      label: "Identity Integrity",
      value: "94.2%",
      subValue: "12 Unreconciled Silos",
      score: 94,
      icon: Users,
      color: "#00F0FF",
      story: "Identity federation status across M365, Slack, and Box. 94% of active users have an Identity Anchor, ensuring seamless cross-platform security."
    },
    {
      label: "Information Density",
      value: "1.4x",
      subValue: "Knowledge Velocity Multiplier",
      score: 82,
      icon: Layers,
      color: "#7000FF",
      story: "The ratio of high-value metadata to raw storage. High density indicates a 'Clarified' workspace where intelligence is easily discoverable."
    },
    {
      label: "Exposure Index",
      value: "Low",
      subValue: "3 External Critical Vectors",
      score: 91,
      icon: ShieldCheck,
      color: "#10B981",
      story: "Scan of anonymous sharing links and public-facing guest permissions. Current exposure is minimized by automated 'Freeze' protocols."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-[#0B0F19]/80"
    >
      <div className="w-full max-w-7xl h-full flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00F0FF]">Aethos Intelligence Briefing</h2>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">The Starlight Score <span className="text-slate-500">Board Report</span></h1>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-[#FF5733] transition-all"
          >
            Close Briefing
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-y-auto pr-2">
          {/* Main Score Board */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-12 aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#00F0FF]">Total Operational Clarity</span>
                <div className="text-[120px] font-black text-white leading-none tracking-tighter flex items-start justify-center">
                  86
                  <span className="text-2xl mt-12 text-[#00F0FF]">/100</span>
                </div>
                <div className="pt-8 space-y-4">
                  <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Status: High Fidelity
                  </div>
                  <p className="text-sm text-slate-400 italic max-w-xs leading-relaxed">
                    "Your organization is operating at 86% efficiency. You have recovered $4,200 in storage waste this month."
                  </p>
                </div>
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[20px] border-dashed border-[#00F0FF]/5 rounded-full scale-150" 
              />
            </GlassCard>

            <GlassCard className="p-8 space-y-6">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Strategic Recommendation</h3>
              <div className="flex gap-4">
                <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shrink-0 h-fit">
                  <Target size={18} />
                </div>
                <p className="text-xs text-slate-300 leading-loose italic">
                  Initiate <strong>"Frozen Lattice"</strong> protocols on 42 stale SharePoint containers to achieve an immediate 92% Clarity score by next quarter.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Detailed Metric Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StarlightMetric {...m} />
              </motion.div>
            ))}

            {/* Bottom Actions */}
            <GlassCard className="md:col-span-2 p-10 bg-gradient-to-r from-[#00F0FF]/5 to-[#7000FF]/5 border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Board Ready Presentation</h4>
                <p className="text-sm text-slate-500 italic">Generate a high-fidelity PDF export of this briefing for the executive committee.</p>
              </div>
              <button className="px-10 py-4 rounded-2xl bg-[#00F0FF] text-[#0B0F19] text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 transition-all flex items-center gap-3">
                Export Executive Deck <ChevronRight size={14} />
              </button>
            </GlassCard>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
