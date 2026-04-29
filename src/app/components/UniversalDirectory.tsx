import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Fingerprint, 
  Globe, 
  Slack, 
  Box as BoxIcon, 
  Share2, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Clock,
  Zap,
  CheckCircle2,
  Mail,
  Building,
  Calendar,
  Lock,
  UserCheck,
  X as CloseIcon,
  Download,
  Plus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { AethosIdentity, ProviderType } from '../types/aethos.types';
import { GlassCard } from './GlassCard';

// Import New UI Components
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { IconButton } from './ui/IconButton';
import { Select } from './ui/Select';

const providerIcons: Record<ProviderType, any> = {
  microsoft: Share2,
  google: Globe,
  slack: Slack,
  box: BoxIcon,
  local: ShieldCheck
};

export const UniversalDirectory = () => {
  const { isDaylight } = useTheme();
  const { state } = useAethos();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdentity, setSelectedIdentity] = useState<AethosIdentity | null>(null);
  const [filterProvider, setFilterProvider] = useState<ProviderType | 'all'>('all');

  const filteredIdentities = state.identities.filter(identity => {
    const matchesSearch = identity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          identity.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = filterProvider === 'all' || identity.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const providerOptions = [
    { label: 'All Sources', value: 'all', icon: <Filter className="w-3.5 h-3.5" /> },
    { label: 'Microsoft 365', value: 'microsoft', icon: <Share2 className="w-3.5 h-3.5 text-blue-500" /> },
    { label: 'Slack', value: 'slack', icon: <Slack className="w-3.5 h-3.5 text-pink-500" /> },
    { label: 'Google', value: 'google', icon: <Globe className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Box', value: 'box', icon: <BoxIcon className="w-3.5 h-3.5 text-blue-400" /> },
  ];

  return (
    <div className="flex h-full gap-8 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <GlassCard className="p-10 mb-8 shrink-0 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00F0FF]/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
            <div className="space-y-1">
              <h3 className={`text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Universal Directory</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-relaxed">Cross-Provider Identity Synthesis Engine</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search identities..."
                icon={Search}
                className="w-full md:w-80"
              />
              
              <div className="flex items-center gap-3">
                <Select 
                  options={providerOptions}
                  value={filterProvider}
                  onChange={(val) => setFilterProvider(val as any)}
                  className="w-56"
                />
                
                <IconButton 
                  icon={Download} 
                  variant="glass" 
                  title="Export Directory" 
                />
                <Button 
                  icon={Plus} 
                  variant="primary"
                >
                  Invite
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4 text-left font-black">Identity Artifact</th>
                <th className="px-6 py-4 text-center font-black">Source Graph</th>
                <th className="px-6 py-4 text-center font-black">Status</th>
                <th className="px-6 py-4 text-center font-black">Risk Score</th>
                <th className="px-6 py-4 text-center font-black">Last Pulse</th>
                <th className="px-8 py-4 text-right font-black"></th>
              </tr>
            </thead>
            <tbody>
              {filteredIdentities.map((identity, idx) => {
                const PrimaryIcon = providerIcons[identity.provider] || Fingerprint;
                const isSelected = selectedIdentity?.id === identity.id;
                
                return (
                  <Motion.tr 
                    key={identity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedIdentity(identity)}
                    className={`group cursor-pointer transition-all duration-300 relative ${
                      isSelected 
                        ? (isDaylight ? 'bg-white shadow-xl shadow-slate-200/50' : 'bg-[#00F0FF]/5') 
                        : (isDaylight ? 'bg-slate-50/50 hover:bg-white' : 'bg-white/[0.01] hover:bg-white/[0.04]')
                    }`}
                  >
                    <td className="px-8 py-5 rounded-l-[32px] border-y border-l border-transparent group-hover:border-white/5">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${
                          isSelected 
                            ? (isDaylight ? 'bg-slate-900 text-white shadow-lg' : 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]') 
                            : (isDaylight ? 'bg-white border border-slate-200' : 'bg-black/40 border border-white/5 group-hover:border-[#00F0FF]/30')
                        }`}>
                          {identity.name[0]}
                        </div>
                        <div>
                          <p className={`text-[13px] font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{identity.name}</p>
                          <p className="text-[10px] font-black text-slate-500 font-['JetBrains_Mono'] tracking-tight">{identity.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent group-hover:border-white/5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className={`p-2.5 rounded-xl border ${isDaylight ? 'bg-white border-slate-100' : 'bg-black/40 border border-white/10'}`}>
                          <PrimaryIcon className={`w-4 h-4 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />
                        </div>
                        {identity.metadata.crossCloudLink && (
                          <div className={`p-2.5 rounded-xl border border-dashed animate-pulse ${isDaylight ? 'border-slate-300 text-slate-400' : 'border-white/20 text-[#00F0FF]'}`}>
                            <Zap className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent group-hover:border-white/5 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        identity.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        'bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${identity.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-[#FF5733]'}`} />
                        {identity.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent group-hover:border-white/5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <Motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${identity.riskFactor}%` }}
                            className={`h-full ${identity.riskFactor > 70 ? 'bg-[#FF5733]' : 'bg-[#00F0FF]'}`} 
                          />
                        </div>
                        <span className="text-[10px] font-black font-['JetBrains_Mono'] text-slate-500">{identity.riskFactor}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent group-hover:border-white/5 text-center">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{identity.lastActive}</span>
                    </td>
                    <td className="px-8 py-5 rounded-r-[32px] border-y border-r border-transparent group-hover:border-white/5 text-right">
                      <IconButton 
                        icon={ChevronRight} 
                        variant={isSelected ? 'solid' : 'ghost'} 
                        size="sm"
                        className={isSelected ? (isDaylight ? '' : 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]') : ''}
                      />
                    </td>
                  </Motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedIdentity && (
          <Motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="w-[440px] shrink-0"
          >
            <GlassCard className="h-full flex flex-col overflow-hidden relative border-t-8 border-t-[#00F0FF]">
              <div className="absolute top-8 right-8 z-10">
                <IconButton 
                  icon={CloseIcon} 
                  variant="ghost" 
                  onClick={() => setSelectedIdentity(null)} 
                />
              </div>

              <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center text-center mb-12">
                  <div className={`w-28 h-28 rounded-[40px] mb-8 flex items-center justify-center font-black text-5xl relative transition-all duration-700 ${isDaylight ? 'bg-slate-100 text-slate-900 shadow-xl' : 'bg-gradient-to-br from-[#00F0FF] to-[#7000FF] text-white shadow-[0_0_40px_rgba(0,240,255,0.3)]'}`}>
                    {selectedIdentity.name[0]}
                    <div className="absolute -bottom-3 -right-3 p-4 bg-white dark:bg-[#0B0F19] rounded-2xl shadow-2xl border border-white/10 ring-4 ring-slate-100 dark:ring-white/5">
                      {React.createElement(providerIcons[selectedIdentity.provider], { className: "w-6 h-6 text-[#00F0FF]" })}
                    </div>
                  </div>
                  <h4 className={`text-3xl font-black uppercase tracking-tight leading-none mb-3 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{selectedIdentity.name}</h4>
                  <div className="flex items-center gap-3">
                    <p className="text-[11px] font-black text-[#00F0FF] uppercase tracking-[0.3em]">{selectedIdentity.role}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-30" />
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Tier 1</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-6 rounded-3xl border flex items-center justify-between ${isDaylight ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-black/40 border-white/5'}`}>
                      <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Universal ID</span>
                      </div>
                      <span className={`text-[11px] font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{selectedIdentity.email}</span>
                    </div>
                    <div className={`p-6 rounded-3xl border flex items-center justify-between ${isDaylight ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-black/40 border-white/5'}`}>
                      <div className="flex items-center gap-4">
                        <Building className="w-5 h-5 text-slate-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Org Branch</span>
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Architectural Ops</span>
                    </div>
                    <div className={`p-6 rounded-3xl border flex items-center justify-between ${isDaylight ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-black/40 border-white/5'}`}>
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Sync Date</span>
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Feb 11, 2026</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                        <Zap className="w-4 h-4 text-[#00F0FF]" />
                        Synthesized Cloud Adapters
                      </h5>
                      <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest underline cursor-pointer">Re-Sync All</span>
                    </div>
                    <div className="space-y-3">
                      <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10 shadow-lg'}`}>
                        <div className="flex items-center gap-4">
                          <Share2 className="w-5 h-5 text-blue-500" />
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest block">Microsoft 365</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Linked via graph api</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10 shadow-lg'}`}>
                        <div className="flex items-center gap-4">
                          <Slack className="w-5 h-5 text-pink-500" />
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest block">Slack Enterprise</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Verified by email</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className={`p-5 rounded-2xl border border-dashed flex items-center justify-between opacity-50 hover:opacity-100 transition-all ${isDaylight ? 'bg-slate-50 border-slate-300' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center gap-4">
                          <Globe className="w-5 h-5 text-emerald-500" />
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest block text-slate-500">Google Workspace</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">No matching record</span>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-slate-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className={`p-8 rounded-[40px] relative overflow-hidden ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#FF5733]/10 border border-[#FF5733]/20 text-[#FF5733]'}`}>
                    {/* Background Decorative Icon */}
                    <ShieldAlert className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rotate-12" />
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="p-2 rounded-xl bg-white/10">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.4em]">Blast Radius Insight</h5>
                    </div>
                    <p className="text-[13px] leading-relaxed italic opacity-90 relative z-10 font-medium">
                      "This identity has active access to 14 <span className="underline decoration-[#FF5733] underline-offset-4 font-black">Critical Exposure Vectors</span>. Aethos recommends a Universal Permission Audit to reduce shadow leakage."
                    </p>
                  </div>
                </div>

                <div className="pt-12 space-y-4">
                   <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg"
                    icon={UserCheck}
                   >
                     Initialize Audit Pulse
                   </Button>
                   <Button 
                    variant="secondary" 
                    fullWidth 
                    size="lg"
                    icon={Clock}
                   >
                     Activity Intelligence
                   </Button>
                </div>
              </div>
            </GlassCard>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
