import React, { useState } from 'react';
import { 
  Target, 
  Globe, 
  MessageSquare, 
  ListTodo, 
  TrendingUp, 
  Layers, 
  Cpu, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  DollarSign,
  ArrowRight,
  Shield,
  PieChart as PieIcon,
  Search,
  Users,
  Anchor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

export const PrototypeLab = () => {
  const { isDaylight } = useTheme();
  const [activeView, setActiveView] = useState<'market' | 'narrative' | 'pitch' | 'pricing' | 'tasks'>('market');

  const tabs = [
    { id: 'market', label: 'Strategic Thesis', icon: Globe },
    { id: 'narrative', label: 'Core Identity', icon: Anchor },
    { id: 'pitch', label: 'Investor Deck', icon: Sparkles },
    { id: 'pricing', label: 'ROI & Tiers', icon: DollarSign },
    { id: 'tasks', label: 'Builder Logs', icon: ListTodo },
  ];

  const taskList = [
    { id: 1, task: 'Metadata Intelligence Dashboard (Oracle Search v1)', status: 'Complete', priority: 'Critical' },
    { id: 2, task: 'Tag-Based Workspace Auto-Sync Engine', status: 'Complete', priority: 'Critical' },
    { id: 3, task: 'WorkspaceCreationWizard with Sync Rules', status: 'Complete', priority: 'High' },
    { id: 4, task: 'Trial Mode Restrictions (1 Workspace Limit)', status: 'Complete', priority: 'High' },
    { id: 5, task: 'Permission Lab with $499/$698 Pricing', status: 'Complete', priority: 'High' },
    { id: 6, task: 'Universal Adapter Pattern (Tier 1: M365/Slack)', status: 'Complete', priority: 'Medium' },
    { id: 7, task: 'Documentation Migration to /docs/3-standards/', status: 'In-Progress', priority: 'High' },
    { id: 8, task: '"Manage Sync Rules" Button (Workspace Detail)', status: 'Pending', priority: 'Medium' },
  ];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Prototype Lab Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
               <Cpu className="w-6 h-6" />
             </div>
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Aethos Intelligence Briefing • Investor Mode</h2>
          </div>
          <h1 className={`text-fluid-3xl font-black uppercase tracking-tighter leading-[0.8] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Data<br /><span className="text-[#00F0FF]">Triage</span>
          </h1>
          <p className={`text-sm ${isDaylight ? 'text-slate-500' : 'text-slate-400'} max-w-xl italic font-medium leading-relaxed`}>
            "Discover everything. Deep-index what matters first. Aethos is the AI-readiness layer that turns architectural debt into governed, searchable, budget-aware intelligence."
          </p>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 xl:flex items-center p-1.5 rounded-2xl border transition-all shrink-0 ${isDaylight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                activeView === tab.id 
                  ? (isDaylight ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-black shadow-xl') 
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'market' && (
          <motion.div 
            key="market"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* The Strategic Problem */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <GlassCard className="p-8 space-y-6">
                <div className="p-3 w-fit rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                   <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">The Fragmented Tenant</h3>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  Modern enterprises suffer from <strong>Operational Blindness</strong>. Data is scattered across M365, Slack, and Box, with no unified source of truth for <strong>Dead Capital</strong> (waste) or <strong>Identity Decay</strong>.
                </p>
              </GlassCard>

              <GlassCard className="p-8 space-y-6 border-[#FF5733]/20">
                <div className="p-3 w-fit rounded-xl bg-[#FF5733]/10 text-[#FF5733]">
                  <PieIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">The $2.4M Leak</h3>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  Average Fortune 1000 tenants lose <strong>22% of their storage budget</strong> to orphaned containers and inactive silos. Legacy tools fail because they act as "Janitors," not "Architects."
                </p>
              </GlassCard>

              <GlassCard className="p-8 space-y-6">
                <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">The AI Spend Trap</h3>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  Teams want AI on everything, but not everything deserves AI attention. Aethos turns cost control into <strong>Data Triage</strong>, guiding AI+ indexing toward the content with the highest operational value.
                </p>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <GlassCard className="p-10 space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Market Opportunity</h4>
                  <div className="space-y-6">
                     <p className="text-sm text-slate-300 leading-relaxed">
                        The SaaS Management market is crowded with tools that inventory sprawl after the fact. Aethos focuses on <strong>AI readiness</strong>: mapping the whole tenant, clearing architectural debt, and deciding where paid AI attention should go first.
                     </p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                           <span className="text-[9px] font-black text-[#00F0FF] uppercase block mb-1">Motion</span>
                           <span className="text-lg font-black text-white">Map First</span>
                           <p className="text-[8px] text-slate-500 uppercase mt-1">Metadata-wide discovery</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                           <span className="text-[9px] font-black text-[#00F0FF] uppercase block mb-1">AI+ Motion</span>
                           <span className="text-lg font-black text-white">Index Smart</span>
                           <p className="text-[8px] text-slate-500 uppercase mt-1">Credit-aware content waves</p>
                        </div>
                     </div>
                  </div>
               </GlassCard>

               <GlassCard className="p-10 space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Strategic Moats</h4>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/10">
                        <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF]">
                           <Search className="w-5 h-5" />
                        </div>
                        <div>
                           <span className="text-xs font-black text-white uppercase">The Identity Engine</span>
                           <p className="text-[10px] text-slate-500">Proprietary unified data model reconciling people across all digital silos.</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-400">
                           <Zap className="w-5 h-5" />
                        </div>
                        <div>
                           <span className="text-xs font-black text-white uppercase">The Stateful Pulse</span>
                           <p className="text-[10px] text-slate-500">Turning silent administrative data into a high-engagement organizational feed.</p>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </div>
          </motion.div>
        )}

        {activeView === 'narrative' && (
          <motion.div 
            key="narrative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-12"
          >
             <section className="space-y-6 text-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">The Enterprise Intelligence Layer</h3>
                <p className="text-sm text-slate-400 leading-loose italic max-w-2xl mx-auto font-medium">
                  Aethos is not an application; it is a <strong>stateful overlay</strong>. We bridge the gap between "What the IT system says" and "How the organization actually breathes."
                </p>
             </section>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-8 space-y-6">
                   <h4 className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.3em]">The Architect Mindset</h4>
                   <p className="text-lg font-black text-white uppercase tracking-tight">Designing Clarity,<br />Not Just Cleanup.</p>
                   <p className="text-xs text-slate-400 leading-relaxed italic">
                     Aethos provides the <strong>Operational Map</strong> (Voyager) and the <strong>Identity Anchor</strong> (Identity Engine) to give leadership 100% visibility into their digital workforce.
                   </p>
                </GlassCard>

                <GlassCard className="p-8 space-y-6 border-[#00F0FF]/20">
                   <h4 className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.3em]">The "Anti-Intranet" Pivot</h4>
                   <p className="text-lg font-black text-white uppercase tracking-tight">From Static Silos<br />To Intelligence Streams.</p>
                   <p className="text-xs text-slate-400 leading-relaxed italic">
                     Legacy intranets are places where data goes to die. Aethos is a live stream where data is transformed into culture. This is the <strong>Strategic Hook</strong> for the C-Suite.
                   </p>
                </GlassCard>
             </div>

             <GlassCard className="p-10 text-center space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Primary Brand Pillar</h4>
                <div className="flex flex-col items-center">
                   <span className="text-fluid-2xl font-black text-[#00F0FF] uppercase tracking-tighter leading-none">Operational</span>
                   <span className="text-fluid-2xl font-black text-white uppercase tracking-tighter leading-none -mt-4">Architecture</span>
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto italic">
                   "We don't just secure the environment; we architect its efficiency."
                </p>
             </GlassCard>
          </motion.div>
        )}

        {activeView === 'pitch' && (
          <motion.div 
            key="pitch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-8 space-y-6">
                   <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-[#00F0FF]" /> Why Aethos Wins
                   </h3>
                   <div className="space-y-4">
                      {[
                        { title: 'Identity-First Data Model', desc: 'Competitors track files; we track people. This is the only way to achieve operational clarity.' },
                        { title: 'Instant ROI (Dead Capital)', desc: 'We identify waste across multi-platform sources in minutes, not months.' },
                        { title: 'The Social Multiplier', desc: 'Our "Pulse" feed drives 10x more engagement than legacy admin dashboards.' },
                        { title: 'Universal Adapter Pattern', desc: 'Ready for the future of work with M365, Slack, Box, and beyond.' }
                      ].map((win, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                           <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{win.title}</h4>
                           <p className="text-[10px] text-slate-500 italic">{win.desc}</p>
                        </div>
                      ))}
                   </div>
                </GlassCard>

                <GlassCard className="p-8 space-y-8">
                   <h3 className="text-xl font-black uppercase tracking-tight text-white">Investment Thesis</h3>
                   <p className="text-sm text-slate-400 leading-relaxed">
                      Aethos is building the <strong>Terminal for the Digital COO</strong>. As SaaS sprawl continues, the need for an intelligence layer that "speaks human" while managing trillions of nodes is the ultimate investment opportunity in the enterprise space.
                   </p>
                   <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                         <span className="text-slate-500">Go-To-Market</span>
                         <span className="text-[#00F0FF]">Product-Led / Tiered</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                         <span className="text-slate-500">Churn Moat</span>
                         <span className="text-[#00F0FF]">Stateful Identity Anchors</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                         <span className="text-slate-500">Exit Potential</span>
                         <span className="text-[#00F0FF]">Platform Acquisition / IPO</span>
                      </div>
                   </div>
                   <button className="w-full py-4 rounded-2xl bg-[#00F0FF] text-[#0B0F19] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                      Request Full Deck
                   </button>
                </GlassCard>
             </div>
          </motion.div>
        )}

        {activeView === 'pricing' && (
          <motion.div 
            key="pricing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { 
                    tier: 'Base', 
                    price: '$499', 
                    focus: 'Metadata Intelligence', 
                    desc: 'Full-tenant discovery, workspace stewardship, Oracle metadata search, and AI-readiness mapping without reading document bodies.', 
                    color: 'text-[#00F0FF]',
                    features: [
                      'Metadata-wide tenant discovery',
                      'Integrity scoring and workspace visibility',
                      'Oracle metadata search',
                      'Tag-based workspace auto-sync',
                      'Stewardship and remediation workflows',
                      'AI readiness map without content reading'
                    ]
                  },
                  { 
                    tier: 'AI+ Add-On', 
                    price: '$698', 
                    focus: 'Content Intelligence', 
                    desc: 'Base plus opt-in deep indexing for the content that matters first. Includes semantic search, summaries, PII scans, and Intelligence Credit controls.', 
                    color: 'text-purple-400',
                    priceBreakdown: 'Base $499 + AI+ $199',
                    features: [
                      'All Base features',
                      'Targeted content indexing',
                      'Semantic content search',
                      'Cached document summaries',
                      'PII scans with regex-first efficiency',
                      'Monthly Intelligence Credit ledger'
                    ]
                  }
                ].map((t, i) => (
                  <GlassCard key={i} className={`p-8 space-y-6 ${i === 1 ? 'border-purple-400/40 bg-purple-500/5' : 'border-[#00F0FF]/40 bg-[#00F0FF]/5'}`}>
                     <div className="flex justify-between items-start">
                        <h4 className={`text-2xl font-black uppercase tracking-tight ${t.color}`}>{t.tier}</h4>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t.focus}</span>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-end gap-1">
                          <span className="text-4xl font-black text-white">{t.price}</span>
                          <span className="text-[10px] text-slate-500 font-bold mb-2">/ tenant / mo</span>
                       </div>
                       {t.priceBreakdown && (
                         <p className="text-[10px] text-slate-400 italic">({t.priceBreakdown})</p>
                       )}
                     </div>
                     <p className="text-xs text-slate-400 italic leading-relaxed">{t.desc}</p>
                     
                     <div className="space-y-2 pt-4 border-t border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Included Features</p>
                       {t.features.map((feature, idx) => (
                         <div key={idx} className="flex items-start gap-2">
                           <CheckCircle2 className={`w-3 h-3 mt-0.5 flex-shrink-0 ${t.color}`} />
                           <span className="text-xs text-slate-400">{feature}</span>
                         </div>
                       ))}
                     </div>
                     
                     <div className="pt-4">
                        <button className={`w-full py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                          i === 1 
                            ? 'bg-purple-500 border-purple-500 text-white hover:bg-purple-600' 
                            : 'bg-[#00F0FF] border-[#00F0FF] text-black hover:bg-[#00F0FF]/90'
                        }`}>
                           {i === 1 ? 'Get AI+ Access' : 'Start with Base'}
                        </button>
                     </div>
                  </GlassCard>
                ))}
             </div>

             {/* 14-Day Trial */}
             <GlassCard className="p-10 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="space-y-4">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Zap className="w-6 h-6 text-amber-500" />
                        14-Day Free Trial
                      </h4>
                      <p className="text-sm text-slate-400 max-w-md italic leading-relaxed">
                         \"Experience the metadata intelligence layer first. AI+ content intelligence can be enabled with a 100-credit trial pack after explicit admin opt-in.\"
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 text-[8px] font-black tracking-widest">
                          VIEW-ONLY MODE
                        </span>
                        <span className="px-3 py-1.5 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-500/20 text-[8px] font-black tracking-widest">
                          1 WORKSPACE MAX
                        </span>
                        <span className="px-3 py-1.5 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-500/20 text-[8px] font-black tracking-widest">
                          METADATA SEARCH
                        </span>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Trial Period</span>
                      <span className="text-4xl font-black text-amber-500">$0</span>
                      <p className="text-[9px] text-slate-500 uppercase mt-1">Full Feature Preview</p>
                   </div>
                </div>
             </GlassCard>

             {/* ROI Calculator */}
             <GlassCard className="p-10 space-y-8 bg-gradient-to-br from-[#00F0FF]/5 to-transparent border-[#00F0FF]/10">
                <h4 className="text-xl font-black text-white uppercase tracking-tight">ROI Calculator</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <p className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Tenant Size</p>
                    <p className="text-3xl font-black text-white">1,000</p>
                    <p className="text-xs text-slate-400">Active Microsoft 365 Users</p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <p className="text-[9px] font-black text-[#FF5733] uppercase tracking-widest">Waste Identified</p>
                    <p className="text-3xl font-black text-white">~22%</p>
                    <p className="text-xs text-slate-400">Of storage/licensing budget</p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Payback Period</p>
                    <p className="text-3xl font-black text-white">~30</p>
                    <p className="text-xs text-slate-400">Days to positive ROI</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    <strong className="text-white">Real-World Example:</strong> A 1,000-user tenant paying $499/mo saves an average of $12K-18K annually through:
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF]">•</span>
                      <span>Orphaned SharePoint site cleanup (avg. $8K/year in storage costs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF]">•</span>
                      <span>Duplicate file elimination (avg. $3K/year in redundant storage)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF]">•</span>
                      <span>Stale content archival (avg. $5K/year in hot storage reduction)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00F0FF]">•</span>
                      <span>IT time savings (avg. 15 hours/month @ $150/hr = $27K/year)</span>
                    </li>
                  </ul>
                </div>
             </GlassCard>
          </motion.div>
        )}

        {activeView === 'tasks' && (
          <motion.div 
            key="tasks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
             <div className="flex justify-between items-center px-4">
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-[#00F0FF]" /> Builder Logs
                   </h4>
                   <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Operational Velocity: 88%</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[8px] font-black text-[#00F0FF] uppercase tracking-widest animate-pulse">
                   LIVE_DEV_SYNC
                </div>
             </div>

             <GlassCard className="p-0 overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">System Module</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Priority</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {taskList.map((item) => (
                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                           <td className="px-8 py-6">
                              <span className={`text-xs font-black uppercase tracking-tight ${item.status === 'Complete' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                 {item.task}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex justify-center">
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                   item.priority === 'Critical' ? 'bg-[#FF5733]/20 border-[#FF5733]/40 text-[#FF5733]' :
                                   item.priority === 'High' ? 'bg-[#FF5733]/10 border-[#FF5733]/20 text-[#FF5733]/80' :
                                   item.priority === 'Medium' ? 'bg-[#00F0FF]/10 border-[#00F0FF]/20 text-[#00F0FF]/80' :
                                   'bg-white/5 border-white/10 text-slate-500'
                                 }`}>
                                    {item.priority}
                                 </span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className={`text-[9px] font-black uppercase tracking-widest ${
                                item.status === 'Complete' ? 'text-emerald-500' :
                                item.status === 'In-Progress' ? 'text-[#00F0FF] animate-pulse' :
                                'text-slate-500'
                              }`}>
                                 {item.status}
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
