import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Settings, 
  Code, 
  MessageSquare, 
  Eye, 
  Sparkles, 
  Zap, 
  Shield, 
  Cpu, 
  Database,
  ArrowRight,
  Target,
  Layout,
  MousePointer2,
  ChevronRight,
  TrendingDown,
  Info,
  History,
  X,
  Plus,
  Search,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { GlassDropdown } from './ui/GlassDropdown';
import { TabBar } from './ui/TabBar';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

import { OperationalGrid } from './ui/OperationalGrid';

export const DesignCenter = () => {
  const { isDaylight, toggleDaylight, brand, updateBrand } = useTheme();
  const [activeTab, setActiveTab] = useState<'atoms' | 'components' | 'standards' | 'feedback'>('components');
  const [suggestion, setSuggestion] = useState('');

  const gridData = [
    {
      id: 1,
      name: 'Legacy_Project_Titan_Archive.zip',
      meta: '12.4 GB • MICROSOFT',
      status: 'COLD',
      archived: '12 days ago',
      retention: 18,
      maxRetention: 30,
      roi: '$124.00/mo',
      type: 'zip'
    },
    {
      id: 2,
      name: 'Sales_Records_2022_Internal.csv',
      meta: '4.2 GB • GOOGLE',
      status: 'COLD',
      archived: '24 days ago',
      retention: 6,
      maxRetention: 30,
      roi: '$42.00/mo',
      type: 'csv'
    },
    {
      id: 3,
      name: '#private-legacy-support-channel',
      meta: '890 MB • SLACK',
      status: 'VAULT',
      archived: '45 days ago',
      retention: 0,
      maxRetention: 30,
      roi: '$8.90/mo',
      type: 'channel'
    }
  ];

  const gridColumns = [
    { key: 'artifact', label: 'Archived Artifact', width: '35%' },
    { key: 'status', label: 'Status', width: '15%' },
    { key: 'archived', label: 'Archived', width: '15%' },
    { key: 'retention', label: 'Retention', width: '20%' },
    { key: 'roi', label: 'ROI Reclaimed', width: '15%', align: 'right' as const },
  ];

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    toast.success('Design Suggestion Captured', {
      description: 'The architectural board will review this during the next sync cycle.'
    });
    setSuggestion('');
  };

  const navItems = [
    { id: 'atoms', label: 'Atoms', icon: Palette },
    { id: 'components', label: 'Components', icon: Layers },
    { id: 'standards', label: 'Standards', icon: Code },
    { id: 'feedback', label: 'Lab Feedback', icon: MessageSquare },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Design Center Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
               <Sparkles className="w-6 h-6" />
             </div>
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">System Prototype • Lab Environment</h2>
          </div>
          <h1 className={`text-fluid-3xl font-black uppercase tracking-tighter leading-[0.8] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Design<br /><span className="text-[#00F0FF]">Architecture</span>
          </h1>
          <p className={`text-sm ${isDaylight ? 'text-slate-500' : 'text-slate-400'} max-w-xl italic font-medium leading-relaxed`}>
            "A technical environment for architects to review atomic consistency, interaction patterns, and operational clarity."
          </p>
        </div>

        <div className="flex flex-wrap gap-4 shrink-0">
          <button 
            onClick={toggleDaylight}
            className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all ${
              isDaylight ? 'bg-slate-900 text-white' : 'bg-white text-black hover:bg-[#00F0FF] transition-all'
            }`}
          >
            <Eye className="w-5 h-5" />
            Switch to {isDaylight ? 'Cosmic' : 'Daylight'} Mode
          </button>
        </div>
      </div>

      {/* Lab Navigation */}
      <TabBar 
        items={navItems} 
        activeTab={activeTab} 
        onTabChange={(id) => setActiveTab(id as any)} 
      />

      {/* Main Content Area */}
      <div className="min-h-[60vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'atoms' && (
            <motion.div key="atoms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Palette */}
                <div className={`p-10 rounded-[48px] border ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5'}`}>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-10 text-white">Color Palette</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Space Black', hex: '#0B0F19', desc: 'Primary Background' },
                      { label: 'Starlight Cyan', hex: '#00F0FF', desc: 'Primary Action / Growth' },
                      { label: 'Supernova Orange', hex: '#FF5733', desc: 'Alert / Waste / Risk' },
                      { label: 'Cosmic Slate', hex: '#1E293B', desc: 'Secondary / Border' },
                    ].map((color) => (
                      <div key={color.hex} className="flex items-center gap-6 group">
                        <div className="w-16 h-16 rounded-2xl shadow-xl border border-white/10" style={{ backgroundColor: color.hex }} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-white">{color.label}</p>
                          <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{color.hex} • {color.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className={`p-10 rounded-[48px] border ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5'}`}>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-10 text-white">Typography Scale</h3>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fluid 3XL / Heading</span>
                      <p className="text-4xl font-black uppercase tracking-tighter leading-tight text-white">Aethos Architecture</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Body Large</span>
                      <p className="text-sm font-medium leading-relaxed text-slate-400">
                        Operational efficiency is the cornerstone of the Enterprise Intelligence Layer.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">UI Labels</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Integrity Check • Live</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div key="components" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Interactive Controls */}
                <div className="xl:col-span-4 space-y-10">
                  <div className={`p-8 rounded-[40px] border space-y-8 ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Cinematic Dropdown</h3>
                    <GlassDropdown 
                      label="Select Sensitivity"
                      value="Public"
                      options={['Public', 'Internal', 'Confidential', 'Highly Confidential']}
                      onChange={(v) => toast.info(`Value updated: ${v}`)}
                    />
                  </div>

                  <div className={`p-8 rounded-[40px] border space-y-8 ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Atomic Buttons</h3>
                    <div className="space-y-4">
                      <Button className="w-full h-14 bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-black uppercase tracking-widest text-[10px] rounded-2xl border-none">
                        Primary Launch <Zap className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-[10px] rounded-2xl border-white/10 text-white hover:bg-white/5">
                        Secondary Orbit <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button className="w-full h-14 bg-[#FF5733] text-white hover:bg-[#FF5733]/90 font-black uppercase tracking-widest text-[10px] rounded-2xl border-none">
                        Waste Mitigation <History className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  <div className={`p-8 rounded-[40px] border space-y-8 ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operational Search</h3>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        readOnly
                        placeholder="Ask the Oracle..."
                        className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest outline-none text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation & Grid Components */}
                <div className="xl:col-span-8 space-y-10">
                   <div className={`p-10 rounded-[48px] border space-y-10 ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operational Grid System</h3>
                      
                      <OperationalGrid 
                        title="Cold Tier Vault"
                        subtitle="Historical ROI & Remediation Log"
                        columns={gridColumns}
                        data={gridData}
                        renderCell={(item, key) => {
                          if (key === 'artifact') {
                            return (
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  isDaylight ? 'bg-slate-100' : 'bg-white/5'
                                }`}>
                                  <Database className={`w-5 h-5 ${isDaylight ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                                <div>
                                  <p className={`text-[11px] font-black uppercase tracking-tight mb-0.5 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                                    {item.name}
                                  </p>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                    {item.meta}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          if (key === 'status') {
                            return (
                              <div className={`inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                                item.status === 'COLD' 
                                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20' 
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {item.status}
                              </div>
                            );
                          }
                          if (key === 'retention') {
                            const percent = (item.retention / item.maxRetention) * 100;
                            return (
                              <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                                    {item.retention} Days
                                  </p>
                                </div>
                                <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${item.retention < 10 ? 'bg-[#FF5733]' : 'bg-indigo-500'}`} 
                                    style={{ width: `${percent}%` }} 
                                  />
                                </div>
                              </div>
                            );
                          }
                          if (key === 'roi') {
                            return (
                              <span className="text-[12px] font-black text-[#00F0FF] tracking-tighter">
                                {item.roi}
                              </span>
                            );
                          }
                          return (
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-500' : 'text-slate-400'}`}>
                              {item[key]}
                            </span>
                          );
                        }}
                      />

                      <div className="space-y-8 pt-6 border-t border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Navigation Variants</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <TabBar 
                              variant="glass"
                              items={navItems.slice(0, 3)}
                              activeTab="atoms"
                              onTabChange={() => {}}
                           />
                           <TabBar 
                              variant="neon"
                              items={navItems.slice(0, 3)}
                              activeTab="components"
                              onTabChange={() => {}}
                           />
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className={`p-8 rounded-[48px] border relative overflow-hidden flex flex-col h-full group ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                        <div className="flex justify-between items-start mb-8">
                          <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                            <Cpu className="w-6 h-6" />
                          </div>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tighter text-white mb-4">Universal Card</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-8 flex-1">Standard container for intelligence artifacts.</p>
                        <Button className="w-full h-12 bg-white/5 border border-white/10 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black text-[9px] font-black uppercase tracking-widest border-none">
                          Deconstruct Intelligence
                        </Button>
                      </div>

                      <div className={`p-8 rounded-[48px] border relative overflow-hidden flex flex-col h-full border-t-4 border-t-[#FF5733] ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                        <div className="flex items-center gap-4 mb-10">
                          <div className="p-3 rounded-2xl bg-[#FF5733]/10 text-[#FF5733]">
                            <TrendingDown className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-white">Waste Meter</h3>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-end justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dead Capital</span>
                            <span className="text-2xl font-black text-[#FF5733]">$14,204</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF5733]" style={{ width: '65%' }} />
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'standards' && (
            <motion.div key="standards" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div className={`p-12 rounded-[48px] border ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5 shadow-2xl'} max-w-4xl`}>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-12 text-white">Aethos Core Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Target className="w-4 h-4" /> Operational Clarity
                      </h4>
                      <p className={`text-sm ${isDaylight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed italic`}>
                        Every UI element must contribute to clarity, not noise. Avoid "Security Janitor" language (e.g., "Risk Detected"). Use "Operational Architect" language.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Layout className="w-4 h-4" /> Cinematic Glassmorphism
                      </h4>
                      <p className={`text-sm ${isDaylight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed italic`}>
                        Backgrounds must be deep space (#0B0F19). Use 70-95% opacity for cards with heavy backdrop blur (12px+).
                      </p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Shield className="w-4 h-4" /> Primary Action
                      </h4>
                      <p className={`text-sm ${isDaylight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed italic`}>
                        Use #00F0FF for all primary CTA, growth indicators, and active sync states. High visibility neon.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Info className="w-4 h-4" /> Narrative Logic
                      </h4>
                      <p className={`text-sm ${isDaylight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed italic`}>
                        Never show raw technical calculations by default. Provide a "Story" version of every metric.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-2xl">
              <div className={`p-12 rounded-[48px] border ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0B0F19] border-white/5 shadow-2xl'}`}>
                <div className="flex items-center gap-4 mb-8">
                  <MessageSquare className="w-6 h-6 text-[#00F0FF]" />
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">Lab Feedback Loop</h3>
                </div>
                <p className={`text-sm ${isDaylight ? 'text-slate-500' : 'text-slate-400'} mb-10 leading-relaxed italic`}>
                  Found an inconsistency? Submit a design request directly to the system architect.
                </p>
                <form onSubmit={handleSuggestionSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Architectural Suggestion</label>
                    <textarea 
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="e.g. The backdrop blur on dropdowns could be 4px stronger in cosmic mode..."
                      className={`w-full min-h-[200px] p-6 rounded-3xl border outline-none text-sm leading-relaxed transition-all ${
                        isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5 text-white focus:border-[#00F0FF]/50'
                      }`}
                    />
                  </div>
                  <button 
                    type="submit"
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all ${
                      isDaylight ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20'
                    }`}
                  >
                    Transmit to Architecture Board <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
