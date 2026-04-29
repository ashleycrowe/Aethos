import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { StarMap } from './StarMap';
import { useOracle } from '../context/OracleContext';
import { useAethos } from '../context/AethosContext';
import { WorkspaceWizard } from './WorkspaceWizard';
import { useTheme } from '../context/ThemeContext';
import { 
  Zap,
  Search,
  Command,
  ChevronRight,
  Plus,
  ShieldAlert,
  Shapes,
  Sparkles,
  Telescope,
  Layout,
  TrendingDown,
  Activity,
  History,
  Archive,
  ArrowRight,
  BarChart3,
  Flame,
  Clock,
  Database,
  ArrowLeft,
  Maximize2,
  Info,
  Cpu,
  BarChart,
  Target,
  Box,
  Globe,
  HardDrive,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface VoyagerViewProps {
  onExit?: () => void;
  embedded?: boolean;
}

const DiagnosticMetricCard = ({ stat, handleOpenLab }: { stat: any, handleOpenLab: (c: any) => void }) => {
  const { isDaylight } = useTheme();
  const [showCalculation, setShowCalculation] = useState(false);

  return (
    <div 
      className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col h-full ${
        isDaylight ? 'bg-white border-slate-100 hover:border-slate-300' : 'bg-white/[0.03] border-white/5 hover:border-[#00F0FF]/30'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-2.5 rounded-xl bg-white dark:bg-black/40 shadow-sm">
          <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onMouseEnter={() => setShowCalculation(true)}
            onMouseLeave={() => setShowCalculation(false)}
            className={`p-1.5 rounded-lg transition-all ${showCalculation ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black') : 'text-slate-400'}`}
          >
            <Cpu className="w-3 h-3" />
          </button>
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10" style={{ color: stat.color }}>
            {stat.trend}
          </span>
        </div>
      </div>
      
      <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{stat.label}</h4>
      <div className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-none">{stat.value}</div>
      
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {showCalculation ? (
            <Motion.div 
              key="calc"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`p-3 rounded-xl text-[9px] font-mono leading-relaxed mb-4 ${isDaylight ? 'bg-slate-50 text-slate-600' : 'bg-black/40 text-[#00F0FF]/80'}`}
            >
              {stat.calculation}
            </Motion.div>
          ) : (
            <Motion.div 
              key="story"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4 line-clamp-2"
            >
              {stat.story}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => handleOpenLab({ type: 'category', category: stat.category, label: stat.label })}
        className={`w-full py-2.5 rounded-xl border text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-auto ${
          isDaylight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-[#00F0FF]/40 hover:text-white'
        }`}
      >
        Deconstruct
      </button>
    </div>
  );
};

export const VoyagerView: React.FC<VoyagerViewProps> = ({ embedded = false }) => {
  const { state: { workspaces, forensicContext }, openForensicLab } = useAethos();
  const { setIsOpen: setOracleOpen } = useOracle();
  const [layoutMode, setLayoutMode] = useState<'synthesis' | 'cartography' | 'hybrid'>('hybrid'); 
  const [isSimulating, setIsSimulating] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleOpenLab = (context: Partial<typeof forensicContext>) => {
    openForensicLab({
      type: 'universal',
      ...context
    } as any);
  };

  const primaryMetrics = [
    { 
      id: 'waste', 
      label: "Storage Waste", 
      value: "$14,280", 
      trend: "-12%", 
      color: "#FF5733", 
      icon: Flame, 
      story: "Unused SharePoint sites and orphaned meeting recordings identified for archival across M365 and Box.", 
      calculation: "Inactive_Tier1_GB * 0.15 - Cold_Tier_Offset",
      category: 'waste' as const 
    },
    { 
      id: 'ghost', 
      label: "Ghost Containers", 
      value: "312", 
      trend: "+4", 
      color: "#F59E0B", 
      icon: Clock, 
      story: "Collaborative nodes with zero activity in the last 180 days, primarily legacy Slack channels.", 
      calculation: "count(*) WHERE idle > 180 AND score < 5",
      category: 'ghost' as const 
    },
    { 
      id: 'shadow', 
      label: "Shadow Leaks", 
      value: "28", 
      trend: "-2", 
      color: "#00F0FF", 
      icon: ShieldAlert, 
      story: "Files shared outside core anchors identified in Box and Google Workspace. High-risk permissions.", 
      calculation: "access = 'External' AND pii > 0.8",
      category: 'exposure' as const 
    },
  ];

  return (
    <div className="absolute inset-0 bg-white dark:bg-[#0B0F19] flex flex-col lg:flex-row animate-in fade-in duration-1000 overflow-hidden">
      {/* Sidebar / Left Panel */}
      <Motion.div 
        animate={{ 
          width: layoutMode === 'cartography' ? '0%' : layoutMode === 'hybrid' ? '40%' : '100%',
          opacity: layoutMode === 'cartography' ? 0 : 1,
          pointerEvents: layoutMode === 'cartography' ? 'none' : 'auto'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full flex flex-col border-r border-slate-100 dark:border-white/5 z-20 relative bg-white dark:bg-[#0B0F19] shadow-2xl overflow-hidden shrink-0"
      >
        {/* Top Spacing */}
        <div className="h-24 lg:h-28 shrink-0" />

        {/* View Selection */}
        <div className="px-10 lg:px-14 flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#00F0FF] rounded-full" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Diagnostic Synthesis</h2>
          </div>
          
          <div className="flex items-center p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
            {[
              { id: 'synthesis', label: 'Synthesis', icon: Activity },
              { id: 'hybrid', label: 'Hybrid', icon: Layout },
              { id: 'cartography', label: 'Map', icon: Telescope },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setLayoutMode(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${layoutMode === tab.id ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 lg:px-14 pb-24">
          <div className="space-y-12 max-w-4xl">
            {/* The Hook */}
            <div className="space-y-6">
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-tight text-slate-900 dark:text-white">
                $14,280 <span className="text-indigo-600 dark:text-[#00F0FF]">Reclaimable</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                 Aethos suggests immediate archival to restore operational clarity across orphaned clusters.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => setIsSimulating(true)}
                  className="px-5 py-3 rounded-xl bg-[#FF5733] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <TrendingDown className="w-3.5 h-3.5" /> Initialize Remediation
                </button>
                <button 
                  onClick={() => handleOpenLab({ type: 'universal', label: 'Forensic Synthesis' })}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-400 flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5" /> Lab
                </button>
              </div>
            </div>

            {/* Simulation Sandbox */}
            <AnimatePresence>
              {isSimulating && (
                <Motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 rounded-3xl bg-slate-900 border border-white/10 text-white space-y-4 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5733]">Simulation Mode</h3>
                     <button onClick={() => setIsSimulating(false)} className="text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest underline">Cancel</button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Projected Savings</span>
                      <span className="text-xl font-black text-[#00F0FF]">$1,190/mo</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <Motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-[#FF5733]" />
                    </div>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            {/* Diagnostic Metrics */}
            <div className={`grid gap-4 ${layoutMode === 'synthesis' ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
              {primaryMetrics.map((stat, i) => (
                <DiagnosticMetricCard key={i} stat={stat} handleOpenLab={handleOpenLab} />
              ))}
            </div>

            {/* Action Section */}
            <section className="bg-indigo-600 dark:bg-[#00F0FF] p-8 rounded-[32px] text-white dark:text-black relative overflow-hidden group/cta mt-8">
              <Sparkles className="w-6 h-6 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter leading-tight mb-2">Clarity Protocol</h3>
              <p className="text-[11px] font-medium opacity-80 leading-relaxed mb-6">
                Execute "Clarity Blasts" to automate soft-gate remediation.
              </p>
              <button 
                onClick={() => handleOpenLab({ type: 'universal', label: 'Clarity Audit' })}
                className="w-full py-4 rounded-xl bg-white dark:bg-black text-black dark:text-white text-[9px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2"
              >
                Start Blast
              </button>
            </section>
          </div>
        </div>
      </Motion.div>

      {/* Cartography Panel (The Map) */}
      <Motion.div 
        animate={{ 
          width: layoutMode === 'synthesis' ? '0%' : layoutMode === 'hybrid' ? '60%' : '100%',
          opacity: layoutMode === 'synthesis' ? 0 : 1,
          filter: layoutMode === 'synthesis' ? 'blur(20px)' : 'blur(0px)' 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-slate-100 dark:bg-black/40 transition-all overflow-hidden h-full flex-1 z-30"
      >
        {/* Map Header / Hybrid Controls */}
        <div className="absolute top-8 right-10 flex items-center gap-4 z-50 pointer-events-auto">
          {layoutMode === 'cartography' && (
            <button 
              onClick={() => setLayoutMode('hybrid')}
              className="px-5 py-3 rounded-xl bg-white/90 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Synthesis</span>
            </button>
          )}
          <div className="px-5 py-3 rounded-xl bg-white/90 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
             Cartography: <span className="text-[#00F0FF]">{layoutMode === 'hybrid' ? 'Contextual' : 'Immersive'}</span>
          </div>
        </div>

        <div className="w-full h-full">
          <StarMap 
            active={layoutMode !== 'synthesis'} 
            onNodeClick={(name) => handleOpenLab({ type: 'node', label: name })} 
          />
        </div>
      </Motion.div>

      <WorkspaceWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
};
