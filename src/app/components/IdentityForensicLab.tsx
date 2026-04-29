import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Network, 
  Search, 
  Filter, 
  CheckCircle2, 
  MoreHorizontal,
  Users,
  Ghost,
  Activity,
  Zap,
  Trash2,
  Archive,
  UserX,
  ArrowRight,
  TrendingDown,
  GitMerge,
  Globe,
  Slack,
  Box as BoxIcon,
  Share2,
  HardDrive,
  Cpu,
  BarChart3,
  X as CloseIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { AethosIdentity, ProviderType } from '../types/aethos.types';
import { toast } from 'sonner';

// Import New UI Components
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { Input } from './ui/Input';

interface IdentityForensicLabProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIdentityId?: string;
}

const providerIcons: Record<ProviderType, any> = {
  microsoft: Share2,
  google: Globe,
  slack: Slack,
  box: BoxIcon,
  local: HardDrive
};

export const IdentityForensicLab: React.FC<IdentityForensicLabProps> = ({ isOpen, onClose, selectedIdentityId }) => {
  const { isDaylight } = useTheme();
  const { state, remediateIdentity } = useAethos();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Local state for identities to simulate removal
  const [identities, setIdentities] = useState<AethosIdentity[]>(state.identities);

  const handleRemediate = async (action: 'suspend' | 'archive' | 'delete') => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    selectedIds.forEach(id => remediateIdentity(id, action));
    setIdentities(prev => prev.filter(i => !selectedIds.includes(i.id)));
    
    setIsProcessing(false);
    setSelectedIds([]);
    
    toast.success(`Identity Remediation Complete`, {
      description: `${selectedIds.length} identities processed via ${action} protocol.`
    });
  };

  const totalExposureReduction = selectedIds.reduce((acc, id) => {
    const ident = identities.find(i => i.id === id);
    return acc + (ident?.riskFactor || 0);
  }, 0) / (identities.length || 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end overflow-hidden">
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <Motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-5xl h-full bg-white dark:bg-[#0B0F19] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Lab Header */}
            <div className={`p-10 border-b flex items-center justify-between shrink-0 z-10 ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0B0F19] border-white/5'}`}>
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl shadow-lg ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black'}`}>
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Identity Forensic Lab</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Exposure Synthesis: Cross-Cloud Verification Active</p>
                </div>
              </div>
              <IconButton icon={CloseIcon} variant="ghost" onClick={onClose} size="lg" />
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Main Table Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Table Filters */}
                <div className={`p-8 border-b flex items-center gap-6 ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'}`}>
                  <div className="flex-1">
                    <Input 
                      placeholder="Search Universal Identities or Provider Clusters..."
                      icon={Search}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <IconButton icon={Filter} variant="glass" title="Advanced Filter" />
                    <Button variant="secondary" icon={GitMerge}>Reconciliation</Button>
                  </div>
                </div>

                {/* High-Density Table */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5">
                        <th className="p-6 text-left">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.length === identities.length && identities.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedIds(identities.map(i => i.id));
                              else setSelectedIds([]);
                            }}
                            className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-white/5 border-white/10 accent-[#00F0FF] cursor-pointer" 
                          />
                        </th>
                        <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Universal Identity</th>
                        <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                        <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Cloud Linkage</th>
                        <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Exposure Index</th>
                        <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Reach Density</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                      {identities.map((identity) => {
                        const PrimaryIcon = providerIcons[identity.provider] || Fingerprint;
                        const links = identity.metadata.crossCloudLink?.split(', ') || [];
                        const isSelected = selectedIds.includes(identity.id);
                        
                        return (
                          <tr 
                            key={identity.id} 
                            className={`hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer ${isSelected ? (isDaylight ? 'bg-blue-50/50' : 'bg-[#00F0FF]/5') : ''}`}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedIds(selectedIds.filter(id => id !== identity.id));
                              } else {
                                setSelectedIds([...selectedIds, identity.id]);
                              }
                            }}
                          >
                            <td className="p-6">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-white/5 border-white/10 accent-[#00F0FF] pointer-events-none" 
                                readOnly
                              />
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                                  isSelected 
                                    ? (isDaylight ? 'bg-slate-900 border-slate-900 text-white' : 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]') 
                                    : (isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/5 border-white/5 group-hover:border-white/20 group-hover:bg-white/10')
                                } relative`}>
                                  <PrimaryIcon className="w-5 h-5" />
                                  {links.length > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00F0FF] rounded-full border-2 border-white dark:border-[#0B0F19]" />}
                                </div>
                                <div>
                                  <p className={`text-[13px] font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{identity.name}</p>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 opacity-70">{identity.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6 text-center">
                              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
                                identity.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                identity.status === 'orphaned' ? 'bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20' : 
                                'bg-slate-500/10 text-slate-400 border border-white/5'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${identity.status === 'active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]' : identity.status === 'orphaned' ? 'bg-[#FF5733]' : 'bg-slate-500'}`} />
                                {identity.status}
                              </div>
                            </td>
                            <td className="p-6 text-center">
                              <div className="flex items-center justify-center -space-x-3">
                                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-xl transition-transform group-hover:-translate-x-1 ${isDaylight ? 'bg-white border-slate-50' : 'bg-[#1e293b] border-[#0B0F19]'}`}>
                                   <PrimaryIcon className="w-4 h-4 text-slate-400" />
                                </div>
                                {links.map((link, i) => {
                                  const provider = link.split('-')[0] as ProviderType;
                                  const LinkIcon = providerIcons[provider] || Fingerprint;
                                  return (
                                    <div key={i} className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-xl transition-transform group-hover:translate-x-1 ${isDaylight ? 'bg-white border-slate-50' : 'bg-[#1e293b] border-[#0B0F19]'}`}>
                                       <LinkIcon className="w-4 h-4 text-slate-400" />
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="p-6 text-center">
                               <div className="flex flex-col items-center gap-2">
                                 <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isDaylight ? 'bg-slate-100 shadow-inner' : 'bg-white/10 shadow-black'}`}>
                                   <Motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${identity.riskFactor}%` }}
                                      className={`h-full ${identity.riskFactor > 80 ? 'bg-[#FF5733]' : identity.riskFactor > 50 ? 'bg-amber-500' : 'bg-[#00F0FF]'}`}
                                   />
                                 </div>
                                 <span className={`text-[10px] font-black font-['JetBrains_Mono'] ${identity.riskFactor > 50 ? 'text-[#FF5733]' : 'text-[#00F0FF]'}`}>{identity.riskFactor}%</span>
                               </div>
                            </td>
                            <td className="p-6 text-right">
                               <span className={`text-sm font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{identity.accessCount} pts</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Identity Business Meanings Sidebar */}
              <div className={`w-[420px] border-l p-12 flex flex-col shrink-0 relative overflow-hidden ${isDaylight ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-black/40 border-white/5'}`}>
                {/* Subtle Background Glow */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00F0FF]/5 blur-[100px] rounded-full pointer-events-none" />
                
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                  <Activity className="w-4 h-4" />
                  Business Synthesis
                </h3>
                
                <div className="space-y-12 flex-1 overflow-y-auto custom-scrollbar pr-4 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[#FF5733]">
                      <div className="p-2 rounded-xl bg-[#FF5733]/10">
                        <Ghost className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Dead Capital Artifacts</span>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                      "Identities marked as **'Orphaned'** exist in secondary providers but have no active anchor in M365. This is **Identity Bloat**."
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[#00F0FF]">
                      <div className="p-2 rounded-xl bg-[#00F0FF]/10">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Reach Density</span>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                      "High **Reach Density** points to critical operational nodes. These represent significant **Inertia Risks** if exposure is high."
                    </p>
                  </div>

                  <div className={`p-8 rounded-[40px] bg-[#00F0FF]/5 border border-[#00F0FF]/10 space-y-8 relative overflow-hidden group`}>
                    <TrendingDown className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity" />
                    
                    <div className="flex items-center gap-4 text-[#00F0FF]">
                      <TrendingDown className="w-6 h-6" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Reach Compression</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Impact</span>
                      <span className="text-4xl font-black text-[#00F0FF] font-['JetBrains_Mono'] tracking-tighter">-{totalExposureReduction.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-4 py-4 border-t border-white/5">
                      <div className="p-2 rounded-lg bg-white/5">
                        <Cpu className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic opacity-60">
                        Calculated exposure compression.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-12 space-y-4 relative z-10">
                  <Button 
                    disabled={selectedIds.length === 0 || isProcessing}
                    onClick={() => handleRemediate('archive')}
                    isLoading={isProcessing}
                    icon={Archive}
                    fullWidth
                    size="xl"
                    variant="primary"
                  >
                    Archive Universal ID
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      disabled={selectedIds.length === 0 || isProcessing}
                      onClick={() => handleRemediate('suspend')}
                      variant="secondary"
                      icon={UserX}
                      fullWidth
                    >
                      Suspend
                    </Button>
                    <Button 
                      disabled={selectedIds.length === 0 || isProcessing}
                      onClick={() => handleRemediate('delete')}
                      variant="alert"
                      icon={Trash2}
                      fullWidth
                    >
                      Purge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
