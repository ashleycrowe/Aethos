import React from 'react';
import { GlassCard } from './GlassCard';
import { motion as Motion } from 'motion/react';
import { TrendingUp, AlertCircle, Cloud } from 'lucide-react';

interface WasteMeterProps {
  amount: number;
  label: string;
}

export const WasteMeter: React.FC<WasteMeterProps> = ({ amount, label }) => {
  return (
    <GlassCard className="p-10 flex flex-col items-center justify-center relative overflow-hidden h-full">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,87,51,0.08),transparent_70%)] pointer-events-none" />
      
      {/* Hero Visualization: The "Lazy Tax" Ticker */}
      <Motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center relative z-10 w-full"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#FF5733]/10 border border-[#FF5733]/20">
            <AlertCircle className="w-5 h-5 text-[#FF5733]" />
          </div>
          <div className="text-left">
            <span className="text-slate-400 font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] font-black block">
              The Universal Waste Metric
            </span>
            <span className="text-slate-500 font-['Inter'] text-[8px] uppercase tracking-[0.1em]">Cross-Cloud Savings Index</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <Motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-6 -right-16 bg-[#FF5733] text-black text-[9px] font-black px-3 py-1 rounded uppercase tracking-[0.1em] shadow-[0_0_20px_rgba(255,87,51,0.4)]"
            >
              Identified Waste
            </Motion.div>
            <div className="text-8xl md:text-9xl font-['JetBrains_Mono'] font-bold text-white leading-none tracking-tighter mb-4 selection:bg-[#FF5733]/40">
              <span className="text-[#FF5733]">$</span>
              {amount.toLocaleString()}
            </div>
          </div>
          <div className="text-[#FF5733] font-['Space_Grotesk'] text-sm uppercase tracking-[0.4em] font-black mb-10 flex items-center gap-2">
            Potential Multi-Cloud Savings
            <div className="w-2 h-2 rounded-full bg-[#FF5733] animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-sm mx-auto">
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col items-start group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Ghost Towns</span>
            </div>
            <span className="text-white font-black text-2xl font-['Space_Grotesk'] tracking-tight">142</span>
          </div>
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col items-start group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF5733]" />
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Bloat Ratio</span>
            </div>
            <span className="text-white font-black text-2xl font-['Space_Grotesk'] tracking-tight">42.8<span className="text-sm font-normal text-slate-500">%</span></span>
          </div>
        </div>
      </Motion.div>

      {/* Ticker Animation Background */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF5733]/10 overflow-hidden">
        <Motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-1/4 h-full bg-[#FF5733] shadow-[0_0_15px_#FF5733]"
        />
      </div>

      {/* Decorative pulse ring */}
      <Motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[500px] h-[500px] border border-[#FF5733]/30 rounded-full pointer-events-none"
      />
    </GlassCard>
  );
};
