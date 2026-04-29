import React, { useState, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  FileText, 
  Database, 
  Slack, 
  Globe, 
  Users, 
  MessageSquare, 
  Layout, 
  BarChart3, 
  Repeat, 
  Calendar, 
  Link2,
  ChevronRight,
  Info,
  Cpu,
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { ProviderType, ContainerType, PinnedArtifact } from '../types/aethos.types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { toast } from 'sonner';

interface ResourceCategory {
  id: string;
  name: string;
  icon: any;
  providers: ProviderType[];
}

const CATEGORIES: ResourceCategory[] = [
  { id: 'docs', name: 'Documents & Artifacts', icon: FileText, providers: ['microsoft', 'google', 'box'] },
  { id: 'social', name: 'Communities & Threads', icon: MessageSquare, providers: ['microsoft', 'slack'] },
  { id: 'data', name: 'Data & Intelligence', icon: BarChart3, providers: ['microsoft', 'google'] },
  { id: 'knowledge', name: 'Knowledge Bases', icon: Globe, providers: ['microsoft', 'local'] },
];

interface DiscoveryResource {
  id: string;
  title: string;
  type: string;
  category: string;
  provider: ProviderType;
  context: string;
  url: string;
  weight: number; // For Clarity Impact
}

const DISCOVERY_DATA: DiscoveryResource[] = [
  // Documents
  { id: 'res-1', title: 'Q1 Strategy Narrative', type: 'document', category: 'docs', provider: 'microsoft', context: 'Recently edited by Sarah Chen', url: '#', weight: 5 },
  { id: 'res-2', title: 'Product Roadmap 2026', type: 'spreadsheet', category: 'docs', provider: 'google', context: 'Version 4.2 • Draft', url: '#', weight: 6 },
  { id: 'res-3', title: 'Legal Compliance Vault', type: 'folder', category: 'docs', provider: 'box', context: 'Secure retention enabled', url: '#', weight: 8 },
  // Social
  { id: 'res-4', title: 'Product Feedback Community', type: 'viva-topic', category: 'social', provider: 'microsoft', context: '1.2k members • Active', url: '#', weight: 7 },
  { id: 'res-5', title: '#brand-identity-v2', type: 'slack-thread', category: 'social', provider: 'slack', context: 'Deep thread on color theory', url: '#', weight: 9 },
  { id: 'res-5-b', title: 'Marcus: "I think we should stick to Cyan..."', type: 'slack-thread', category: 'social', provider: 'slack', context: 'Individual Message • Thread #B42', url: '#', weight: 12 },
  { id: 'res-6', title: 'CEO Monthly Blast', type: 'viva-post', category: 'social', provider: 'microsoft', context: 'High engagement', url: '#', weight: 5 },
  // Data
  { id: 'res-7', title: 'Customer Experience Loop', type: 'loop-component', category: 'data', provider: 'microsoft', context: 'Live agenda from Friday Sync', url: '#', weight: 10 },
  { id: 'res-7-b', title: 'Action Item: Fix M365 Auth Lag', type: 'loop-component', category: 'data', provider: 'microsoft', context: 'Individual Loop Component Item', url: '#', weight: 11 },
  { id: 'res-8', title: 'Market Trends 2026', type: 'spreadsheet', category: 'data', provider: 'google', context: 'External reference folder', url: '#', weight: 7 },
  { id: 'res-9', title: 'AWS Cost Analytics', type: 'insight', category: 'data', provider: 'local', context: 'System generated alert', url: '#', weight: 12 },
  // Knowledge
  { id: 'res-10', title: 'Architectural Standards', type: 'site', category: 'knowledge', provider: 'microsoft', context: 'Governance root', url: '#', weight: 8 },
  { id: 'res-11', title: 'Onboarding Wiki', type: 'document', category: 'knowledge', provider: 'google', context: 'Legacy knowledge migration', url: '#', weight: 4 },
];

export const ResourceSynthesizer: React.FC<{ workspaceId: string; isOpen: boolean; onClose: () => void }> = ({ workspaceId, isOpen, onClose }) => {
  const { isDaylight } = useTheme();
  const { pinToWorkspace } = useAethos();
  const [activeCategory, setActiveCategory] = useState<string>('docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<Set<ProviderType>>(new Set(['microsoft', 'slack', 'google', 'box', 'local']));
  const [selectedArtifacts, setSelectedArtifacts] = useState<Set<string>>(new Set());
  const [customNote, setCustomNote] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Functional filtering
  const filteredResults = useMemo(() => {
    return DISCOVERY_DATA.filter(res => {
      const matchesCategory = res.category === activeCategory;
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.context.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvider = selectedProviders.has(res.provider);
      return matchesCategory && matchesSearch && matchesProvider;
    });
  }, [activeCategory, searchQuery, selectedProviders]);

  // Clarity Impact Logic
  const clarityImpact = useMemo(() => {
    let total = 0;
    selectedArtifacts.forEach(id => {
      const item = DISCOVERY_DATA.find(d => d.id === id);
      if (item) total += item.weight;
    });
    // Multiplier for provider diversity
    const uniqueProviders = new Set(
      Array.from(selectedArtifacts).map(id => DISCOVERY_DATA.find(d => d.id === id)?.provider)
    ).size;
    
    if (uniqueProviders > 1) total *= (1 + (uniqueProviders * 0.05));
    
    return Math.round(total);
  }, [selectedArtifacts]);

  const handleSynthesize = () => {
    selectedArtifacts.forEach(id => {
      const artifact = DISCOVERY_DATA.find(a => a.id === id);
      if (artifact) {
        const pinned: PinnedArtifact = {
          id: artifact.id,
          title: artifact.title,
          type: artifact.type as ContainerType,
          provider: artifact.provider as ProviderType,
          url: artifact.url,
          category: 'critical',
          pinnedAt: new Date().toISOString(),
          aethosNote: customNote || `Synthesized via Universal Adapter on ${new Date().toLocaleDateString()}`
        };
        pinToWorkspace(workspaceId, pinned);
      }
    });

    toast.success("Lattice Updated", {
      description: `${selectedArtifacts.size} artifacts synthesized into the workspace.`
    });
    onClose();
    setSelectedArtifacts(new Set());
    setCustomNote('');
  };

  const toggleArtifact = (id: string) => {
    const next = new Set(selectedArtifacts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedArtifacts(next);
  };

  const toggleProvider = (p: ProviderType) => {
    const next = new Set(selectedProviders);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setSelectedProviders(next);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <Motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-xl"
          />
          
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-6xl bg-white dark:bg-[#0B0F19] border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-2xl h-[85vh]"
          >
            {/* Header */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#00F0FF]/5 to-transparent">
               <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-[#00F0FF] text-black">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white">Resource <span className="text-[#00F0FF]">Synthesizer</span></h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic">
                       Functional Discovery: Link Individual Artifacts, Threads, and Loops
                    </p>
                  </div>
               </div>
               <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                  <X className="w-6 h-6" />
               </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
               {/* Categories */}
               <div className="w-64 border-r border-white/5 p-6 flex flex-col gap-2 shrink-0 bg-black/20">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all group ${
                        activeCategory === cat.id 
                          ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF]' 
                          : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{cat.name}</span>
                    </button>
                  ))}
               </div>

               {/* Discovery Area */}
               <div className="flex-1 flex flex-col bg-white/[0.01]">
                  <div className="p-8 border-b border-white/5 flex gap-4 items-center">
                     <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                           placeholder={`SEARCH IN ${CATEGORIES.find(c => c.id === activeCategory)?.name.toUpperCase()}...`}
                           className="pl-12"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                     <div className="relative">
                        <Button variant="secondary" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                           <Filter className="w-4 h-4 mr-2" /> 
                           {selectedProviders.size === 5 ? 'All Providers' : `${selectedProviders.size} Providers`}
                        </Button>
                        <AnimatePresence>
                          {isFilterOpen && (
                            <Motion.div 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full right-0 mt-3 w-56 p-4 rounded-2xl bg-[#1A1F2C] border border-white/10 shadow-2xl z-50 space-y-2"
                            >
                               {['microsoft', 'slack', 'google', 'box', 'local'].map((p) => (
                                 <button 
                                   key={p} 
                                   onClick={() => toggleProvider(p as ProviderType)}
                                   className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                 >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{p}</span>
                                    {selectedProviders.has(p as ProviderType) && <Check className="w-3.5 h-3.5 text-[#00F0FF]" />}
                                 </button>
                               ))}
                            </Motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4">
                     {filteredResults.length > 0 ? filteredResults.map((res) => (
                       <div 
                         key={res.id}
                         onClick={() => toggleArtifact(res.id)}
                         className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                           selectedArtifacts.has(res.id) 
                             ? 'bg-[#00F0FF]/10 border-[#00F0FF]' 
                             : 'bg-white/5 border-white/5 hover:bg-white/10'
                         }`}
                       >
                         <div className="flex items-center gap-5">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                               {res.provider === 'slack' ? <Slack className="w-5 h-5 text-[#A855F7]" /> : 
                                res.provider === 'microsoft' ? <Target className="w-5 h-5 text-[#00F0FF]" /> :
                                <Database className="w-5 h-5 text-slate-400" />}
                            </div>
                            <div>
                               <p className="text-sm font-black text-white uppercase tracking-tight">{res.title}</p>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{res.type}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                                  <span className="text-[9px] font-bold text-slate-400 italic">{res.context}</span>
                               </div>
                            </div>
                         </div>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedArtifacts.has(res.id) ? 'bg-[#00F0FF] border-[#00F0FF]' : 'border-slate-800 dark:border-white/10'}`}>
                            {selectedArtifacts.has(res.id) && <CheckCircle2 className="w-4 h-4 text-black" />}
                         </div>
                       </div>
                     )) : (
                       <div className="py-20 text-center space-y-4">
                          <Search className="w-10 h-10 text-slate-800 mx-auto" />
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No artifacts discovered in this sector</p>
                       </div>
                     )}
                  </div>
               </div>

               {/* Synthesis Config */}
               <div className="w-80 border-l border-white/5 p-8 flex flex-col gap-8 shrink-0 bg-black/20">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operational Logic</h3>
                    <textarea 
                      placeholder="Add an operational note for this context..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium text-slate-300 outline-none focus:ring-2 ring-[#00F0FF]/20 resize-none transition-all"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Resource Summary</h3>
                        <div className="group relative cursor-help">
                           <Info className="w-3.5 h-3.5 text-slate-600" />
                           <div className="absolute bottom-full right-0 mb-2 w-48 p-3 rounded-xl bg-black border border-white/10 text-[9px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed shadow-2xl">
                             Clarity Impact is calculated based on metadata density, context relevance, and cross-provider synthesis bonuses.
                           </div>
                        </div>
                     </div>
                     <div className="p-6 rounded-[32px] bg-gradient-to-br from-white/5 to-transparent border border-white/10 space-y-6">
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selected</span>
                           <span className="text-sm font-black text-white">{selectedArtifacts.size}</span>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Clarity Impact</span>
                              <span className="text-xl font-black text-[#00F0FF]">+{clarityImpact}%</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <Motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(clarityImpact, 100)}%` }}
                                className="h-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <Button 
                        size="lg" 
                        fullWidth 
                        disabled={selectedArtifacts.size === 0}
                        onClick={handleSynthesize}
                        className="shadow-xl shadow-[#00F0FF]/10"
                     >
                        Synthesize Lattice <Zap className="w-4 h-4 ml-2" />
                     </Button>
                     <p className="text-[8px] text-slate-500 text-center uppercase font-black tracking-widest leading-relaxed px-4">
                        Synthesizing anchors increases operational fidelity by reduces shadow discovery noise.
                     </p>
                  </div>
               </div>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
