import React, { useState } from 'react';
import { motion as Motion } from 'motion/react';
import { 
  GitMerge, 
  ShieldCheck, 
  Database, 
  Settings, 
  ArrowRight,
  ChevronRight,
  Info,
  Zap,
  Check,
  Globe,
  Slack,
  Box as BoxIcon,
  Share2,
  AlertTriangle,
  MoveVertical
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ProviderType } from '../types/aethos.types';
import { useTheme } from '../context/ThemeContext';

// Import New UI Components
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { Select } from './ui/Select';

export const ReconciliationSettings = () => {
  const { isDaylight } = useTheme();
  const [activeStrategy, setActiveStrategy] = useState<'smtp' | 'fuzzy' | 'alias'>('smtp');

  const sources = [
    { id: 'microsoft', name: 'Microsoft 365', icon: Share2, priority: 1, type: 'System of Record' },
    { id: 'google', name: 'Google Workspace', icon: Globe, priority: 2, type: 'Secondary Identity' },
    { id: 'slack', name: 'Slack Grid', icon: Slack, priority: 3, type: 'Engagement Data' },
    { id: 'box', name: 'Box Enterprise', icon: BoxIcon, priority: 4, type: 'Artifact Mapping' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard className="p-10 border-white/5 space-y-8 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/5 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className={`text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight flex items-center gap-4 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              <ShieldCheck className="w-6 h-6 text-[#00F0FF]" />
              Source Hierarchy
            </h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 leading-relaxed italic">
              "Determine which cloud provider wins during attribute collision."
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            {sources.map((source, i) => (
              <div key={source.id} className={`flex items-center gap-5 p-5 rounded-3xl border transition-all cursor-move group ${
                isDaylight ? 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-lg' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/20 shadow-2xl shadow-black/20'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 transition-colors ${isDaylight ? 'bg-white shadow-inner' : 'bg-black/40'}`}>
                  <span className="text-[11px] font-black">{source.priority}</span>
                </div>
                <div className={`p-3 rounded-xl ${isDaylight ? 'bg-white border border-slate-100' : 'bg-white/5 text-slate-400 group-hover:text-[#00F0FF]'}`}>
                  <source.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className={`text-[13px] font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{source.name}</div>
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-70">{source.type}</div>
                </div>
                <div className="flex items-center gap-4">
                  <IconButton icon={Settings} size="sm" variant="ghost" />
                  <IconButton icon={MoveVertical} size="sm" variant="ghost" className="cursor-grab active:cursor-grabbing" />
                </div>
              </div>
            ))}
          </div>

          <div className={`p-6 rounded-[32px] border flex items-start gap-5 relative z-10 ${isDaylight ? 'bg-blue-50 border-blue-100' : 'bg-[#00F0FF]/5 border-[#00F0FF]/10'}`}>
            <div className="p-2 rounded-xl bg-[#00F0FF]/10">
              <Info className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-black uppercase tracking-widest italic opacity-80">
              Aethos will default to **Microsoft 365** for User Profiles. If a user exists in Slack but not M365, they will be flagged as an **Unreconciled Guest**.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-10 border-white/5 space-y-10 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF5733]/5 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className={`text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight flex items-center gap-4 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              <GitMerge className="w-6 h-6 text-[#00F0FF]" />
              Matching Rules
            </h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 leading-relaxed italic">
              "Define the bridge logic for universal identity mapping."
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { 
                id: 'smtp', 
                title: 'Primary SMTP Match', 
                desc: '1:1 match on primary email address across all providers.', 
                impact: 'High Accuracy', 
                active: activeStrategy === 'smtp' 
              },
              { 
                id: 'fuzzy', 
                title: 'Fuzzy Identity Logic', 
                desc: 'Matches based on name similarity and secondary aliases (85%+ confidence).', 
                impact: 'Discovery Focused', 
                active: activeStrategy === 'fuzzy' 
              },
              { 
                id: 'alias', 
                title: 'Alias Chain Mapping', 
                desc: 'Uses HRIS data to chain multiple legacy emails to a single identity.', 
                impact: 'Enterprise Scale', 
                active: activeStrategy === 'alias' 
              },
            ].map((strategy) => (
              <button 
                key={strategy.id}
                onClick={() => setActiveStrategy(strategy.id as any)}
                className={`w-full text-left p-8 rounded-[36px] border transition-all relative overflow-hidden group ${
                  strategy.active 
                    ? (isDaylight ? 'bg-slate-900 text-white shadow-xl' : 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.1)]') 
                    : (isDaylight ? 'bg-white border-slate-100 hover:border-slate-300' : 'bg-white/5 border-white/10 hover:border-white/20 shadow-2xl')
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${strategy.active ? (isDaylight ? 'bg-white/20' : 'bg-[#00F0FF] text-black') : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className={`text-[15px] font-black uppercase tracking-tight ${strategy.active ? (isDaylight ? 'text-white' : 'text-white') : (isDaylight ? 'text-slate-900' : 'text-slate-400')}`}>{strategy.title}</span>
                  </div>
                  {strategy.active && <Check className={`w-6 h-6 ${isDaylight ? 'text-white' : 'text-[#00F0FF]'}`} />}
                </div>
                <p className={`text-[11px] font-medium leading-relaxed mb-6 opacity-70 ${strategy.active ? 'text-white' : 'text-slate-400'}`}>{strategy.desc}</p>
                <div className="flex items-center gap-3 pt-2">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-40 ${strategy.active ? 'text-white' : 'text-slate-500'}`}>Operational Impact:</span>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    strategy.active 
                      ? (isDaylight ? 'bg-white/10 border-white/20 text-white' : 'bg-[#00F0FF]/20 border-[#00F0FF]/40 text-[#00F0FF]') 
                      : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-500'
                  }`}>
                    {strategy.impact}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className={`p-12 border-white/5 relative overflow-hidden ${isDaylight ? 'bg-slate-50 shadow-inner' : 'bg-gradient-to-br from-[#00F0FF]/5 to-transparent'}`}>
        {/* Background Graphic */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100">
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
               </pattern>
             </defs>
             <rect width="100" height="100" fill="url(#grid)" />
           </svg>
        </div>

        <div className="flex flex-col xl:flex-row gap-16 items-center relative z-10">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-[#00F0FF]/10">
                   <GitMerge className="w-6 h-6 text-[#00F0FF]" />
                </div>
                <h3 className={`text-3xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Manual Identity Bridge</h3>
              </div>
              <p className={`text-lg leading-relaxed italic max-w-2xl ${isDaylight ? 'text-slate-600' : 'text-slate-400'}`}>
                "Sometimes the machines miss a connection. Use the bridge tool to manually join two disparate identities into a single <span className="text-[#00F0FF] font-black">Universal Identity</span>."
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" icon={Plus}>Open Bridge Interface</Button>
              <Button variant="secondary" size="lg" icon={ShieldCheck}>Audit Manual Joins (12)</Button>
            </div>
          </div>
          <div className={`w-full xl:w-96 h-64 rounded-[48px] border relative overflow-hidden flex items-center justify-center transition-all duration-700 hover:scale-105 shadow-2xl ${isDaylight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/5'}`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <GitMerge className="w-48 h-48 text-[#00F0FF]" />
            </div>
            <div className="relative flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-xl ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <Share2 className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-8 h-8 text-[#00F0FF] animate-pulse" />
                <span className="text-[7px] font-black text-[#00F0FF] uppercase tracking-widest">SYNTHESIZING</span>
              </div>
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-xl ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <Fingerprint className="w-8 h-8 text-[#00F0FF]" />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
