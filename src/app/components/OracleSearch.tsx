import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Mic, 
  Command, 
  X, 
  FileText, 
  Users, 
  Box as BoxIcon, 
  ChevronRight, 
  Clock, 
  Star,
  Globe,
  Slack,
  Share2,
  ScanLine
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface OracleSearchProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const MOCK_RESULTS = [
  { id: 'i1', title: 'Synthesize 1.2TB of Waste', type: 'Insight', provider: 'aethos', context: 'Project_X_Legacy site', freshness: 'High Impact Action', icon: Sparkles, action: 'Remediate' },
  { id: 'i2', title: 'Identify Shadow Box Users', type: 'Insight', provider: 'aethos', context: '3 external partners', freshness: 'Security Gap', icon: ShieldAlert, action: 'Link' },
  { id: '1', title: 'Marketing Q3 Strategy', type: 'Project', provider: 'microsoft', context: 'Pinned in [Alpha]', freshness: 'Edited 4m ago by Sarah', icon: BoxIcon },
  { id: '2', title: 'Mark Stevens', type: 'Person', provider: 'slack', context: 'Identity Lead', freshness: 'Active now', icon: Users },
  { id: '3', title: 'Marketing Budget.xlsx', type: 'File', provider: 'microsoft', context: 'Lives in [SharePoint]', freshness: 'Edited 2h ago', icon: FileText },
  { id: '4', title: 'Product Roadmap 2026', type: 'File', provider: 'google', context: 'Shared with 12 partners', freshness: 'Edited yesterday', icon: FileText },
];

export const OracleSearch: React.FC<OracleSearchProps> = ({ isOpen, onClose, isMobile = false }) => {
  const { isDaylight } = useTheme();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredResults = MOCK_RESULTS.filter(r => 
    r.title.toLowerCase().includes(query.toLowerCase()) || 
    r.type.toLowerCase().includes(query.toLowerCase())
  );

  const providerIcons: Record<string, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    local: BoxIcon,
    aethos: Sparkles
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 sm:px-0"
      >
        <div 
          className={`absolute inset-0 transition-colors duration-500 ${isDaylight ? 'bg-white/60' : 'bg-[#0B0F19]/90'} backdrop-blur-xl`}
          onClick={onClose}
        />

        <Motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className={`relative w-full max-w-2xl overflow-hidden rounded-[32px] border shadow-2xl transition-all duration-500 ${
            isDaylight 
              ? 'bg-white border-slate-200' 
              : 'bg-white/[0.03] border-white/10'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 border-b transition-colors ${isDaylight ? 'border-slate-100' : 'border-white/10'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${isDaylight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-[#00F0FF]'}`}>
                {isListening ? (
                  <Motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Mic className="w-6 h-6" />
                  </Motion.div>
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </div>
              
              <input 
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isMobile ? "Speak or type..." : "Search for files, people, or projects..."}
                className={`flex-1 bg-transparent border-none outline-none text-xl font-bold font-['Space_Grotesk'] placeholder:text-slate-500 tracking-tight transition-colors ${
                  isDaylight ? 'text-slate-900' : 'text-white'
                }`}
              />

              <div className="flex items-center gap-3">
                {isMobile ? (
                  <button 
                    onClick={() => setIsListening(!isListening)}
                    className={`p-3 rounded-2xl transition-all ${
                      isListening 
                        ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
                        : isDaylight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                ) : (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${
                    isDaylight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}>
                    <Command className="w-3 h-3" /> K
                  </div>
                )}
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${isDaylight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-slate-500'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            {query.length > 0 ? (
              filteredResults.length > 0 ? (
                filteredResults.map((result, i) => {
                  const ProviderIcon = providerIcons[result.provider];
                  return (
                    <Motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDaylight 
                          ? 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isDaylight ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'
                      }`}>
                        <result.icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-bold truncate tracking-tight transition-colors ${
                            result.provider === 'aethos' ? 'text-[#00F0FF]' :
                            isDaylight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-[#00F0FF]'
                          }`}>
                            {result.title}
                          </span>
                          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                            result.provider === 'aethos' ? 'bg-[#00F0FF]/20 border-[#00F0FF]/30 text-[#00F0FF]' :
                            isDaylight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-500'
                          }`}>
                            {result.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${isDaylight ? 'text-slate-500' : 'text-slate-600'}`}>
                            {result.context}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-700'}`}>•</span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-700'}`}>
                            {result.freshness}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <ProviderIcon className={`w-4 h-4 ${isDaylight ? 'text-slate-300' : 'text-slate-800'}`} />
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                          isDaylight ? 'text-slate-300' : 'text-slate-700'
                        }`} />
                      </div>
                    </Motion.div>
                  );
                })
              ) : (
                <div className="py-12 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-700'}`}>
                    No results found for "{query}"
                  </span>
                </div>
              )
            ) : (
              <div className="space-y-6 p-4">
                <div>
                  <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isDaylight ? 'text-slate-400' : 'text-slate-500'}`}>
                    Recently Viewed
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MOCK_RESULTS.slice(0, 4).map((r) => (
                      <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isDaylight ? 'bg-slate-50 border-slate-100 hover:bg-slate-100' : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}>
                        <Clock className={`w-4 h-4 ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${isDaylight ? 'text-slate-700' : 'text-slate-400'}`}>
                          {r.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t flex items-center justify-between transition-colors ${
            isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/10'
          }`}>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <kbd className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${
                  isDaylight ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-500'
                }`}>ESC</kbd>
                <span className={`text-[8px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>Close</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${
                  isDaylight ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-500'
                }`}>↵</kbd>
                <span className={`text-[8px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>Open</span>
              </div>
            </div>
            
            {isMobile && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F0FF] text-black text-[8px] font-black uppercase tracking-widest cursor-pointer">
                <ScanLine className="w-3 h-3" /> QR Scan Mode
              </div>
            )}
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
};
