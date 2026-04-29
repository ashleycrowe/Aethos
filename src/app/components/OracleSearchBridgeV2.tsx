/**
 * Oracle Search Bridge V2 - Redesigned
 * 
 * VERSION: V1 (Basic Metadata Search), V1.5+ (AI Content Search)
 * FEATURE FLAGS:
 * - V1: basicSearch (metadata-only)
 * - V1.5: aiContentSearch, semanticSearch, conversationalOracle
 * 
 * DESIGN PHILOSOPHY:
 * - Full-width chat interface for proper conversational UX
 * - Universal commands integrated into command palette (Cmd+K)
 * - Metadata search becomes a filter panel, not a separate tab
 * - Chat can trigger metadata search behind the scenes
 * - V1.5+ adds AI content search toggle
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Search, 
  Sparkles, 
  History, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Layers, 
  ArrowRight,
  Target,
  FileText,
  BarChart3,
  Trash2,
  Lock,
  ExternalLink,
  RotateCcw,
  Send,
  CornerDownRight,
  Command,
  Filter,
  SlidersHorizontal,
  X,
  Tag,
  Database,
  ChevronDown,
  Settings,
  Info
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useOracle } from '../context/OracleContext';
import { useFeature, useVersion } from '../context/VersionContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

export const OracleSearchBridgeV2 = () => {
  const { isDaylight } = useTheme();
  const { version } = useVersion();
  const hasAISearch = useFeature('aiContentSearch');
  const hasSemanticSearch = useFeature('semanticSearch');
  const { 
    query, 
    setQuery, 
    search, 
    results, 
    status, 
    federationStatus, 
    history, 
    clearHistory,
    predictiveItems 
  } = useOracle();
  
  const [localQuery, setLocalQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [aiSearchMode, setAISearchMode] = useState(false); // V1.5+ feature
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, results?.answer]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    search(localQuery);
    setLocalQuery('');
  };

  const executeCommand = (cmd: string) => {
    setLocalQuery(cmd);
    search(cmd);
    setShowQuickActions(false);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'excel':
      case 'spreadsheet': return <BarChart3 className="w-4 h-4 text-emerald-500" />;
      case 'word':
      case 'pdf': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'thread':
      case 'channel': return <Sparkles className="w-4 h-4 text-[#A855F7]" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const quickActions = [
    { id: 'q-1', label: 'Show budget leakage in Project Alpha', icon: BarChart3 },
    { id: 'q-2', label: 'Analyze Storage ROI for January', icon: Database },
    { id: 'q-3', label: 'Audit external user exposure', icon: ShieldCheck },
    { id: 'q-4', label: 'Find my onboarding buddy', icon: Target },
  ];

  const universalCommands = [
    { id: 'c-1', label: '/audit-waste', icon: Trash2, desc: 'Scan for dead capital across all providers' },
    { id: 'c-2', label: '/simulate-rem', icon: Zap, desc: 'Run remediation simulation chains' },
    { id: 'c-3', label: '/identity-scan', icon: ShieldCheck, desc: 'Map identity velocity & drift' },
    { id: 'c-4', label: '/clearance-up', icon: Lock, desc: 'Request architect tier elevation' },
  ];

  return (
    <div className="flex flex-col h-full max-w-[1800px] mx-auto px-4">
      {/* Compact Header */}
      <div className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-2xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Oracle <span className="text-[#00F0FF]">Search</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-0.5">
                Intelligence Engine v4.2
              </p>
            </div>
          </div>

          {/* Right: Status + Filter Button */}
          <div className="flex items-center gap-3">
            {/* Federation Status Badges */}
            {Object.entries(federationStatus).map(([provider, state]) => (
              state !== 'none' && (
                <div key={provider} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                  state === 'complete' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 animate-pulse'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${state === 'complete' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-yellow-500 shadow-[0_0_8px_#f59e0b]'}`} />
                  {provider}
                </div>
              )
            ))}

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-all ${
                showFilters 
                  ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]'
                  : isDaylight
                    ? 'border-slate-200 text-slate-600 hover:border-slate-300'
                    : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
              }`}
              title="Advanced Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Width Chat */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Primary Conversation Interface */}
        <div className={`flex flex-col min-h-0 transition-all ${showFilters ? 'flex-[2]' : 'flex-1'}`}>
          <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden bg-[#0B0F19]/60 border-white/10 relative">
            {/* Scrollable Conversation Feed */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth"
            >
              {history.length === 0 && !results && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00F0FF]/20 blur-[60px] rounded-full animate-pulse" />
                    <Sparkles className="w-16 h-16 text-[#00F0FF] relative z-10" />
                  </div>
                  <div className="max-w-xl space-y-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Ready for Synthesis</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      I am federated across your Microsoft 365, Slack, Box, and Local anchors. Ask me to audit waste, track budgets, analyze identity risks, or discover content patterns. Use <span className="text-[#00F0FF] font-black">/commands</span> for advanced workflows.
                    </p>
                  </div>
                  
                  {/* Quick Action Grid */}
                  <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                    {quickActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => executeCommand(action.label)}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 text-left group hover:bg-[#00F0FF]/5 hover:border-[#00F0FF]/30 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <action.icon className="w-5 h-5 text-[#00F0FF]" />
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#00F0FF] transition-colors ml-auto" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-300 group-hover:text-white transition-colors leading-snug">
                          {action.label}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Universal Commands Preview */}
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all"
                  >
                    <Command className="w-3.5 h-3.5" />
                    Universal Commands
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showQuickActions && (
                      <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-3 w-full max-w-2xl overflow-hidden"
                      >
                        {universalCommands.map(cmd => (
                          <button 
                            key={cmd.id}
                            onClick={() => executeCommand(cmd.label)}
                            className="p-4 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-left group hover:bg-[#00F0FF]/10 transition-all"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <cmd.icon className="w-4 h-4 text-[#00F0FF]" />
                              <span className="text-[10px] font-black text-white uppercase tracking-tight">{cmd.label}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 uppercase tracking-wide">{cmd.desc}</p>
                          </button>
                        ))}
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Message History */}
              <AnimatePresence mode="popLayout">
                {history.map((msg, i) => (
                  <Motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-6 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border transition-all ${
                      msg.role === 'assistant' 
                        ? 'bg-[#00F0FF]/10 border-[#00F0FF]/20 text-[#00F0FF]' 
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                      {msg.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </div>
                    
                    <div className={`flex-1 space-y-4 ${msg.role === 'assistant' ? '' : 'text-right'}`}>
                      <div className={`inline-block p-6 rounded-3xl text-sm leading-relaxed max-w-[85%] ${
                        msg.role === 'assistant' 
                          ? 'bg-white/5 border border-white/10 text-slate-200' 
                          : 'bg-[#00F0FF] text-black font-bold shadow-xl shadow-[#00F0FF]/10'
                      }`}>
                        {msg.content}
                      </div>

                      {msg.role === 'assistant' && msg.intent && (
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/10 w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                          <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Intent: {msg.intent}</span>
                        </div>
                      )}

                      {/* Source Chips */}
                      {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((source, idx) => (
                            <div key={source.id} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-help group/source relative">
                              {getSourceIcon(source.type)}
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[200px]">{source.title}</span>
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">[{idx + 1}]</span>
                              
                              {/* Source Popover */}
                              <div className="absolute bottom-full left-0 mb-4 w-80 p-6 rounded-[24px] bg-[#0B0F19] border border-[#00F0FF]/30 opacity-0 pointer-events-none group-hover/source:opacity-100 transition-all z-50 shadow-2xl backdrop-blur-3xl">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-3 h-3 text-[#00F0FF]" />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{source.provider} Anchor</span>
                                  </div>
                                  <span className="text-[8px] font-black text-[#00F0FF] uppercase tracking-widest">{Math.round(source.relevance * 100)}% Match</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed mb-6 italic">"{source.snippet}"</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                  <button className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest flex items-center gap-2 hover:underline">
                                    Open Artifact <ExternalLink className="w-3 h-3" />
                                  </button>
                                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{source.type}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggested Actions */}
                      {msg.role === 'assistant' && msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {msg.actions.map(action => (
                            <button 
                              key={action.id}
                              onClick={() => toast.success(`Action Executed: ${action.label}`)}
                              className="px-6 py-3 rounded-2xl bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 hover:scale-105 transition-all shadow-xl shadow-[#00F0FF]/10"
                            >
                              {action.label} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Motion.div>
                ))}

                {/* Live Streaming Result */}
                {results && results.isStreaming && (
                  <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] flex items-center justify-center animate-pulse">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-slate-200 text-sm leading-relaxed max-w-[85%]">
                        {results.answer}
                        <span className="inline-block w-1.5 h-4 bg-[#00F0FF] ml-1 animate-pulse" />
                      </div>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Terminal Area */}
            <div className="p-8 border-t border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl">
              {/* V1.5+ FEATURE: AI Search Mode Toggle */}
              {hasAISearch && (
                <div className="mb-6 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#00F0FF]/10 to-purple-500/10 border border-[#00F0FF]/20">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#00F0FF]" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight text-white">
                        AI+ Content Search
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                        {aiSearchMode ? 'Semantic search enabled' : 'Metadata search only'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setAISearchMode(!aiSearchMode);
                      toast.success(
                        aiSearchMode ? 'Switched to Metadata Search' : 'AI+ Enabled: Searching document contents',
                        { duration: 2000 }
                      );
                    }}
                    className={`relative w-14 h-7 rounded-full transition-all ${
                      aiSearchMode 
                        ? 'bg-[#00F0FF]' 
                        : 'bg-white/10'
                    }`}
                  >
                    <Motion.div
                      animate={{ x: aiSearchMode ? 28 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full ${
                        aiSearchMode ? 'bg-black' : 'bg-white/50'
                      }`}
                    />
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSearch} className="relative group">
                <div className={`absolute -inset-1 rounded-3xl blur transition-all duration-500 opacity-0 group-focus-within:opacity-30 ${status === 'idle' ? 'bg-[#00F0FF]' : 'bg-yellow-500'}`} />
                <div className="relative flex items-center gap-4 bg-[#0B0F19] border border-white/10 rounded-2xl p-2 pl-6 focus-within:border-[#00F0FF]/50 transition-all">
                  <Command className={`w-5 h-5 ${status === 'idle' ? 'text-slate-500' : 'text-[#00F0FF] animate-spin'}`} />
                  <input 
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder={status === 'idle' ? "Ask a question or use /command..." : `Synthesizing Intelligence...`}
                    className="flex-1 bg-transparent border-none outline-none text-white text-base py-4 placeholder-slate-600"
                    disabled={status !== 'idle'}
                  />
                  <button 
                    type="submit"
                    disabled={status !== 'idle' || !localQuery.trim()}
                    className="p-3.5 rounded-xl bg-[#00F0FF] text-black hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:grayscale"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={clearHistory}
                    className="text-[9px] font-black text-slate-500 hover:text-[#FF5733] uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear History
                  </button>
                  <div className="w-px h-3 bg-white/5" />
                  <div className="flex items-center gap-3">
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Federated Anchors: 4 Active</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lattice Security</span>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters Panel (Collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <Motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="w-[360px] space-y-6 h-full overflow-y-auto custom-scrollbar pr-2">
                <GlassCard className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Advanced Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Provider Filter */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Providers</label>
                    <div className="flex flex-wrap gap-2">
                      {['Microsoft', 'Slack', 'Box', 'Local'].map(provider => (
                        <button
                          key={provider}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all"
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date Modified</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-[#00F0FF]/50 transition-all">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>This year</option>
                    </select>
                  </div>

                  {/* Intelligence Score */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Intelligence Score</label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">0</span>
                      <div className="flex-1 h-1 bg-white/5 rounded-full">
                        <div className="h-full bg-[#00F0FF] rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-xs text-slate-500">100</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {['Budget', 'Q1-2026', 'Marketing', 'Security'].map(tag => (
                        <div
                          key={tag}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[9px] font-black uppercase tracking-wider text-[#00F0FF]"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                    Apply Filters
                  </button>
                </GlassCard>

                {/* Predictive Intelligence */}
                <GlassCard className="p-6 space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center justify-between">
                    Predictive Anchors
                    <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                  </h3>
                  <div className="space-y-4">
                    {predictiveItems.slice(0, 3).map(item => (
                      <div key={item.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all space-y-3 group cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                              {item.type === 'word' ? <FileText className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-white uppercase tracking-tight">{item.title}</p>
                              <p className="text-[8px] font-black text-[#00F0FF] uppercase tracking-widest mt-1">{item.reason}</p>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#00F0FF] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};