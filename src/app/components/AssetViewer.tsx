import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  Share2, 
  Globe, 
  Slack, 
  Box as BoxIcon, 
  HardDrive,
  FileText,
  Clock,
  User,
  ShieldCheck,
  Zap,
  BookOpen,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ProviderType } from '../types/aethos.types';
import { useTheme } from '../context/ThemeContext';

interface AssetViewerProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

export const AssetViewer: React.FC<AssetViewerProps> = ({ asset, isOpen, onClose }) => {
  const { isDaylight } = useTheme();
  if (!asset) return null;

  const providerIcons: Record<ProviderType, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: HardDrive
  };

  const Icon = providerIcons[asset.provider as ProviderType] || FileText;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 backdrop-blur-xl pointer-events-auto ${isDaylight ? 'bg-slate-900/40' : 'bg-[#0B0F19]/80'}`}
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-5xl h-full max-h-[850px] border shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto rounded-[40px] transition-colors duration-500 ${
              isDaylight 
                ? 'bg-white border-slate-200' 
                : 'bg-[#0B0F19]/95 border-white/10'
            }`}
          >
            {/* Header / Top Bar */}
            <div className={`flex justify-between items-center p-8 border-b ${isDaylight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5'}`}>
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
                  <Icon className={`w-8 h-8 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {asset.title || asset.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDaylight ? 'text-slate-500' : 'text-slate-500'}`}>
                      {asset.provider} Container
                    </span>
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`}>
                      Live Asset
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                  isDaylight 
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}>
                  <Share2 className="w-4 h-4" />
                  Share Insight
                </button>
                <button 
                  onClick={onClose}
                  className={`p-3 rounded-full transition-all ${
                    isDaylight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-grow flex overflow-hidden">
              {/* Left Side: Preview */}
              <div className={`flex-grow p-10 flex flex-col ${isDaylight ? 'bg-slate-50/30' : 'bg-black/40'}`}>
                <div className={`flex-grow rounded-3xl border flex items-center justify-center relative overflow-hidden group transition-all ${
                  isDaylight ? 'bg-white border-slate-200 shadow-inner' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className={`absolute inset-0 ${isDaylight ? 'bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent_70%)]'}`} />
                  <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className={`p-10 rounded-[40px] border shadow-2xl transition-all ${
                      isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'
                    }`}>
                      <FileText className={`w-24 h-24 ${isDaylight ? 'text-slate-300' : 'text-slate-700'}`} />
                    </div>
                    <div className="text-center">
                      <p className={`font-bold uppercase tracking-widest text-[10px] mb-2 ${isDaylight ? 'text-slate-400' : 'text-slate-400'}`}>
                        Secure Metadata Preview
                      </p>
                      <p className={`text-sm font-medium ${isDaylight ? 'text-slate-600' : 'text-white'}`}>
                        Binary stream restricted to source application.
                      </p>
                    </div>
                    <button className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl ${
                      isDaylight 
                        ? 'bg-blue-600 text-white shadow-blue-200/50' 
                        : 'bg-[#00F0FF] text-black shadow-[0_0_40px_rgba(0,240,255,0.4)]'
                    }`}>
                      <ExternalLink className="w-5 h-5" />
                      Open in {asset.provider === 'microsoft' ? 'Teams/M365' : asset.provider}
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between items-center px-4">
                  <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>Last Modified</span>
                      <span className={`text-xs font-bold font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-700' : 'text-white'}`}>
                        {asset.modified || '14h ago'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>Storage Footprint</span>
                      <span className={`text-xs font-bold font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-700' : 'text-white'}`}>
                        {asset.waste || '1.2MB'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>Operational Owner</span>
                      <span className={`text-xs font-bold uppercase tracking-tighter ${isDaylight ? 'text-slate-700' : 'text-white'}`}>
                        Architecture Team
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                    isDaylight ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-500/10 border border-emerald-500/30'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified Integrity</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Meaning */}
              <div className={`w-[400px] border-l p-10 flex flex-col gap-10 overflow-y-auto ${
                isDaylight ? 'bg-white border-slate-100' : 'bg-black/20 border-white/5'
              }`}>
                <section className="space-y-4">
                  <div className={`flex items-center gap-3 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`}>
                    <BookOpen className="w-4 h-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Synthesized Meaning</h3>
                  </div>
                  <div className={`p-6 rounded-3xl border relative overflow-hidden group transition-all ${
                    isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/10'
                  }`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className={`w-12 h-12 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
                    </div>
                    <p className={`text-sm leading-relaxed font-medium ${isDaylight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {asset.note || "This asset was indexed from the primary tenant to provide critical context for current operational decisions. It bypasses organizational noise and brings direct value to your workflow."}
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-500">
                    <MessageSquare className="w-4 h-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Associated Thread</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { user: 'SC', msg: 'Crucial for the Q3 planning.', time: '2h ago' },
                      { user: 'JD', msg: 'Metadata scan complete.', time: '5h ago' }
                    ].map((m, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${
                          isDaylight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-500'
                        }`}>
                          {m.user}
                        </div>
                        <div className="flex-grow">
                          <p className={`text-[11px] font-medium ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{m.msg}</p>
                          <span className={`text-[8px] font-bold uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>
                            {m.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={`mt-auto pt-8 border-t ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
                  <button className={`w-full py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    isDaylight 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-sm' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-[#00F0FF]'
                  }`}>
                    Add Meaning <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
