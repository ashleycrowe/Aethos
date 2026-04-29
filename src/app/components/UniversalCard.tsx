import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { 
  Share2, 
  Users, 
  FileText, 
  Calendar, 
  CircleCheck, 
  Hash,
  Globe,
  Slack,
  Box as BoxIcon,
  HardDrive,
  MessageSquare,
  Mail,
  Zap,
  Snowflake,
  Info,
  Cpu,
  BarChart,
  ShieldAlert,
  History as HistoryIcon
} from 'lucide-react';
import { Stack } from './layout/Primitives';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Modal } from './ui/Modal';
import { ProviderType, ContainerType } from '../types/aethos.types';

export type UniversalCategory = 'storage' | 'compute' | 'communication' | 'governance';

interface UniversalCardProps {
  id: string;
  title: string;
  subTitle?: string;
  type: ContainerType | string;
  provider?: ProviderType;
  category?: UniversalCategory;
  status: 'active' | 'idle' | 'archived' | 'ghost' | 'alert';
  metadata: string;
  className?: string;
  isSelected?: boolean;
  isArchived?: boolean;
  retentionDays?: number;
  onSelect?: (id: string) => void;
  onArchive?: (id: string) => void;
  onAction?: (action: string) => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  id,
  title,
  subTitle,
  type,
  provider = 'microsoft',
  category = 'storage',
  status,
  metadata,
  className,
  isSelected,
  isArchived,
  retentionDays = 365,
  onSelect,
  onArchive,
  onAction
}) => {
  const { isDaylight, brand } = useTheme();
  const { openForensicLab } = useAethos();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getIcon = () => {
    if (isArchived) return <Snowflake className="w-4 h-4" />;
    
    if (category === 'communication') {
      if (type === 'channel') return <Slack className="w-4 h-4" />;
      if (type === 'email') return <Mail className="w-4 h-4" />;
      return <MessageSquare className="w-4 h-4" />;
    }

    switch (type) {
      case 'site': return <Share2 className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      case 'plan': return <Calendar className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      case 'user': return <Hash className="w-4 h-4" />;
      case 'space': return <Globe className="w-4 h-4" />;
      case 'channel': return <Slack className="w-4 h-4" />;
      case 'folder': return <BoxIcon className="w-4 h-4" />;
      case 'bucket': return <HardDrive className="w-4 h-4" />;
      case 'compute': return <Zap className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const providerIcons: Record<ProviderType, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: HardDrive
  };

  const ProviderIcon = providerIcons[provider as ProviderType] || Globe;

  const statusConfig = {
    active: { color: isDaylight ? 'bg-emerald-500 shadow-sm' : 'bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]', label: 'Optimal' },
    idle: { color: 'bg-slate-400', label: 'Idle' },
    ghost: { color: 'bg-[#FF5733] shadow-[0_0_10px_#FF5733]', label: 'Ghost' },
    alert: { color: 'bg-amber-500 shadow-[0_0_10px_#F59E0B]', label: 'Risk' },
    archived: { color: 'bg-slate-700', label: 'Frozen' }
  };

  const cardSelectedClasses = isDaylight 
    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-lg' 
    : 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_30px_rgba(0,240,255,0.1)] ring-1 ring-[#00F0FF]/20';

  const cardBaseClasses = isDaylight
    ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]';

  return (
    <>
      <Motion.div 
        className="relative group h-full"
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isArchived ? 0.6 : 1,
          y: 0,
          filter: isArchived ? 'grayscale(0.5) blur(0.5px)' : 'grayscale(0) blur(0px)'
        }}
        whileHover={{ scale: isArchived ? 1 : 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: isArchived ? 1 : 0.98 }}
      >
        <GlassCard 
          className={`h-full flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${
            isArchived 
              ? isDaylight ? 'border-slate-100 bg-slate-50/50 grayscale opacity-40' : 'border-white/10 bg-slate-900/40 cursor-default' 
              : isSelected ? cardSelectedClasses : cardBaseClasses
          } ${className}`} 
          onClick={(e) => {
            if (isArchived) return;
            e.preventDefault();
            onSelect?.(id);
          }}
        >
          <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            <ProviderIcon className="w-8 h-8" />
          </div>

          <Stack direction="row" justify="between" align="start" className="mb-4 relative z-10">
            <Stack direction="row" gap="xs">
              <div className={`p-2 rounded-xl transition-all duration-500 ${
                isArchived 
                  ? 'bg-slate-200 text-slate-400' 
                  : isSelected 
                    ? isDaylight ? 'bg-slate-900 text-white shadow-md' : 'bg-[#00F0FF] text-black shadow-lg' 
                    : isDaylight ? 'bg-slate-50 text-slate-400 group-hover:text-slate-900 border border-slate-100' : 'bg-white/5 text-slate-400 group-hover:text-white'
              }`}>
                {getIcon()}
              </div>
              <div className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 shrink-0 ${isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/5'}`}>
                <ProviderIcon className="w-3 h-3 text-slate-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{provider}</span>
              </div>
            </Stack>
            
            {!isArchived && (
              <Stack direction="col" align="end" gap="none">
                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[status].color} mb-1`} />
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">{statusConfig[status].label}</span>
              </Stack>
            )}
            {isArchived && <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Vaulted</span>}
          </Stack>
          
          <div className="flex-grow mb-6 relative z-10 min-w-0">
            <h3 className={`font-black font-['Space_Grotesk'] text-fluid-sm line-clamp-2 leading-tight transition-colors mb-1 break-words ${
              isArchived 
                ? 'text-slate-400' 
                : isSelected 
                  ? isDaylight ? 'text-slate-900' : 'text-[#00F0FF]' 
                  : isDaylight ? 'text-slate-900' : 'text-white'
            }`}>
              {title}
            </h3>
            {subTitle && (
              <p className="text-[9px] md:text-[10px] text-slate-500 font-bold truncate uppercase tracking-widest">{subTitle}</p>
            )}
            
            {isArchived && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                <div className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" />
                <Stack direction="col" gap="none">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Retention Countdown</span>
                  <span className="text-[10px] font-bold text-amber-500 font-['JetBrains_Mono']">{retentionDays}D Remaining</span>
                </Stack>
              </div>
            )}
          </div>

          <Stack direction="row" justify="between" align="center" className={`border-t pt-4 mt-auto relative z-10 ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-slate-500 text-[8px] font-black uppercase tracking-[0.15em] mb-0.5">
                Metadata Intelligence
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${isDaylight ? 'text-slate-600' : 'text-white/70'}`}>
                {metadata}
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {!isArchived && (status === 'ghost' || status === 'alert') ? (
                <button 
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    status === 'ghost' 
                      ? 'bg-[#FF5733]/10 hover:bg-[#FF5733] text-[#FF5733] hover:text-white border border-[#FF5733]/20' 
                      : 'bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/20'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive?.(id);
                  }}
                >
                  Remediate
                </button>
              ) : null}
              
              <button 
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isSelected 
                    ? isDaylight ? 'bg-slate-900 text-white shadow-md' : 'bg-[#00F0FF] text-black shadow-lg' 
                    : isDaylight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-slate-100' : 'hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
                disabled={isArchived}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsOpen(true);
                }}
              >
                <Zap className="w-3 h-3" />
                Deconstruct
              </button>
            </div>
          </Stack>
        </GlassCard>
      </Motion.div>

      {/* Intelligence Deconstruction Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={title}
        subtitle={`Operational Deconstruction • ${provider.toUpperCase()} ${type.toUpperCase()}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Main Story Narrative */}
            <div className={`p-8 rounded-[40px] border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5 shadow-inner'}`}>
              <div className="flex items-center gap-4 mb-6">
                <Info className="w-5 h-5 text-[#00F0FF]" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Intelligence Narrative</h4>
              </div>
              <p className={`text-xl font-medium leading-relaxed italic ${isDaylight ? 'text-slate-600' : 'text-slate-400'}`}>
                "This {type} node shows significant operational inactivity over the last cycle. As an <span className={`${isDaylight ? 'text-slate-900' : 'text-white'} font-black italic underline decoration-[#00F0FF] underline-offset-4`}>Operational Architect</span>, you should consider archival to maintain tenant clarity."
              </p>
            </div>

            {/* Technical Derivation */}
            <div className={`p-8 rounded-[40px] border ${isDaylight ? 'bg-white border-slate-100' : 'bg-black/40 border-white/5'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Cpu className="w-5 h-5 text-amber-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Logic Calculation</h4>
                </div>
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  ALGORITHM_V2.4
                </div>
              </div>
              <div className={`p-6 rounded-2xl font-mono text-xs leading-relaxed mb-6 ${isDaylight ? 'bg-slate-100 text-slate-600' : 'bg-black/60 text-[#00F0FF]/80 border border-white/5'}`}>
                {`SELECT activity_score, last_interaction FROM intelligence_layer\nWHERE artifact_id = '${id}'\nAND provider = '${provider}'\n\n// Activity Decay Function\nDECAY(activity_score) = score * e^(-0.05 * days_since_last_interaction)\nRESULT: ${status === 'ghost' ? '0.12 (CRITICAL_DECAY)' : '0.45 (LOW_IDLE)'}`}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <Motion.div initial={{ width: 0 }} animate={{ width: status === 'ghost' ? '12%' : '45%' }} className={`h-full ${status === 'ghost' ? 'bg-[#FF5733]' : 'bg-[#00F0FF]'}`} />
                </div>
                <span className={`text-[10px] font-black font-['JetBrains_Mono'] ${status === 'ghost' ? 'text-[#FF5733]' : 'text-[#00F0FF]'}`}>
                  {status === 'ghost' ? 'HIGH RISK' : 'STABLE'}
                </span>
              </div>
            </div>

            {/* Historical Audit Trail */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <HistoryIcon className="w-5 h-5 text-slate-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operational Audit</h4>
              </div>
              <div className="space-y-3">
                {[
                  { action: 'Discovered', time: '12 days ago', user: 'Identity Engine' },
                  { action: 'Classified', time: '11 days ago', user: 'System' },
                  { action: 'Alert Triggered', time: '2 days ago', user: 'Audit Architect' }
                ].map((log, i) => (
                  <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border ${isDaylight ? 'bg-white border-slate-100' : 'bg-white/[0.01] border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-slate-500" />
                      <span className={`text-[11px] font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{log.action}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{log.user}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Quick Actions Panel */}
            <div className={`p-8 rounded-[40px] border ${isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-[#0B0F19] border-white/10 shadow-2xl'}`}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Remediation Protocols</h4>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setIsDetailsOpen(false);
                    onArchive?.(id);
                  }}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all ${
                    isDaylight ? 'bg-slate-900 text-white' : 'bg-[#FF5733] text-white hover:shadow-[0_0_20px_rgba(255,87,51,0.4)]'
                  }`}
                >
                  <Snowflake className="w-4 h-4" /> Initialize Archival
                </button>
                <button 
                  className={`w-full py-5 rounded-2xl border font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all ${
                    isDaylight ? 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <HistoryIcon className="w-4 h-4" /> Full Audit Trail
                </button>
              </div>
            </div>

            {/* Impact Projection */}
            <div className={`p-8 rounded-[40px] border ${isDaylight ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
              <div className="flex items-center gap-4 mb-6">
                <BarChart className="w-5 h-5 text-indigo-500" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">ROI Projection</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Savings</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-['JetBrains_Mono']">$14.20/mo</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Archiving this container would reclaim approximately 120GB of Tier 1 storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

