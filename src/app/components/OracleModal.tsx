import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Command, 
  Cpu, 
  CircleCheck, 
  RefreshCw, 
  Mic, 
  ArrowRight,
  Database,
  Trash2,
  ShieldCheck,
  Globe,
  Slack,
  Box as BoxIcon,
  HardDrive,
  Share2,
  ShieldAlert,
  Fingerprint,
  Calendar,
  Lock,
  ArrowUpRight,
  Info,
  Zap,
  Book,
  X,
  MessageSquare,
  History as HistoryIcon,
  Eraser,
  Pin,
  Check,
  Gavel,
  ExternalLink
} from 'lucide-react';
import { useOracle, OracleSource, OraclePredictiveItem, OracleMessage } from '../context/OracleContext';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { ProviderType, PinnedArtifact } from '../types/aethos.types';
import { VoiceOrb } from './VoiceOrb';
import { toast } from "sonner";

const providerIcons: Record<ProviderType, any> = {
  microsoft: Share2,
  google: Globe,
  slack: Slack,
  box: BoxIcon,
  local: HardDrive
};

const PrivacyPulse = () => {
  const { isDaylight } = useTheme();
  const { tier, isAiOptOut } = useOracle();
  
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
      isAiOptOut ? 'bg-red-500/5 border-red-500/20' : 'bg-[#00F0FF]/5 border-[#00F0FF]/20'
    }`}>
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`absolute inset-0 rounded-full ${isAiOptOut ? 'bg-red-500' : 'bg-[#00F0FF]'}`}
        />
        <div className={`relative w-2 h-2 rounded-full ${isAiOptOut ? 'bg-red-500' : 'bg-[#00F0FF]'}`} />
      </div>
      <div className="flex flex-col">
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isAiOptOut ? 'text-red-500' : 'text-[#00F0FF]'}`}>
          {isAiOptOut ? 'AI AIR-GAP ACTIVE' : `ORACLE ${tier.toUpperCase()} ACTIVE`}
        </span>
        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
          {isAiOptOut ? 'Content reading disabled' : 'End-to-End Encryption Active'}
        </span>
      </div>
    </div>
  );
};

const SourceCard = React.forwardRef<HTMLDivElement, { 
  source: OracleSource, 
  index: number, 
  isHighlighted: boolean,
  onCitationHover: (idx: number | null) => void,
  onClick?: () => void
}>(({ source, index, isHighlighted, onCitationHover, onClick }, ref) => {
  const { isDaylight } = useTheme();
  const Icon = providerIcons[source.provider];
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => onCitationHover(index + 1)}
      onMouseLeave={() => onCitationHover(null)}
      onClick={onClick}
      className={`min-w-[260px] p-5 rounded-2xl border transition-all relative overflow-hidden cursor-pointer ${
        isHighlighted 
          ? (isDaylight ? 'bg-blue-50 border-blue-600 shadow-xl' : 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.2)]')
          : (isDaylight ? 'bg-white border-slate-100 hover:border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 hover:border-white/10')
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
          <Icon className={`w-4 h-4 ${isHighlighted ? (isDaylight ? 'text-blue-600' : 'text-[#00F0FF]') : 'text-slate-500'}`} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Relevance</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(b => (
              <div key={b} className={`w-1 h-3 rounded-full ${b <= (source.relevance || 0) * 5 ? (isDaylight ? 'bg-blue-600' : 'bg-[#00F0FF]') : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
      </div>
      
      <h4 className={`text-xs font-bold truncate mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
        {source.isVaulted && <Lock className="w-3 h-3 inline mr-1 text-red-500" />}
        {source.title}
      </h4>
      <p className="text-[10px] text-slate-500 line-clamp-2 italic leading-relaxed">"{source.snippet}"</p>
      
      <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">[{index + 1}] Citation Source</span>
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            toast.info(`Navigating to source anchor: ${source.title}`);
          }}
          className={`p-1.5 rounded-lg transition-all ${isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
        >
          <ExternalLink className={`w-3.5 h-3.5 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
        </a>
      </div>

      {isHighlighted && !isDaylight && (
        <motion.div layoutId="source-glow" className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
});

SourceCard.displayName = 'SourceCard';

const SourcePeek = ({ source, index, x, y }: { source: OracleSource, index: number, x: number, y: number }) => {
  const { isDaylight } = useTheme();
  const Icon = providerIcons[source.provider];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      style={{ left: x, top: y }}
      className={`fixed z-[1100] w-72 p-6 rounded-2xl border shadow-2xl pointer-events-none ${
        isDaylight ? 'bg-white border-slate-200' : 'bg-[#0B0F19] border-white/10'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
          <Icon className={`w-4 h-4 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Source Artifact [{index}]</span>
          <span className={`text-xs font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{source.title}</span>
        </div>
      </div>
      <div className={`p-4 rounded-xl text-[10px] italic leading-relaxed ${isDaylight ? 'bg-slate-50 text-slate-600' : 'bg-white/5 text-slate-400'}`}>
        "{source.content.substring(0, 160)}..."
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Cleansed via Aethos</span>
        <div className="flex gap-1">
          <div className={`w-1 h-1 rounded-full ${isDaylight ? 'bg-blue-600' : 'bg-[#00F0FF]'}`} />
          <div className={`w-1 h-1 rounded-full ${isDaylight ? 'bg-blue-600' : 'bg-[#00F0FF]'}`} />
          <div className={`w-1 h-1 rounded-full ${isDaylight ? 'bg-blue-600' : 'bg-[#00F0FF]'}`} />
        </div>
      </div>
    </motion.div>
  );
};

const PredictivePulseCard = ({ item }: { item: OraclePredictiveItem }) => {
  const { isDaylight } = useTheme();
  const { search } = useOracle();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={() => search(item.title)}
      className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
        isDaylight ? 'bg-white border-slate-100 hover:border-blue-200' : 'bg-white/5 border-white/5 hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5'
      }`}
    >
      <div className={`p-3 rounded-xl ${isDaylight ? 'bg-blue-50 text-blue-600' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
        <Calendar className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`}>
            {item.reason}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">{item.context}</span>
        </div>
        <h4 className={`text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{item.title}</h4>
        <p className="text-[10px] text-slate-500 mt-1">Suggested context for your next task.</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-600" />
    </motion.div>
  );
};

const ThoughtProcess = () => {
  const { status } = useOracle();
  const { isDaylight } = useTheme();

  const steps = [
    { id: 'federating', label: 'Federating Streams...', detail: 'Scanning Microsoft, Slack, Box anchors' },
    { id: 'reading', label: 'Extracting Artifacts...', detail: 'Analyzing file content & metadata' },
    { id: 'synthesizing', label: 'Building Narrative...', detail: 'Applying Aethos operational logic' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-3">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <RefreshCw className="w-5 h-5 text-blue-500" />
        </motion.div>
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
          Processing Intelligence...
        </span>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => {
          const isActive = i === currentStepIndex;
          const isComplete = i < currentStepIndex;
          return (
            <div key={step.id} className="flex items-start gap-4 opacity-100">
              <div className="relative mt-1">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  isComplete ? 'bg-emerald-500 border-emerald-500' : 
                  isActive ? 'bg-blue-500 border-blue-500 animate-pulse' : 'bg-transparent border-slate-700'
                }`} />
                {i < steps.length - 1 && (
                  <div className={`absolute top-3 left-1.5 w-[2px] h-6 ${isComplete ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                )}
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                  {isComplete && <CircleCheck className="w-3 h-3 inline ml-2 text-emerald-500" />}
                </p>
                {isActive && <p className="text-[8px] text-slate-400 mt-0.5">{step.detail}</p>}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-2 mt-8">
        <div className={`h-4 w-3/4 rounded-full ${isDaylight ? 'bg-slate-100' : 'bg-white/5'} animate-pulse`} />
        <div className={`h-4 w-full rounded-full ${isDaylight ? 'bg-slate-100' : 'bg-white/5'} animate-pulse`} />
        <div className={`h-4 w-2/3 rounded-full ${isDaylight ? 'bg-slate-100' : 'bg-white/5'} animate-pulse`} />
      </div>
    </div>
  );
};

export const OracleModal: React.FC = () => {
  const { 
    isOpen, setIsOpen, query, setQuery, results, search, status, 
    tier, isAiOptOut, predictiveItems, history, clearHistory
  } = useOracle();
  const { state: { workspaces }, pinToWorkspace, addRule } = useAethos();
  const { isDaylight } = useTheme();
  
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);
  const [peekedSource, setPeekedSource] = useState<{ source: OracleSource, index: number, x: number, y: number } | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query) {
      search(query);
      setQuery('');
    }
  };

  const handleCitationClick = (num: number, messageId: string) => {
    const key = `${messageId}-${num}`;
    const el = sourceRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setHighlightedCitation(num);
      setTimeout(() => setHighlightedCitation(null), 2000);
    }
  };

  const handleCitationMouseEnter = (e: React.MouseEvent, num: number, sources: OracleSource[]) => {
    const source = sources[num - 1];
    if (!source) return;
    
    setHighlightedCitation(num);
    setPeekedSource({
      source,
      index: num,
      x: e.clientX - 144, // Center the 72px width peek
      y: e.clientY + 20
    });
  };

  const handlePinInsight = (msg: OracleMessage) => {
    if (!workspaces.length) {
      toast.error("No active workspace found to pin this insight.");
      return;
    }

    const artifact: PinnedArtifact = {
      id: msg.id,
      type: 'insight',
      title: `Insight: ${msg.intent || 'Oracle Synthesis'}`,
      provider: 'local',
      url: '#',
      aethosNote: msg.content.substring(0, 100) + '...',
      category: 'reference',
      pinnedAt: new Date().toISOString()
    };

    pinToWorkspace(workspaces[0].id, artifact);
    setPinnedIds(prev => new Set([...prev, msg.id]));
    toast.success("Insight pinned to active workspace");
  };

  const handleCreateRule = (msg: OracleMessage) => {
    const isBudget = msg.content.toLowerCase().includes('budget') || msg.content.toLowerCase().includes('roi');
    const isSecurity = msg.content.toLowerCase().includes('external') || msg.content.toLowerCase().includes('collaborator');

    addRule({
      name: isBudget ? 'Budget Anomaly Guard' : isSecurity ? 'External Access Audit' : 'Oracle Generated Policy',
      description: `Drafted via Oracle Synthesis: ${msg.intent || 'Operational Policy'}. Automate remediation based on identified patterns.`,
      provider: 'universal',
      action: isBudget ? 'notify' : 'archive',
      threshold: 30,
    });
    
    toast.success("Governance rule drafted in Reporting Center", {
      icon: <Gavel className="w-4 h-4 text-[#00F0FF]" />,
    });
  };

  const renderTextWithCitations = (text: string, messageId: string, sources: OracleSource[] = []) => {
    const parts = text.split(/(\[\d+\])/);
    return (
      <div className={`text-lg leading-relaxed font-['Space_Grotesk'] font-medium ${isDaylight ? 'text-slate-700' : 'text-slate-200'}`}>
        {parts.map((part, i) => {
          const match = part.match(/\[(\d+)\]/);
          if (match) {
            const num = parseInt(match[1]);
            return (
              <span 
                key={i}
                onMouseEnter={(e) => handleCitationMouseEnter(e, num, sources)}
                onMouseLeave={() => { setHighlightedCitation(null); setPeekedSource(null); }}
                onClick={() => handleCitationClick(num, messageId)}
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black ml-1 cursor-pointer transition-all ${
                  highlightedCitation === num 
                    ? (isDaylight ? 'bg-slate-900 text-white scale-110 shadow-lg' : 'bg-[#00F0FF] text-black scale-110 shadow-[0_0_10px_#00F0FF]')
                    : (isDaylight ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-slate-400')
                }`}
              >
                {num}
              </span>
            );
          }
          if (part.includes('**')) {
             return part.split('**').map((sub, j) => j % 2 === 1 ? <span key={j} className={isDaylight ? 'text-slate-900 font-black' : 'text-[#00F0FF] font-black'}>{sub}</span> : sub);
          }
          return part;
        })}
      </div>
    );
  };

  const isLanternMode = tier === 'basic' || isAiOptOut;

  return (
    <>
      <AnimatePresence>
        {isOpen && !isVoiceMode && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] px-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className={`relative w-full max-w-4xl rounded-[32px] border shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden transition-all flex flex-col max-h-[85vh] ${
                isDaylight ? 'bg-white/95 border-slate-200' : 'bg-[#0B0F19]/90 border-white/10 backdrop-blur-3xl'
              }`}
            >
              <div className={`px-8 py-4 flex items-center justify-between border-b shrink-0 ${isDaylight ? 'bg-slate-50/50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-1.5 rounded-lg ${isDaylight ? 'bg-slate-100' : 'bg-white/5'}`}>
                    <Command className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Oracle Intelligence Stream</span>
                </div>
                <div className="flex items-center gap-4">
                  <PrivacyPulse />
                  <button 
                    onClick={clearHistory}
                    title="Clear Stream"
                    className={`p-2 rounded-full transition-all ${isDaylight ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-slate-500'}`}
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-full transition-all ${isDaylight ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-slate-500'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12"
              >
                <AnimatePresence mode="popLayout">
                  {history.length === 0 && !results && status === 'idle' && (
                    <motion.div key="predictive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className={`w-4 h-4 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Predicted Intent</h3>
                        </div>
                        <span className="text-[9px] font-bold text-slate-600">Contextual Analysis Active</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictiveItems.map(item => <PredictivePulseCard key={item.id} item={item} />)}
                      </div>
                      <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                          <HistoryIcon className="w-3.5 h-3.5" /> Recent Architectural Focus
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['Run Audit', 'View Slack Threads', 'Storage ROI', 'Security Policy', 'Hardware Procurement'].map(s => (
                            <button key={s} onClick={() => search(s)} className={`px-4 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${isDaylight ? 'bg-slate-50 border-slate-100 hover:bg-slate-900 hover:text-white' : 'bg-white/5 border-white/5 hover:border-[#00F0FF]/40 text-slate-400 hover:text-[#00F0FF]'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {history.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.role === 'user' ? (
                        <div className={`max-w-[80%] p-4 rounded-2xl rounded-tr-none ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.2)]'}`}>
                          <p className="text-sm font-bold font-['Space_Grotesk']">{msg.content}</p>
                        </div>
                      ) : (
                        <div className="space-y-6 w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 opacity-40">
                              <Sparkles className={`w-3.5 h-3.5 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{msg.intent || 'Oracle Synthesis'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {(msg.intent?.includes('ROI') || msg.intent?.includes('Security') || msg.intent?.includes('Financial')) && (
                                <button 
                                  onClick={() => handleCreateRule(msg)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                                    isDaylight ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white' : 'bg-[#FF5733]/10 border-[#FF5733]/40 text-[#FF5733] hover:bg-[#FF5733] hover:text-white'
                                  }`}
                                >
                                  <Gavel className="w-3 h-3" />
                                  Draft Rule
                                </button>
                              )}
                              <button 
                                onClick={() => handlePinInsight(msg)}
                                disabled={pinnedIds.has(msg.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                                  pinnedIds.has(msg.id)
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'
                                  : isDaylight ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white' : 'bg-[#00F0FF]/10 border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black'
                                }`}
                              >
                                {pinnedIds.has(msg.id) ? <Check className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                                {pinnedIds.has(msg.id) ? 'Insight Pinned' : 'Pin Insight'}
                              </button>
                            </div>
                          </div>
                          <div className={`p-6 rounded-3xl border ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5 shadow-inner'}`}>
                            {renderTextWithCitations(msg.content, msg.id, msg.sources)}
                          </div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 opacity-40">
                                <Database className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Supporting Artifacts</span>
                              </div>
                              <div className="flex gap-4 pb-2 overflow-x-auto custom-scrollbar">
                                {msg.sources.map((source, i) => (
                                  <SourceCard 
                                    key={source.id} 
                                    ref={(el) => { sourceRefs.current[`${msg.id}-${i + 1}`] = el; }}
                                    source={source} 
                                    index={i} 
                                    isHighlighted={highlightedCitation === (i + 1)} 
                                    onCitationHover={setHighlightedCitation}
                                    onClick={() => handleCitationClick(i + 1, msg.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {(status === 'federating' || status === 'reading' || status === 'synthesizing') && (
                    <motion.div key="processing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <ThoughtProcess />
                    </motion.div>
                  )}

                  {results && results.isStreaming && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <div className="flex items-center gap-2 opacity-40">
                        <Sparkles className={`w-3.5 h-3.5 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{results.intent || 'Synthesizing...'}</span>
                      </div>
                      <div className={`p-6 rounded-3xl border ${isDaylight ? 'bg-slate-50/50 border-slate-100' : 'bg-white/[0.03] border-white/10'}`}>
                        {renderTextWithCitations(results.answer, 'streaming', results.sources)}
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className={`inline-block w-1.5 h-5 ml-1 align-middle ${isDaylight ? 'bg-slate-900' : 'bg-[#00F0FF]'}`} />
                      </div>
                    </motion.div>
                  )}

                  {results && !results.isStreaming && status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pt-4">
                      {results.followUps.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 opacity-40">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Suggested Trajectories</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {results.followUps.map((q, i) => (
                              <button key={i} onClick={() => search(q)} className={`px-5 py-2.5 rounded-full border text-[10px] font-bold transition-all ${isDaylight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-[#00F0FF]/20 hover:text-[#00F0FF] hover:border-[#00F0FF]/40'}`}>
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {results.actions.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {results.actions.map((action) => (
                            <button key={action.id} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDaylight ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black'}`}>
                              <Zap className="w-4 h-4" />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`p-8 border-t shrink-0 ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19]/90 border-white/5'}`}>
                <div className="flex items-center gap-6 relative">
                  <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-slate-500'}`}>
                    <Search className="w-7 h-7" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={isLanternMode ? "Search filenames and tags..." : "Ask the Oracle to synthesize knowledge..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 bg-transparent border-none outline-none text-2xl font-bold font-['Space_Grotesk'] placeholder:text-slate-400/50 ${isDaylight ? 'text-slate-900' : 'text-white'}`}
                  />
                  <div className="flex items-center gap-3">
                    {!isLanternMode && (
                      <button onClick={() => setIsVoiceMode(true)} className={`p-4 rounded-2xl border transition-all ${isDaylight ? 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-slate-500 hover:text-[#00F0FF] shadow-inner'}`}>
                        <Mic className="w-6 h-6" />
                      </button>
                    )}
                    <button onClick={() => { search(query); setQuery(''); }} disabled={!query.trim() || status !== 'idle'} className={`p-4 rounded-2xl transition-all ${!query.trim() || status !== 'idle' ? 'opacity-20 grayscale cursor-not-allowed' : isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'}`}>
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <kbd className={`px-1.5 py-1 rounded text-[9px] font-black border ${isDaylight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>ENTER</kbd>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Execute Intent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className={`px-1.5 py-1 rounded text-[9px] font-black border ${isDaylight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>ESC</kbd>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Exit Vault</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDaylight ? 'bg-slate-100 border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                    <Database className="w-3 h-3 text-slate-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isLanternMode ? 'Metadata Mode' : 'Synthetic Intelligence Active'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>{isVoiceMode && <VoiceOrb onClose={() => setIsVoiceMode(false)} />}</AnimatePresence>
      <AnimatePresence>
        {peekedSource && <SourcePeek key="peek" {...peekedSource} />}
      </AnimatePresence>
    </>
  );
};
