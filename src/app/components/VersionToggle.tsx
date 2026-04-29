/**
 * VersionToggle - Prototype Version Switcher UI
 * 
 * PURPOSE:
 * Floating UI component that allows switching between product versions (V1-V4)
 * for demonstration and testing purposes.
 * 
 * FEATURES:
 * - Keyboard shortcut: Cmd/Ctrl + Shift + V
 * - Collapsible panel (minimized by default)
 * - Shows current version badge
 * - Feature delta preview on hover
 * - Demo mode toggle
 */

import React, { useState, useEffect } from 'react';
import { useVersion, Version, VERSION_METADATA, getVersionDelta } from '../context/VersionContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Zap, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const VersionToggle: React.FC = () => {
  const { version, setVersion, metadata, isDemoMode, setDemoMode } = useVersion();
  const { isDaylight } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFeaturePreview, setShowFeaturePreview] = useState<Version | null>(null);

  // Keyboard shortcut: Cmd/Ctrl + Shift + V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        setIsExpanded(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const versions: Version[] = ['V1', 'V1.5', 'V2', 'V3', 'V4'];

  const handleVersionChange = (newVersion: Version) => {
    if (newVersion === version) return;
    
    setVersion(newVersion);
    
    const meta = VERSION_METADATA[newVersion];
    toast.success(`Switched to ${meta.name}`, {
      description: meta.primaryFeatures.join(' • '),
      duration: 3000,
    });
  };

  const getFeatureCount = (v: Version): number => {
    const delta = getVersionDelta(v);
    return Object.keys(delta).length;
  };

  if (!isDemoMode) {
    return null; // Hide completely when demo mode is off
  }

  return (
    <>
      {/* Minimized Badge (Always Visible) */}
      <AnimatePresence>
        {!isExpanded && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0B0F19]/95 border border-[#00F0FF]/30 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00F0FF] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">
                  Demo Mode
                </span>
              </div>
              
              <div className="h-4 w-px bg-white/10" />
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {version}
                </span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00F0FF] transition-colors" />
              </div>
            </button>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <Motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] w-[420px]"
          >
            <div className={`rounded-3xl border backdrop-blur-3xl shadow-2xl overflow-hidden ${
              isDaylight 
                ? 'bg-white/95 border-slate-200' 
                : 'bg-[#0B0F19]/95 border-white/10'
            }`}>
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDaylight ? 'border-slate-200' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#00F0FF]/10">
                    <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-tight ${
                      isDaylight ? 'text-slate-900' : 'text-white'
                    }`}>
                      Version Switcher
                    </h3>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mt-0.5">
                      Prototype Testing Mode
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDaylight 
                      ? 'hover:bg-slate-100 text-slate-600' 
                      : 'hover:bg-white/5 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Current Version Info */}
              <div className={`px-6 py-4 border-b ${
                isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Current Version
                  </span>
                  <span className="text-xs font-bold text-[#00F0FF]">
                    {metadata.releaseTarget}
                  </span>
                </div>
                
                <h4 className={`text-base font-black uppercase tracking-tight mb-2 ${
                  isDaylight ? 'text-slate-900' : 'text-white'
                }`}>
                  {metadata.name}
                </h4>
                
                <p className={`text-xs leading-relaxed ${
                  isDaylight ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {metadata.tagline}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {metadata.primaryFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20"
                    >
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#00F0FF]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version Selector */}
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Switch Version
                  </span>
                  <div className="flex items-center gap-2">
                    <kbd className={`px-2 py-1 rounded text-[8px] font-mono ${
                      isDaylight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-500'
                    }`}>
                      ⌘⇧V
                    </kbd>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {versions.map((v) => {
                    const isActive = v === version;
                    const versionMeta = VERSION_METADATA[v];
                    
                    return (
                      <div key={v} className="relative">
                        <button
                          onClick={() => handleVersionChange(v)}
                          onMouseEnter={() => setShowFeaturePreview(v)}
                          onMouseLeave={() => setShowFeaturePreview(null)}
                          className={`w-full px-3 py-3 rounded-xl text-center transition-all border ${
                            isActive
                              ? 'bg-[#00F0FF] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                              : isDaylight
                                ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className={`text-xs font-black uppercase tracking-tight ${
                            isActive ? 'text-black' : isDaylight ? 'text-slate-700' : 'text-white'
                          }`}>
                            {v}
                          </div>
                          {!isActive && (
                            <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">
                              {getFeatureCount(v)} New
                            </div>
                          )}
                          {isActive && (
                            <div className="text-[8px] font-black uppercase tracking-widest text-black/70 mt-1">
                              Active
                            </div>
                          )}
                        </button>

                        {/* Feature Preview Tooltip */}
                        <AnimatePresence>
                          {showFeaturePreview === v && v !== version && (
                            <Motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 pointer-events-none z-10"
                            >
                              <div className={`rounded-2xl p-4 shadow-2xl border ${
                                isDaylight 
                                  ? 'bg-white border-slate-200' 
                                  : 'bg-[#0B0F19] border-[#00F0FF]/30'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Info className="w-3 h-3 text-[#00F0FF]" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                    {versionMeta.releaseTarget}
                                  </span>
                                </div>
                                <h5 className={`text-xs font-black uppercase tracking-tight mb-2 ${
                                  isDaylight ? 'text-slate-900' : 'text-white'
                                }`}>
                                  {versionMeta.tagline}
                                </h5>
                                <div className="space-y-1">
                                  {versionMeta.primaryFeatures.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-[#00F0FF]" />
                                      <span className={`text-[10px] ${
                                        isDaylight ? 'text-slate-700' : 'text-slate-400'
                                      }`}>
                                        {feat}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demo Mode Toggle */}
              <div className={`px-6 py-4 border-t ${
                isDaylight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isDemoMode ? (
                      <Eye className="w-4 h-4 text-[#00F0FF]" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    )}
                    <span className={`text-xs font-bold ${
                      isDaylight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      Demo Mode
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setDemoMode(!isDemoMode);
                      toast.info(
                        isDemoMode ? 'Demo Mode Disabled' : 'Demo Mode Enabled',
                        { duration: 2000 }
                      );
                    }}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      isDemoMode 
                        ? 'bg-[#00F0FF]' 
                        : isDaylight 
                          ? 'bg-slate-200' 
                          : 'bg-white/10'
                    }`}
                  >
                    <Motion.div
                      animate={{ x: isDemoMode ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full ${
                        isDemoMode ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  </button>
                </div>
                
                <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">
                  Hide version toggle and demo indicators when testing production UX
                </p>
              </div>

              {/* Keyboard Shortcuts */}
              <div className={`px-6 py-3 border-t ${
                isDaylight ? 'border-slate-200' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between text-[9px]">
                  <span className={isDaylight ? 'text-slate-600' : 'text-slate-500'}>
                    Toggle Panel
                  </span>
                  <kbd className={`px-2 py-1 rounded font-mono ${
                    isDaylight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'
                  }`}>
                    Cmd+Shift+V
                  </kbd>
                </div>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
