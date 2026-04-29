import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Database, 
  Activity, 
  Repeat, 
  Calendar, 
  MessageSquare, 
  Slack, 
  Globe, 
  Target, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  ExternalLink, 
  Users, 
  ArrowUpRight,
  Plus,
  Filter,
  Cpu,
  TrendingDown,
  Clock,
  Layout,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';
import { ProviderType, ContainerType } from '../types/aethos.types';
import { useAethos } from '../context/AethosContext';
import { toast } from 'sonner';

interface LatticeNode {
  id: string;
  name: string;
  type: ContainerType;
  provider: ProviderType;
  status: string;
  logic: string;
  lastUpdated: string;
  relevance: number; // 0-100
  connections: string[]; // IDs of related nodes
}

const nodeTypeIcons: Record<string, any> = {
  'site': Globe,
  'channel': Slack,
  'loop-component': Repeat,
  'stream-recording': Activity,
  'outlook-meeting': Calendar,
  'viva-topic': MessageSquare,
  'slack-canvas': Layout,
  'document': Database,
  'spreadsheet': BarChart3
};

const providerColors: Record<ProviderType, string> = {
  microsoft: '#00F0FF',
  slack: '#A855F7',
  google: '#34A853',
  box: '#0061D5',
  local: '#64748B'
};

export const LatticeDeconstruction: React.FC<{ isOpen: boolean; onClose: () => void; targetId?: string; label?: string }> = ({ isOpen, onClose, targetId, label }) => {
  const { isDaylight } = useTheme();
  const { state: { workspaces } } = useAethos();
  const [activeView, setActiveView] = useState<'lattice' | 'anchors' | 'telemetry'>('lattice');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const mockNodes: LatticeNode[] = [
    { id: 'n1', name: 'Alpha Strategy Sync', type: 'outlook-meeting', provider: 'microsoft', status: 'Live Recurring', logic: 'Temporal project anchor for all recurring strategy events.', lastUpdated: '15m ago', relevance: 98, connections: ['n2', 'n3'] },
    { id: 'n2', name: 'Agenda & Action Items', type: 'loop-component', provider: 'microsoft', status: 'Synchronized', logic: 'Live collaborative notes linked to Strategy Sync meeting.', lastUpdated: '5m ago', relevance: 95, connections: ['n1', 'n4'] },
    { id: 'n3', name: '#alpha-ops-deployment', type: 'channel', provider: 'slack', status: 'High Velocity', logic: 'Synchronized communications channel for daily execution pulses.', lastUpdated: '10m ago', relevance: 88, connections: ['n1', 'n5'] },
    { id: 'n4', name: 'Q1 Deployment Roadmap', type: 'spreadsheet', provider: 'microsoft', status: 'Pinned', logic: 'Primary tracking document for budget and resource allocation.', lastUpdated: '1h ago', relevance: 92, connections: ['n2', 'n6'] },
    { id: 'n5', name: 'Strategy Session Recording', type: 'stream-recording', provider: 'microsoft', status: 'Indexed', logic: 'Auto-transcribed recording from the last Strategy Sync.', lastUpdated: '2h ago', relevance: 80, connections: ['n3'] },
    { id: 'n6', name: 'Brand Architecture Topic', type: 'viva-topic', provider: 'microsoft', status: 'Federated', logic: 'Synthesized knowledge node extracting company-wide brand wisdom.', lastUpdated: '1d ago', relevance: 75, connections: ['n4'] },
  ];

  const handleOpenSource = (name: string) => {
    toast.success(`Accessing source artifact: ${name}`, {
      description: "Redirecting to native provider console..."
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex justify-center items-center p-6 lg:p-10">
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B0F19]/95 backdrop-blur-2xl"
          />
          
          <Motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-7xl h-full bg-white dark:bg-[#0B0F19] border border-white/10 rounded-[48px] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between shrink-0 bg-gradient-to-r from-white/5 to-transparent">
               <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-[#00F0FF] text-[#0B0F19] shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white">
                      Deconstructed <span className="text-[#00F0FF]">Lattice</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                       Lattice ID: AE-DECON-ALPHA • Context: <span className="text-white">{label || 'Universal Forensic Synthesis'}</span>
                    </p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                 <div className={`flex items-center p-1.5 rounded-2xl border ${isDaylight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    {[
                      { id: 'lattice', label: 'Relational', icon: Target },
                      { id: 'anchors', label: 'Anchors', icon: ShieldCheck },
                      { id: 'telemetry', label: 'Telemetry', icon: Activity },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveView(tab.id as any)}
                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                          activeView === tab.id 
                            ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xl' 
                            : 'text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                 </div>
                 <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-all text-slate-500 hover:text-white">
                    <X className="w-6 h-6" />
                 </button>
               </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
               {/* Left Sidebar: Logic Map */}
               <div className="w-96 border-r border-white/5 flex flex-col shrink-0 bg-black/20">
                  <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6">Operational Intelligence</h3>
                     <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/10 space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Synthesis Score</span>
                              <span className="text-lg font-black text-white">94%</span>
                           </div>
                           <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                              <Motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-[#00F0FF]" />
                           </div>
                           <p className="text-[9px] text-slate-500 leading-relaxed italic">
                             "This cluster demonstrates high architectural integrity with deep temporal anchoring via Outlook."
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                     <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 px-2">Discovered Nodes</h3>
                     {mockNodes.map((node) => {
                       const NodeIcon = nodeTypeIcons[node.type] || Zap;
                       const isSelected = selectedNode === node.id;
                       return (
                         <div 
                           key={node.id}
                           onClick={() => setSelectedNode(node.id)}
                           className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                             isSelected 
                               ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-lg shadow-[#00F0FF]/5' 
                               : 'bg-white/5 border-white/5 hover:bg-white/10'
                           }`}
                         >
                            <div className="flex items-center gap-4">
                               <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                                  <NodeIcon className="w-4 h-4 text-slate-400 group-hover:text-[#00F0FF]" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-white uppercase tracking-tight truncate">{node.name}</p>
                                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{node.provider} • {node.type}</p>
                               </div>
                               {isSelected && <ArrowUpRight className="w-3.5 h-3.5 text-[#00F0FF]" />}
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>

               {/* Central Display: Deep Deconstruction */}
               <div className="flex-1 flex flex-col bg-white/[0.01] overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                     <div className="flex items-center gap-4">
                        <Search className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Universal Lattice Explorer</span>
                     </div>
                     <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                           <Filter className="w-3.5 h-3.5" /> Filter Signals
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 text-[9px] font-black uppercase tracking-widest text-[#FF5733] hover:bg-[#FF5733]/20 transition-all">
                           <TrendingDown className="w-3.5 h-3.5" /> Purge Dead Capital
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <AnimatePresence mode="wait">
                      {selectedNode ? (
                        <Motion.div 
                          key={selectedNode}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-12"
                        >
                           {/* Hero Section */}
                           <div className="flex items-start justify-between">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4">
                                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">
                                       {mockNodes.find(n => n.id === selectedNode)?.provider} Anchor
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                       <ShieldCheck className="w-3 h-3" /> Synchronized
                                    </div>
                                 </div>
                                 <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                    {mockNodes.find(n => n.id === selectedNode)?.name}
                                 </h3>
                                 <p className="text-lg font-medium text-slate-500 max-w-2xl leading-relaxed">
                                    {mockNodes.find(n => n.id === selectedNode)?.logic}
                                 </p>
                              </div>
                              <div className="flex flex-col items-end gap-4">
                                 <button 
                                   onClick={() => handleOpenSource(mockNodes.find(n => n.id === selectedNode)?.name || '')}
                                   className="px-8 py-4 rounded-2xl bg-[#00F0FF] text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#00F0FF]/10 flex items-center gap-3 hover:scale-105 transition-all"
                                 >
                                   Open Native Source <ExternalLink className="w-4 h-4" />
                                 </button>
                                 <div className="flex gap-4">
                                    <div className="text-right">
                                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Node Mass</p>
                                       <p className="text-xl font-black text-white">4.2 GB</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/10" />
                                    <div className="text-right">
                                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Latency</p>
                                       <p className="text-xl font-black text-white">12 MS</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Relational Mapping */}
                           <div className="space-y-8 pt-10 border-t border-white/5">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                                 <Repeat className="w-4 h-4" /> Lattice Relational Vectors
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {mockNodes.filter(n => mockNodes.find(sn => sn.id === selectedNode)?.connections.includes(n.id)).map(conn => {
                                    const ConnIcon = nodeTypeIcons[conn.type] || Zap;
                                    return (
                                       <div key={conn.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#00F0FF]/40 transition-all group">
                                          <div className="flex items-center gap-4 mb-4">
                                             <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:text-[#00F0FF] transition-colors">
                                                <ConnIcon className="w-5 h-5" />
                                             </div>
                                             <div>
                                                <p className="text-[11px] font-black text-white uppercase tracking-tight">{conn.name}</p>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{conn.type}</p>
                                             </div>
                                          </div>
                                          <p className="text-[10px] text-slate-500 leading-relaxed mb-6 line-clamp-2">
                                             {conn.logic}
                                          </p>
                                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                             <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Linked Sync</span>
                                             <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
                                          </div>
                                       </div>
                                    );
                                 })}
                                 <div className="p-6 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/[0.02]">
                                    <Plus className="w-8 h-8 text-slate-700 mb-4 group-hover:text-[#00F0FF] transition-colors" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add Manual Node Anchor</p>
                                 </div>
                              </div>
                           </div>

                           {/* Temporal Activity */}
                           <div className="space-y-8 pt-10 border-t border-white/5">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                                 <Clock className="w-4 h-4" /> Synchronization Telemetry
                              </h4>
                              <div className="space-y-3">
                                 {[
                                   { time: '5m ago', user: 'Sarah Chen', event: 'Loop component sync complete', status: 'SUCCESS' },
                                   { time: '12m ago', user: 'System Agent', event: 'Lattice relay optimized via Universal Adapter', status: 'SUCCESS' },
                                   { time: '45m ago', user: 'Marcus Thorne', event: 'Identity reconciliation: 3 conflicting Slack UID resolved', status: 'SUCCESS' },
                                   { time: '2h ago', user: 'Elena Rodriguez', event: 'External exposure audit: 12 Google Drive nodes soft-gated', status: 'SANITY' },
                                 ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                       <div className="flex items-center gap-6">
                                          <span className="text-[10px] font-black text-slate-500 w-16">{log.time}</span>
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-slate-400" />
                                             </div>
                                             <div>
                                                <p className="text-[11px] font-black text-white uppercase tracking-tight">{log.user}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{log.event}</p>
                                             </div>
                                          </div>
                                       </div>
                                       <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}`}>
                                          {log.status}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </Motion.div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                           <div className="relative">
                              <div className="absolute inset-0 bg-[#00F0FF]/20 blur-[60px] rounded-full animate-pulse" />
                              <div className="w-32 h-32 rounded-3xl bg-white/5 border border-[#00F0FF]/30 flex items-center justify-center relative z-10">
                                 <Database className="w-12 h-12 text-[#00F0FF]" />
                              </div>
                           </div>
                           <div className="space-y-4 max-w-md">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Select a Lattice Node</h3>
                              <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                                 "Choose a discovered node from the logic map to deconstruct its relational vectors, temporal anchors, and synchronization telemetry."
                              </p>
                           </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
            </div>

            {/* Footer Status */}
            <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active Syncing</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#FF5733]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dead Capital Detected</span>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Universal Forensic Engine v4.2.0 • Operational Clarity Established
               </div>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
