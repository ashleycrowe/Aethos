import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Archive, 
  Trash2, 
  ShieldAlert, 
  Clock, 
  Database, 
  User, 
  MoreHorizontal,
  ChevronRight,
  TrendingDown,
  Info,
  X,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Flame,
  Zap,
  Globe,
  Box as BoxIcon,
  HardDrive,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface ShadowArtifact {
  id: string;
  name: string;
  size: string;
  lastAccessed: string;
  owner: string;
  exposure: 'public' | 'internal' | 'external' | 'restricted';
  type: 'google' | 'box' | 'local';
  waste: string;
}

interface UniversalForensicLabProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAdapter?: string;
}

const adapterIcons = {
  google: Globe,
  box: BoxIcon,
  local: HardDrive
};

export const UniversalForensicLab: React.FC<UniversalForensicLabProps> = ({ isOpen, onClose, selectedAdapter }) => {
  const { isDaylight } = useTheme();
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  const [artifacts, setArtifacts] = useState<ShadowArtifact[]>([
    { id: 'sa1', name: 'Board_Meeting_Minutes_2022.pdf', size: '2.4 MB', lastAccessed: '380 days ago', owner: 'External Guest', exposure: 'public', type: 'google', waste: '$0.40/mo' },
    { id: 'sa2', name: 'Financial_Projections_Backup.zip', size: '1.8 GB', lastAccessed: '412 days ago', owner: 'Sarah Chen', exposure: 'external', type: 'box', waste: '$18.00/mo' },
    { id: 'sa3', name: 'Legacy_Customer_List.csv', size: '45 MB', lastAccessed: '730 days ago', owner: 'System Admin', exposure: 'public', type: 'google', waste: '$0.45/mo' },
    { id: 'sa4', name: 'Project_Alpha_Raw_Assets.tar.gz', size: '12.4 GB', lastAccessed: '210 days ago', owner: 'Mark Wilson', exposure: 'internal', type: 'local', waste: '$124.00/mo' },
    { id: 'sa5', name: 'Sensitive_Legal_Draft.docx', size: '1.2 MB', lastAccessed: '500 days ago', owner: 'Legal_Dept', exposure: 'external', type: 'box', waste: '$0.12/mo' },
  ]);

  const totalWasteReduction = selectedArtifacts.reduce((acc, id) => {
    const art = artifacts.find(a => a.id === id);
    return acc + parseFloat(art?.waste.replace('$', '') || '0');
  }, 0);

  const handleDisclosure = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsDisclosureOpen(false);
    toast.success("Disclosure Protocol Executed", {
      description: `Alert sent to source administrators for ${selectedArtifacts.length} artifacts.`
    });
    setSelectedArtifacts([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end overflow-hidden">
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          <Motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-5xl h-full bg-white dark:bg-[#0B0F19] border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Lab Header */}
            <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-[#00F0FF] text-black shadow-lg">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-fluid-lg font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white">Shadow Forensic Lab</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Discovery Tier: Identifying "Dead Capital" in {selectedAdapter || 'Universal Adapters'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Main Table Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search shadow artifacts by name, owner, or source..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs font-medium focus:ring-2 ring-[#00F0FF]/20 transition-all outline-none"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5">
                        <th className="p-4 text-left">
                          <input 
                            type="checkbox" 
                            checked={selectedArtifacts.length === artifacts.length}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedArtifacts(artifacts.map(a => a.id));
                              else setSelectedArtifacts([]);
                            }}
                            className="rounded bg-slate-100 dark:border-white/5 border-white/10" 
                          />
                        </th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Artifact</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Source</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Exposure</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Last Active</th>
                        <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Dead Capital</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                      {artifacts.map((artifact) => {
                        const Icon = adapterIcons[artifact.type] || Globe;
                        return (
                          <tr 
                            key={artifact.id} 
                            className={`hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer ${selectedArtifacts.includes(artifact.id) ? 'bg-[#00F0FF]/5' : ''}`}
                            onClick={() => {
                              if (selectedArtifacts.includes(artifact.id)) {
                                setSelectedArtifacts(selectedArtifacts.filter(id => id !== artifact.id));
                              } else {
                                setSelectedArtifacts([...selectedArtifacts, artifact.id]);
                              }
                            }}
                          >
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                checked={selectedArtifacts.includes(artifact.id)}
                                className="rounded bg-slate-100 dark:bg-white/5 border-white/10 text-[#00F0FF]" 
                                readOnly
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5">
                                  <FileText className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold dark:text-white truncate max-w-[200px]">{artifact.name}</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{artifact.size} • {artifact.owner}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                                <Icon className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                artifact.exposure === 'public' ? 'bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20' : 
                                artifact.exposure === 'external' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                'bg-slate-500/10 text-slate-400 border border-white/5'
                              }`}>
                                <div className={`w-1 h-1 rounded-full ${artifact.exposure === 'public' ? 'bg-[#FF5733] animate-pulse' : artifact.exposure === 'external' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                                {artifact.exposure}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                               <span className="text-[10px] font-bold text-slate-500">{artifact.lastAccessed}</span>
                            </td>
                            <td className="p-4 text-right">
                               <span className="text-[11px] font-black text-[#FF5733] font-['JetBrains_Mono']">{artifact.waste}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 p-8 flex flex-col shrink-0">
                <h3 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] mb-10">Shadow Insights</h3>
                
                <div className="space-y-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#FF5733]">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Leakage Disclosure</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Artifacts marked as **"Public"** are accessible via search indexers without authentication. These represent immediate operational risk.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#00F0FF]">
                      <Ghost className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dead Capital</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Shadow discovery identifies storage that exists outside your **Core anchors**. Reclaiming this requires disclosure to the source admin.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/10 space-y-4">
                    <div className="flex items-center gap-3 text-[#00F0FF]">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disclosure Potential</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reclaimable</span>
                      <span className="text-xl font-black text-[#00F0FF] font-['JetBrains_Mono']">${totalWasteReduction.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <button 
                    disabled={selectedArtifacts.length === 0 || isProcessing}
                    onClick={() => setIsDisclosureOpen(true)}
                    className="w-full py-4 rounded-xl bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <Send className="w-4 h-4" />
                    <span>Initialize Disclosure</span>
                  </button>
                  <p className="text-[8px] text-slate-500 text-center uppercase font-black tracking-widest">
                    * Tier 2 restricted to Alert & Redirect
                  </p>
                </div>
              </div>
            </div>

            {/* Disclosure Modal */}
            <AnimatePresence>
              {isDisclosureOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                  <Motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsDisclosureOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  />
                  <Motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-lg bg-[#0B0F19] border border-[#00F0FF]/30 rounded-[32px] overflow-hidden shadow-2xl p-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 rounded-2xl bg-[#00F0FF]/20 text-[#00F0FF]">
                        <Send className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Execute Disclosure?</h3>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed mb-8">
                      Aethos will send a formal **Operational Inefficiency Report** to the source administrators of the {selectedArtifacts.length} selected artifacts.
                    </p>

                    <div className="space-y-4 mb-10">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <Globe className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wide">Source-Specific Redirect</p>
                          <p className="text-[11px] text-slate-500 mt-1">Admin will receive deep links to Google/Box governance consoles.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsDisclosureOpen(false)}
                        className="flex-1 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDisclosure}
                        disabled={isProcessing}
                        className="flex-1 py-4 rounded-xl bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                      >
                        {isProcessing ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>Send Disclosure</span>
                        )}
                      </button>
                    </div>
                  </Motion.div>
                </div>
              )}
            </AnimatePresence>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
