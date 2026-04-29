import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Info, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Shield, 
  Zap,
  Clock,
  Trash2,
  Share2,
  Filter
} from 'lucide-react';
import { useOracle, OracleInsight } from '../context/OracleContext';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

export const IntelligenceStream = () => {
  const { insights } = useOracle();
  const { isDaylight } = useTheme();
  const [filter, setFilter] = useState<'all' | 'waste' | 'identity' | 'governance'>('all');
  const [isStoryMode, setIsStoryMode] = useState(false);

  const filteredInsights = insights.filter(ins => filter === 'all' || ins.type === filter);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
        {/* Intelligence Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Live Intelligence Stream</h2>
            </div>
            <h1 className={`text-fluid-3xl font-black uppercase tracking-tighter leading-[0.8] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              Operational<br /><span className="text-[#00F0FF]">Insights</span>
            </h1>
            <div className="flex items-center gap-6">
              <p className={`text-sm ${isDaylight ? 'text-slate-500' : 'text-slate-400'} max-w-xl italic font-medium leading-relaxed`}>
                "Predictive heuristics identifying Dead Capital, Identity Decay, and Workspace Drag in real-time."
              </p>
              <div className="w-px h-10 bg-white/10" />
              <button 
                onClick={() => setIsStoryMode(!isStoryMode)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${isStoryMode ? 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
              >
                <Cpu size={14} className={isStoryMode ? 'animate-pulse' : ''} />
                <span className="text-[9px] font-black uppercase tracking-widest">{isStoryMode ? 'Story Mode Active' : 'Enable Story Mode'}</span>
              </button>
            </div>
          </div>

          <div className={`flex items-center p-1.5 rounded-2xl border transition-all shrink-0 ${isDaylight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
            {(['all', 'waste', 'identity', 'governance'] as const).map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all ${
                  filter === f 
                    ? (isDaylight ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-black shadow-xl') 
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Insights Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Main Feed */}
          <div className="xl:col-span-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredInsights.map((insight, idx) => (
                <InsightCard key={insight.id} insight={insight} index={idx} isDaylight={isDaylight} isStoryMode={isStoryMode} />
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar: Operational Velocity */}
          <div className="xl:col-span-4 space-y-8">
            <GlassCard className="p-8 space-y-8 sticky top-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">System Metrics</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inference Confidence</span>
                    <span className="text-xl font-black text-white font-mono">98.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" style={{ width: '98.4%' }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reconciliation Velocity</span>
                    <span className="text-xl font-black text-white font-mono">1.2s</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <h4 className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Architect Tip</h4>
                <p className="text-[11px] text-slate-400 italic leading-relaxed">
                  "Oracle insights are prioritized by capital recovery potential. Focus on 'Supernova' orange flags to maximize 30-day ROI."
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightCard = forwardRef<HTMLDivElement, { insight: OracleInsight, index: number, isDaylight: boolean, isStoryMode: boolean }>(({ insight, index, isDaylight, isStoryMode }, ref) => {
  const [showLogic, setShowLogic] = useState(false);

  // Auto-show logic if Story Mode is OFF, otherwise hide it behind the CPU icon as per guidelines
  // Actually, guidelines say: "Narrative Logic Layer: Never show raw technical calculations by default. Hide them behind the Cpu or Info icon. Provide a 'Story' version of every metric."
  // So Story mode should probably focus on the NARRATIVE, while Logic mode shows the CALCULATION.
  
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className={`p-10 border group overflow-hidden transition-all duration-500 ${
        insight.impact === 'critical' ? 'border-[#FF5733]/40 bg-[#FF5733]/5' : 
        insight.impact === 'high' ? 'border-[#00F0FF]/40 bg-[#00F0FF]/5' : 
        'border-white/10'
      } ${isStoryMode ? 'ring-1 ring-[#00F0FF]/20 shadow-[0_0_40px_rgba(0,240,255,0.05)]' : ''}`}>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Status Indicator */}
          <div className="flex flex-col items-center gap-4 shrink-0">
             <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-700 ${
               isStoryMode ? 'rotate-[360deg] bg-[#00F0FF] text-black border-[#00F0FF]' :
               insight.impact === 'critical' ? 'bg-[#FF5733]/20 border-[#FF5733]/40 text-[#FF5733]' : 
               insight.impact === 'high' ? 'bg-[#00F0FF]/20 border-[#00F0FF]/40 text-[#00F0FF]' : 
               'bg-white/5 border-white/10 text-slate-400'
             }`}>
               {isStoryMode ? <Sparkles className="w-8 h-8" /> :
                insight.type === 'waste' ? <Trash2 className="w-8 h-8" /> : 
                insight.type === 'identity' ? <Shield className="w-8 h-8" /> : 
                <Zap className="w-8 h-8" />}
             </div>
             <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
               insight.impact === 'critical' ? 'bg-[#FF5733]/10 border-[#FF5733]/20 text-[#FF5733]' : 
               'bg-white/5 border-white/10 text-slate-500'
             }`}>
               {isStoryMode ? 'STORY' : insight.impact}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                {insight.type} Intelligence • {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex items-center gap-4">
                {isStoryMode && <div className="px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] text-[7px] font-black uppercase tracking-widest">Oracle Optimized</div>}
                <button className="text-slate-600 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className={`text-2xl font-black uppercase tracking-tighter leading-tight transition-all ${isDaylight ? 'text-slate-900' : 'text-white'} ${isStoryMode ? 'text-[#00F0FF]' : ''}`}>
                {isStoryMode ? `The Story of ${insight.title}` : insight.title}
              </h3>
              <p className={`text-sm leading-relaxed italic font-medium transition-all ${isDaylight ? 'text-slate-600' : 'text-slate-400'} ${isStoryMode ? 'text-lg text-white not-italic' : ''}`}>
                {insight.narrative}
              </p>
            </div>

            {/* Hidden Logic Layer */}
            <AnimatePresence>
              {(showLogic || (isStoryMode && !showLogic)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`mt-6 p-6 rounded-2xl border font-mono text-[10px] space-y-2 transition-all ${
                    isStoryMode ? 'bg-[#00F0FF]/5 border-[#00F0FF]/20 text-white font-sans text-xs italic' : 'bg-black/40 border-white/10 text-[#00F0FF]'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isStoryMode ? <Info className="w-3.5 h-3.5 text-[#00F0FF]" /> : <Cpu className="w-3.5 h-3.5" />}
                      <span className="uppercase font-black tracking-widest">
                        {isStoryMode ? 'Operational Context' : 'Heuristic Calculation'}
                      </span>
                    </div>
                    <p className="leading-relaxed opacity-80">
                      {isStoryMode ? `This intelligence was synthesized by the Oracle to help you achieve operational clarity. By acting on this, you move from a "Security Janitor" to an "Operational Architect," ensuring your tenant is optimized for growth rather than maintenance.` : insight.calculation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-white/5">
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogic(!showLogic)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${showLogic ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  {showLogic ? <Info className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  {showLogic ? 'Hide Narrative Logic' : 'Deconstruct Intelligence'}
                </button>
              </div>

              <button className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 ${
                isStoryMode ? 'bg-[#00F0FF] text-black shadow-[0_0_30px_rgba(0,240,255,0.4)]' :
                insight.impact === 'critical' || insight.impact === 'high'
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}>
                {insight.suggestedAction} <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
});

InsightCard.displayName = 'InsightCard';