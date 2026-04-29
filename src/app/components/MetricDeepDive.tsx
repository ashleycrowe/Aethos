import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Target, 
  Calculator, 
  Zap, 
  DollarSign, 
  Ghost, 
  Activity,
  History,
  ChevronRight,
  Globe,
  BarChart3,
  RefreshCw,
  CircleCheck,
  Search,
  Slack,
  Box as BoxIcon,
  HardDrive,
  Share2,
  ExternalLink,
  Info,
  Cpu,
  BookOpen,
  EyeOff,
  Users
} from 'lucide-react';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ProviderType } from '../types/aethos.types';
import { GlassCard } from './GlassCard';
import { useIsMobile } from './ui/use-mobile';

export type MetricType = 'waste' | 'ghost-towns' | 'exposure' | 'redundancy' | 'starlight' | 'orphaned' | 'velocity';

interface MetricDeepDiveProps {
  isOpen: boolean;
  onClose: () => void;
  type: MetricType;
  onRemediate?: (id: string, type: 'archive' | 'delete', provider: ProviderType, name: string) => void;
}

const mockChartData = {
  waste: {
    all: [
      { name: 'Jan', value: 4200 }, { name: 'Feb', value: 3800 }, { name: 'Mar', value: 5100 }, { name: 'Apr', value: 4600 }, { name: 'May', value: 5900 }, { name: 'Jun', value: 14204 },
    ]
  },
  'ghost-towns': {
    all: [{ name: 'M365', value: 12 }, { name: 'G-Drive', value: 8 }, { name: 'Slack', value: 15 }, { name: 'Box', value: 4 }]
  },
  redundancy: {
    all: [{ name: 'M365', value: 45 }, { name: 'G-Drive', value: 30 }, { name: 'Box', value: 20 }]
  },
  starlight: {
    all: [{ name: 'W1', value: 82 }, { name: 'W2', value: 85 }, { name: 'W3', value: 88 }, { name: 'W4', value: 92 }]
  },
  exposure: {
    all: [{ name: 'M365', value: 240 }, { name: 'G-Drive', value: 180 }, { name: 'Box', value: 120 }]
  },
  orphaned: {
    all: [{ name: 'M365', value: 5 }, { name: 'G-Drive', value: 3 }, { name: 'Box', value: 2 }]
  },
  velocity: {
    all: [{ name: 'T1', value: 85 }, { name: 'T2', value: 88 }, { name: 'T3', value: 92 }]
  }
};

export const MetricDeepDive: React.FC<MetricDeepDiveProps> = ({ isOpen, onClose, type }) => {
  const { isDaylight, brand } = useTheme();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [showLogic, setShowLogic] = useState(false);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metricConfig: Record<MetricType, any> = {
    waste: { title: "Universal Waste", icon: DollarSign, color: "#FF5733" },
    'ghost-towns': { title: "Ghost Towns", icon: Ghost, color: "#FF5733" },
    redundancy: { title: "Version Bloat", icon: History, color: brand.color },
    starlight: { title: "Starlight Score", icon: Activity, color: brand.color },
    exposure: { title: "External Exposure", icon: Globe, color: "#FF5733" },
    orphaned: { title: "Orphaned Accounts", icon: Users, color: "#FF5733" },
    velocity: { title: "Identity Velocity", icon: Target, color: brand.color }
  };

  const content = metricConfig[type] || { title: "Operational Metric", icon: BarChart3, color: brand.color };

  const handleRunAction = () => {
    setScanState('scanning');
    setScanProgress(0);
  };

  useEffect(() => {
    if (scanState === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('success');
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [scanState]);

  const activeChartData = (mockChartData[type] as any)?.all || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-end p-0 md:p-6 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={isMobile ? { y: '100%' } : { x: '100%', opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={isMobile ? { y: '100%' } : { x: '100%', opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className={`relative w-full max-w-2xl h-full md:h-[calc(100vh-48px)] border-l md:border md:rounded-[32px] shadow-2xl p-6 md:p-10 flex flex-col pointer-events-auto overflow-y-auto custom-scrollbar ${
            isDaylight ? 'bg-white border-slate-200' : 'bg-[#0B0F19] border-white/10'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-2.5 md:p-3 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                <content.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: content.color }} />
              </div>
              <div>
                <h2 className={`text-xl md:text-3xl font-bold font-['Space_Grotesk'] uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{content.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Operational Intelligence Layer</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-2.5 md:p-3 rounded-full transition-colors ${isDaylight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-slate-500 hover:text-white'}`}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Metrics Body */}
          <div className="space-y-6 md:space-y-8 flex-grow">
            <div className={`relative p-5 md:p-6 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.03] border-white/5'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 md:space-y-4 flex-grow">
                  <div className="flex items-center gap-2" style={{ color: content.color }}>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Architectural Narrative</span>
                  </div>
                  <p className={`text-xs md:text-sm leading-relaxed font-medium ${isDaylight ? 'text-slate-700' : 'text-white'}`}>
                    Operational efficiency metric derived from cross-tenant metadata analysis of your {type} landscape.
                  </p>
                </div>
                <button 
                  onMouseEnter={() => setShowLogic(true)}
                  onMouseLeave={() => setShowLogic(false)}
                  onClick={() => setShowLogic(!showLogic)}
                  className={`p-2.5 md:p-3 rounded-xl border transition-all shrink-0 ${
                    isDaylight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <AnimatePresence>
                {showLogic && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-20 right-6 w-72 md:w-80 z-20 border rounded-2xl shadow-2xl p-5 md:p-6 space-y-4 ${
                      isDaylight ? 'bg-white border-slate-200' : 'bg-[#0B0F19] border-white/10'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calculator className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">Technical Calculation</span>
                      </div>
                      <div className={`p-3 rounded-lg font-['JetBrains_Mono'] text-[7px] md:text-[8px] break-all ${isDaylight ? 'bg-slate-50 text-slate-900' : 'bg-black/60 text-[#00F0FF]'}`}>
                        UNIFIED_METADATA_ENGINE.query("{type}").aggregate(SUM).normalize()
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chart */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Snapshot Analytics</span>
                </div>
              </div>
              <div className={`w-full rounded-2xl p-4 md:p-6 border relative min-h-[250px] md:min-h-[300px] ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                {mounted && (
                  <div className="absolute inset-0 p-4 md:p-6">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={activeChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDaylight ? "#E2E8F0" : "#1E293B"} vertical={false} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDaylight ? '#fff' : '#0B0F19', 
                            borderColor: isDaylight ? '#E2E8F0' : '#1E293B',
                            borderRadius: '12px',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {activeChartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${type}-${index}`} fill={content.color} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </section>

            {/* Actions */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: content.color }} />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Remediation Protocols</span>
              </div>
              <div className="space-y-2 md:space-y-3">
                {[
                  { label: "Initiate Global Audit", desc: "Scan all adapters for policy drift." },
                  { label: "Commit Remediation", desc: "Execute standardized cleanup protocols." }
                ].map((action, i) => (
                  <div 
                    key={i}
                    onClick={handleRunAction}
                    className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isDaylight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className={`font-bold text-[11px] md:text-sm uppercase tracking-wide ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{action.label}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 md:mt-1">{action.desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className={`mt-8 md:mt-10 pt-6 border-t ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
             <button 
              onClick={onClose}
              className={`w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${
                isDaylight ? 'bg-slate-900 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Close Operational View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
