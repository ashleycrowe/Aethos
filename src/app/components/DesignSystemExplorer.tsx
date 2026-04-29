import React from 'react';
import { GlassCard } from './GlassCard';
import { motion } from 'motion/react';
import { Layout, Palette, Type, Box, Layers, MousePointer2 } from 'lucide-react';

export const DesignSystemExplorer: React.FC = () => {
  const colors = [
    { name: 'Deep Space', hex: '#0B0F19', class: 'bg-[#0B0F19]' },
    { name: 'Starlight Cyan', hex: '#00F0FF', class: 'bg-[#00F0FF]' },
    { name: 'Supernova Orange', hex: '#FF5733', class: 'bg-[#FF5733]' },
    { name: 'Nebula Slate', hex: '#94A3B8', class: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <section>
        <h3 className="text-[#00F0FF] font-['Space_Grotesk'] uppercase text-xs tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Core Palette
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="space-y-2">
              <div className={`h-24 rounded-2xl border border-white/10 ${color.class} shadow-lg`} />
              <div>
                <p className="text-white text-sm font-bold">{color.name}</p>
                <p className="text-slate-500 text-[10px] font-mono">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[#00F0FF] font-['Space_Grotesk'] uppercase text-xs tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
          <Type className="w-4 h-4" /> Typography
        </h3>
        <GlassCard className="p-8 space-y-6">
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 font-mono">Display / Space Grotesk</p>
            <h1 className="text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-tight text-white leading-none">OPERATIONAL CLARITY</h1>
          </div>
          <div className="pt-6 border-t border-white/5">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 font-mono">Body / Inter</p>
            <p className="text-slate-300 text-lg font-['Inter'] leading-relaxed">
              Aethos is an intelligence layer on top of Microsoft 365 tenants. We map digital sprawl without data migration.
            </p>
          </div>
        </GlassCard>
      </section>

      <section>
        <h3 className="text-[#00F0FF] font-['Space_Grotesk'] uppercase text-xs tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Materiality: Aethos Glass
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 h-40 flex items-center justify-center">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">Standard Card</span>
          </GlassCard>
          <GlassCard className="p-6 h-40 flex items-center justify-center border-t-2 border-t-[#00F0FF]">
            <span className="text-[#00F0FF] text-xs uppercase font-bold tracking-widest">Primary Accent</span>
          </GlassCard>
          <GlassCard className="p-6 h-40 flex items-center justify-center bg-[#00F0FF]/5">
            <span className="text-white text-xs uppercase font-bold tracking-widest">Active Glow</span>
          </GlassCard>
        </div>
      </section>

      <section>
        <h3 className="text-[#00F0FF] font-['Space_Grotesk'] uppercase text-xs tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
          <MousePointer2 className="w-4 h-4" /> Interaction
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-[#00F0FF] text-black font-bold font-['Space_Grotesk'] uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all">
            Primary Button
          </button>
          <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-['Space_Grotesk'] font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all">
            Secondary Button
          </button>
          <button className="px-6 py-3 border border-[#FF5733] text-[#FF5733] font-bold font-['Space_Grotesk'] uppercase tracking-wider rounded-xl hover:bg-[#FF5733]/10 transition-all">
            Risk Indicator
          </button>
        </div>
      </section>
    </div>
  );
};
