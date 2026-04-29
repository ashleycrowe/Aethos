import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, RefreshCw, Palette, ShieldAlert, X, Zap, ChevronRight, Layout } from 'lucide-react';
import { DesignSystemExplorer } from './DesignSystemExplorer';

interface DemoLabProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const DemoLab: React.FC<DemoLabProps> = ({ isOpen, onClose, onReset }) => {
  const [activeMode, setActiveMode] = useState<'controls' | 'design'>('controls');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl h-full max-h-[85vh] overflow-hidden"
      >
        <GlassCard className="h-full flex flex-col border-[#FF5733]/30 shadow-[0_0_50px_rgba(255,87,51,0.1)]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#FF5733]/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#FF5733] text-black shadow-[0_0_20px_#FF5733]">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white uppercase tracking-tighter">Aethos Demo Lab</h2>
                <p className="text-[#FF5733] text-[10px] font-bold uppercase tracking-widest font-mono">Prototype Control Center • Internal Use Only</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-white/5 px-6">
            <button 
              onClick={() => setActiveMode('controls')}
              className={`px-6 py-4 font-['Space_Grotesk'] uppercase text-xs tracking-widest font-bold transition-all relative ${
                activeMode === 'controls' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              System Controls
              {activeMode === 'controls' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5733]" />}
            </button>
            <button 
              onClick={() => setActiveMode('design')}
              className={`px-6 py-4 font-['Space_Grotesk'] uppercase text-xs tracking-widest font-bold transition-all relative ${
                activeMode === 'design' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Design System Explorer
              {activeMode === 'design' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5733]" />}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeMode === 'controls' ? (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="space-y-4">
                      <h3 className="text-white font-bold font-['Space_Grotesk'] uppercase tracking-widest text-sm mb-4">Lifecycle Management</h3>
                      <GlassCard className="p-6 bg-white/5 border-white/10 hover:border-[#FF5733]/50 transition-colors cursor-pointer group" onClick={onReset}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-[#FF5733]/10 text-[#FF5733]">
                              <RefreshCw className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">Hard Reset Onboarding</p>
                              <p className="text-slate-500 text-xs">Clears localStorage and returns to setup.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-[#FF5733]" />
                        </div>
                      </GlassCard>

                      <GlassCard className="p-6 bg-white/5 border-white/10 opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-white/5 text-slate-500">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-slate-400 font-bold text-sm">Toggle Enterprise State</p>
                            <p className="text-slate-600 text-xs italic">Coming soon</p>
                          </div>
                        </div>
                      </GlassCard>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-white font-bold font-['Space_Grotesk'] uppercase tracking-widest text-sm mb-4">Scenario Testing</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
                          <span className="text-slate-400 group-hover:text-white transition-colors">Simulate Scan Errors</span>
                          <div className="w-10 h-5 bg-white/5 rounded-full" />
                        </button>
                        <button className="w-full text-left p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
                          <span className="text-slate-400 group-hover:text-white transition-colors">Infinite Data Loading</span>
                          <div className="w-10 h-5 bg-white/5 rounded-full" />
                        </button>
                      </div>
                    </section>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#FF5733]/5 border border-[#FF5733]/20">
                    <div className="flex gap-4">
                      <ShieldAlert className="w-5 h-5 text-[#FF5733] flex-shrink-0" />
                      <div>
                        <p className="text-[#FF5733] text-sm font-bold uppercase mb-1">Developer Notice</p>
                        <p className="text-[#FF5733]/70 text-xs leading-relaxed">
                          This entire "Demo Lab" component and its entry point in the Sidebar/Header must be removed for the production build. It is strictly for internal testing and client walkthroughs.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <DesignSystemExplorer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
