import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Settings2, 
  Zap, 
  Target, 
  Fingerprint, 
  Sparkles, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Globe, 
  Heart,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOperationalMerit, BadgeDefinition } from '../context/OperationalMeritContext';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';
import { BadgeForge } from './BadgeForge';

const ICON_MAP: Record<string, any> = {
  Trash2, Target, Fingerprint, Sparkles, Users, Zap, MessageSquare, BookOpen, 
  Award, Globe, Heart, ShieldCheck, TrendingUp, Cpu
};

export const MeritArchitecture: React.FC = () => {
  const { isDaylight } = useTheme();
  const { badges, toggleBadge, addCustomBadge, removeCustomBadge } = useOperationalMerit();
  const [isCreating, setIsCreating] = useState(false);
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    icon: 'Award',
    triggerCriteria: 'custom_trigger'
  });

  const categories = [
    { id: 'operational', label: 'Operational', icon: Cpu, color: '#00F0FF' },
    { id: 'social', label: 'Social', icon: MessageSquare, color: '#FF5733' },
    { id: 'culture', label: 'Culture', icon: Globe, color: '#A855F7' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: '#22C55E' },
    { id: 'custom', label: 'Custom', icon: Award, color: '#EAB308' },
  ];

  const handleCreateBadge = () => {
    if (!newBadge.name || !newBadge.description) return;
    addCustomBadge(newBadge);
    setIsCreating(false);
    setNewBadge({ name: '', description: '', icon: 'Award', triggerCriteria: 'custom_trigger' });
  };

  const badgeArray = Object.values(badges);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Merit Governance
            <div className="px-2 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF]">
              SYSTEM ARCHITECT
            </div>
          </h2>
          <p className="text-sm text-slate-400 mt-1 italic">Define the behavioral triggers and cultural anchors for your organization.</p>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00F0FF] text-[#0B0F19] font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-all"
        >
          <Plus size={16} /> Forge New Badge
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Category Filter & Stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Merit Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => {
                const count = badgeArray.filter(b => b.category === cat.id).length;
                const activeCount = badgeArray.filter(b => b.category === cat.id && b.enabled).length;
                return (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <cat.icon size={16} style={{ color: cat.color }} />
                      <span className="text-xs font-bold text-slate-200">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">{activeCount}/{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FF5733]/5 to-transparent border border-[#FF5733]/20 space-y-4">
             <div className="flex items-center gap-2">
               <AlertCircle size={14} className="text-[#FF5733]" />
               <span className="text-[10px] font-black text-white uppercase tracking-wider">Data Cost Note</span>
             </div>
             <p className="text-[10px] text-slate-400 leading-relaxed italic">
               Custom badges with automated triggers increase tenant compute cycles. We recommend using <strong>Identity Engine Universal Adapters</strong> to minimize operational overhead.
             </p>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badgeArray.map((badge) => {
              const Icon = ICON_MAP[badge.icon] || Award;
              const category = categories.find(c => c.id === badge.category);
              
              return (
                <GlassCard 
                  key={badge.name} 
                  className={`p-6 border-l-4 transition-all duration-300 ${badge.enabled ? '' : 'opacity-40'}`}
                  style={{ borderLeftColor: category?.color }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-white/5 text-white`}>
                      <Icon size={20} style={{ color: category?.color }} />
                    </div>
                    <div className="flex items-center gap-3">
                      {badge.isCustom && (
                        <button 
                          onClick={() => removeCustomBadge(badge.name)}
                          className="p-2 text-slate-500 hover:text-[#FF5733] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => toggleBadge(badge.name)}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                          badge.enabled 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                      >
                        {badge.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{badge.name}</h3>
                    <p className="text-[11px] text-slate-400 italic leading-relaxed h-8 overflow-hidden line-clamp-2">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Zap size={10} className="text-slate-500" />
                       <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                         {badge.triggerCriteria || 'Manual Distribution Only'}
                       </span>
                    </div>
                    <Info size={12} className="text-slate-700 cursor-help" />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>

      <BadgeForge isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
};
