import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  Zap, 
  X, 
  Target, 
  Globe, 
  Cpu, 
  MessageSquare, 
  CheckCircle2, 
  Flame,
  Palette,
  ShieldCheck,
  TrendingUp,
  Fingerprint
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useOperationalMerit, BadgeDefinition } from '../context/OperationalMeritContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

const ICON_MAP: Record<string, any> = {
  Award, Sparkles, Zap, Target, Globe, Cpu, MessageSquare, Flame, Palette, ShieldCheck, TrendingUp, Fingerprint
};

export const BadgeForge: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isDaylight } = useTheme();
  const { addCustomBadge } = useOperationalMerit();
  const [step, setScanStep] = useState<'naming' | 'visual' | 'logic' | 'forging'>('naming');
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    icon: 'Award',
    category: 'custom' as const,
    triggerCriteria: 'manual'
  });

  const handleForge = async () => {
    setScanStep('forging');
    // Simulate high-fidelity "forging" process
    await new Promise(r => setTimeout(r, 2500));
    
    addCustomBadge({
      ...newBadge,
      enabled: true,
      isCustom: true
    });
    
    toast.success('Artifact Materialized', {
      description: `The "${newBadge.name}" merit badge is now active in the universal registry.`
    });
    onClose();
    // Reset
    setScanStep('naming');
    setNewBadge({ name: '', description: '', icon: 'Award', category: 'custom', triggerCriteria: 'manual' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-3xl"
          />
          
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: 20 }}
            className="relative w-full max-w-4xl bg-black/40 border border-[#00F0FF]/20 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,240,255,0.1)] flex flex-col h-[700px]"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00F0FF]/10 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Header */}
            <div className="p-12 border-b border-white/5 flex items-center justify-between shrink-0 relative z-10">
               <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] animate-pulse">
                    <Flame className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">
                      The <span className="text-[#00F0FF]">Badge Forge</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">
                       Materializing Operational Merit & Cultural Anchors
                    </p>
                  </div>
               </div>
               <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                  <X className="w-8 h-8" />
               </button>
            </div>

            <div className="flex-1 flex flex-col p-12 overflow-hidden relative z-10">
               {step === 'forging' ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
                    <div className="relative">
                       <Motion.div 
                         animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                         className="w-48 h-48 rounded-full border-4 border-[#00F0FF]/20 border-t-[#00F0FF] flex items-center justify-center"
                       >
                          {React.createElement(ICON_MAP[newBadge.icon], { size: 64, className: "text-[#00F0FF]" })}
                       </Motion.div>
                       <div className="absolute inset-0 bg-[#00F0FF]/20 blur-[80px] rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse">Synthesizing Merit Pattern...</h3>
                       <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                         Encoding logic: {newBadge.triggerCriteria} • Identity: {newBadge.name}
                       </p>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col">
                    <div className="flex-1 grid grid-cols-12 gap-12 min-h-0">
                       {/* Input Side */}
                       <div className="col-span-7 space-y-8 overflow-y-auto pr-6 custom-scrollbar">
                          {step === 'naming' && (
                            <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Artifact Designation</label>
                                  <input 
                                    autoFocus
                                    type="text" 
                                    value={newBadge.name}
                                    onChange={(e) => setNewBadge({...newBadge, name: e.target.value})}
                                    placeholder="e.g. LATTICE ARCHITECT"
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-xl font-black text-white focus:outline-none focus:border-[#00F0FF]/50 transition-all uppercase placeholder:opacity-20"
                                  />
                               </div>
                               <div className="space-y-4">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Operational Narrative</label>
                                  <textarea 
                                    value={newBadge.description}
                                    onChange={(e) => setNewBadge({...newBadge, description: e.target.value})}
                                    placeholder="What behavioral transformation does this artifact celebrate?"
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-slate-300 focus:outline-none focus:border-[#00F0FF]/50 transition-all h-40 resize-none leading-relaxed italic"
                                  />
                               </div>
                            </Motion.div>
                          )}

                          {step === 'visual' && (
                            <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                               <div className="space-y-6">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Visual Essence</label>
                                  <div className="grid grid-cols-4 gap-4">
                                     {Object.entries(ICON_MAP).map(([key, Icon]) => (
                                       <button 
                                         key={key}
                                         onClick={() => setNewBadge({...newBadge, icon: key})}
                                         className={`p-6 rounded-3xl border transition-all flex items-center justify-center group ${newBadge.icon === key ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-lg shadow-[#00F0FF]/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                                       >
                                          <Icon size={32} className="group-hover:scale-110 transition-transform" />
                                       </button>
                                     ))}
                                  </div>
                               </div>
                            </Motion.div>
                          )}

                          {step === 'logic' && (
                            <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                               <div className="space-y-6">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Trigger Heuristics</label>
                                  <div className="space-y-3">
                                     {[
                                       { id: 'manual', label: 'Manual Distribution', desc: 'Architect must personally anchor this merit to an identity.' },
                                       { id: 'pulse_engagements >= 50', label: 'Cultural Catalyst', desc: 'Auto-awards after 50 unique engagements on a single Pulse post.' },
                                       { id: 'storage_saved >= 1000', label: 'Waste Titan', desc: 'Auto-awards after recovering 1TB+ of dead capital.' },
                                       { id: 'workspace_count >= 10', label: 'Synthesis Lead', desc: 'Auto-awards after initializing 10+ virtual workspaces.' },
                                     ].map((opt) => (
                                       <button 
                                         key={opt.id}
                                         onClick={() => setNewBadge({...newBadge, triggerCriteria: opt.id})}
                                         className={`w-full p-6 rounded-3xl border text-left transition-all ${newBadge.triggerCriteria === opt.id ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                                       >
                                          <div className="flex justify-between items-center mb-1">
                                             <span className={`text-sm font-black uppercase tracking-tight ${newBadge.triggerCriteria === opt.id ? 'text-white' : 'text-slate-400'}`}>{opt.label}</span>
                                             {newBadge.triggerCriteria === opt.id && <Zap size={14} className="text-[#00F0FF]" />}
                                          </div>
                                          <p className="text-[10px] text-slate-500 italic">{opt.desc}</p>
                                       </button>
                                     ))}
                                  </div>
                               </div>
                            </Motion.div>
                          )}
                       </div>

                       {/* Preview Side */}
                       <div className="col-span-5 flex flex-col items-center justify-center">
                          <div className="w-full space-y-8">
                             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-center">Live Materialization</h3>
                             <div className="flex justify-center">
                                <div className="relative group">
                                   <div className="absolute inset-0 bg-[#00F0FF]/20 blur-[60px] rounded-full group-hover:bg-[#00F0FF]/30 transition-all duration-700" />
                                   <div className="w-64 h-64 rounded-[64px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center relative z-10 shadow-2xl">
                                      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 text-[#00F0FF] mb-6">
                                         {React.createElement(ICON_MAP[newBadge.icon] || Award, { size: 48 })}
                                      </div>
                                      <h4 className="text-lg font-black text-white uppercase tracking-tighter truncate w-full">{newBadge.name || 'UNNAMED MERIT'}</h4>
                                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Level 1 Artifact</p>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                   <Cpu size={14} className="text-[#00F0FF]" />
                                   <span className="text-[10px] font-black text-white uppercase tracking-widest">System Integration</span>
                                </div>
                                <div className="space-y-2">
                                   <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                                      <span>Logic Fidelity</span>
                                      <span className="text-[#00F0FF]">Optimal</span>
                                   </div>
                                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#00F0FF] w-[85%]" />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-auto pt-12 border-t border-white/5 flex justify-between items-center">
                       <div className="flex gap-3">
                          {['naming', 'visual', 'logic'].map((s, i) => (
                            <div key={s} className={`w-3 h-3 rounded-full transition-all ${step === s ? 'bg-[#00F0FF] scale-125' : 'bg-white/10'}`} />
                          ))}
                       </div>
                       <div className="flex gap-4">
                          {step !== 'naming' && (
                            <button 
                              onClick={() => setScanStep(step === 'logic' ? 'visual' : 'naming')}
                              className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                              Previous Phase
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if (step === 'naming') setScanStep('visual');
                              else if (step === 'visual') setScanStep('logic');
                              else handleForge();
                            }}
                            disabled={step === 'naming' && !newBadge.name}
                            className="px-12 py-4 rounded-2xl bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,240,255,0.2)] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                          >
                            {step === 'logic' ? 'Materialize Artifact' : 'Next Phase'} 
                            {step === 'logic' ? <Flame size={14} /> : <Zap size={14} />}
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
