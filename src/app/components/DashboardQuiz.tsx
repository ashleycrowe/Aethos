import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  CircleCheck, 
  Target, 
  ShieldAlert, 
  Ghost, 
  History, 
  Globe, 
  DollarSign,
  Fingerprint,
  Users,
  X
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from './ui/use-mobile';

interface DashboardQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const METRIC_OPTIONS = [
  { id: 'waste', label: 'Universal Waste', icon: DollarSign, color: '#FF5733', description: 'Financial recapture from storage waste.' },
  { id: 'ghost-towns', label: 'Ghost Towns', icon: Ghost, color: '#FF5733', description: 'Containers with no activity for 180+ days.' },
  { id: 'exposure', label: 'External Exposure', icon: Globe, color: '#FF5733', description: 'Public sharing vectors and guests.' },
  { id: 'redundancy', label: 'Redundant Bloat', icon: History, color: '#00F0FF', description: 'Savings from version history and duplicates.' },
  { id: 'orphaned', label: 'Orphaned Accounts', icon: Users, color: '#FF5733', description: 'Identities with no matching records.' },
  { id: 'velocity', label: 'Identity Velocity', icon: Target, color: '#00F0FF', description: 'Speed of identity transitions and syncs.' },
  { id: 'health', label: 'System Health', icon: Sparkles, color: '#00F0FF', description: 'Aggregate operational health metric.' }
];

export const DashboardQuiz: React.FC<DashboardQuizProps> = ({ isOpen, onClose }) => {
  const { state, updateDashboardConfig } = useAethos();
  const { isDaylight } = useTheme();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<string[]>(state.dashboardConfig.pinnedMetrics);

  if (!isOpen) return null;

  const toggleMetric = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(m => m !== id));
    } else if (selected.length < 5) {
      setSelected([...selected, id]);
    }
  };

  const handleFinish = () => {
    updateDashboardConfig({ pinnedMetrics: selected });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 bg-[#0B0F19]/80 backdrop-blur-2xl overflow-hidden">
        <Motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="max-w-4xl w-full h-full md:h-auto overflow-hidden flex items-center justify-center px-4"
        >
          <GlassCard className={`p-6 md:p-12 relative overflow-y-auto max-h-full md:max-h-[90vh] custom-scrollbar ${isDaylight ? 'bg-white border-slate-200 shadow-2xl' : 'border border-[#00F0FF]/20'}`}>
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden md:block">
              <Target className={`w-48 md:w-64 h-48 md:h-64 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
            </div>

            <button 
              onClick={onClose}
              className={`absolute top-4 md:top-8 right-4 md:right-8 p-2 rounded-full transition-colors z-20 ${
                isDaylight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-slate-500'
              }`}
            >
              <X className="w-5 md:w-6 h-5 md:h-6" />
            </button>

            <div className="relative z-10">
              <div className="mb-8 md:mb-12">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className={`p-2.5 md:p-3 rounded-2xl border ${
                    isDaylight ? 'bg-blue-50 border-blue-100' : 'bg-[#00F0FF]/10 border-[#00F0FF]/20'
                  }`}>
                    <Sparkles className={`w-5 h-5 md:w-6 md:h-6 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl md:text-3xl font-black font-['Space_Grotesk'] tracking-tight uppercase ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      Operational Calibration
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-1">Select 4-5 core metrics to anchor your Architect Center</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
                {METRIC_OPTIONS.map((metric) => {
                  const isSelected = selected.includes(metric.id);
                  const Icon = metric.icon;
                  
                  return (
                    <button
                      key={metric.id}
                      onClick={() => toggleMetric(metric.id)}
                      className={`p-4 md:p-6 rounded-[20px] md:rounded-[24px] border transition-all text-left relative group ${
                        isSelected 
                          ? (isDaylight ? 'bg-blue-600 border-blue-600 shadow-xl' : 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.1)]')
                          : (isDaylight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/10 hover:border-white/20')
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className={`p-2 rounded-xl transition-colors ${
                          isSelected 
                            ? (isDaylight ? 'bg-white/20 text-white' : 'text-[#00F0FF]') 
                            : 'bg-white/5 text-slate-500 group-hover:text-slate-900'
                        }`}>
                          <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        {isSelected && (
                          <CircleCheck className={`w-3.5 md:w-4 h-3.5 md:h-4 ${isDaylight ? 'text-white' : 'text-[#00F0FF]'}`} />
                        )}
                      </div>
                      <h4 className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest mb-1.5 md:mb-2 ${
                        isSelected ? 'text-white' : (isDaylight ? 'text-slate-900' : 'text-white')
                      }`}>
                        {metric.label}
                      </h4>
                      <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-tighter leading-relaxed ${
                        isSelected ? 'text-white/70' : 'text-slate-500'
                      }`}>
                        {metric.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 border-t pt-8 ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 order-2 sm:order-1">
                  {selected.length} / 5 Metrics Selected
                </div>
                <button
                  disabled={selected.length < 4}
                  onClick={handleFinish}
                  className={`w-full sm:w-auto flex items-center justify-center gap-4 px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] transition-all order-1 sm:order-2 ${
                    selected.length >= 4 
                      ? (isDaylight ? 'bg-blue-600 text-white shadow-xl hover:scale-105' : 'bg-[#00F0FF] text-black shadow-[0_0_40px_rgba(0,240,255,0.3)] hover:scale-105')
                      : 'bg-white/5 text-slate-400 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Calibrate Dashboard
                  <ChevronRight className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};
