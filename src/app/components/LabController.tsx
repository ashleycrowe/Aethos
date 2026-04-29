import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Shield, CreditCard, User, ChevronDown, Check, Beaker, X, Sparkles, Zap } from 'lucide-react';
import { useUser, UserRole, LicenseTier } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

export const LabController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setRole, setTier } = useUser();
  const { isDaylight } = useTheme();

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'ARCHITECT', label: 'Architect', desc: 'Full workspace creation & orchestration.' },
    { id: 'CURATOR', label: 'Curator', desc: 'Content management & tagging authority.' },
    { id: 'AUDITOR', label: 'Auditor', desc: 'Governance oversight & compliance review.' },
    { id: 'VIEWER', label: 'Viewer', desc: 'Read-only intelligence consumption.' },
  ];

  const tiers: { id: LicenseTier; label: string; price: string; desc: string; features: string[] }[] = [
    { 
      id: 'AI_PLUS', 
      label: 'AI+ Tier', 
      price: '$698/mo',
      desc: 'Base + AI Content Reading',
      features: ['All Base features', 'AI content analysis', 'Document reading', 'Smart recommendations']
    },
    { 
      id: 'BASE', 
      label: 'Base Tier', 
      price: '$499/mo',
      desc: 'Metadata Intelligence Layer',
      features: ['Metadata enrichment', 'Tag management', 'Workspace auto-sync', 'Cross-provider search']
    },
    { 
      id: 'TRIAL', 
      label: '14-Day Trial', 
      price: '$0',
      desc: 'Limited Preview Access',
      features: ['View-only mode', '1 workspace', 'Basic search', 'No AI features']
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] max-w-[calc(100vw-48px)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-full font-black uppercase tracking-widest text-[8px] md:text-[9px] shadow-2xl transition-all overflow-hidden border ${
          isDaylight 
            ? 'bg-slate-900 text-white border-white/10 hover:bg-black' 
            : 'bg-[#FF5733] text-white border-white/10 shadow-[0_10px_40px_rgba(255,87,51,0.3)] hover:scale-105 active:scale-95'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700 pointer-events-none" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Beaker className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="relative z-10">Permission Lab</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
          />
        )}
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
            className={`absolute bottom-20 right-0 w-[320px] md:w-[380px] backdrop-blur-3xl border rounded-[32px] p-6 md:p-8 shadow-[0_20px_100px_rgba(0,0,0,0.8)] z-[110] overflow-hidden ${
              isDaylight ? 'bg-white border-slate-200' : 'bg-[#0B0F19]/95 border-white/10'
            }`}
          >
            {/* Decorative background element */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none ${isDaylight ? 'bg-blue-500' : 'bg-[#00F0FF]'}`} />
            
            <div className={`flex items-center gap-4 mb-8 border-b pb-6 relative z-10 ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
              <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-white/5 text-[#00F0FF]'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-black text-xs uppercase tracking-[0.2em] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Permission Lab</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Persona & Package Simulator</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Role Selection */}
              <div>
                <label className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mb-4 block">Select User Persona</label>
                <div className="grid gap-2.5">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                        user.actualRole === r.id 
                        ? (isDaylight ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-[#00F0FF]/10 border-[#00F0FF]/40 ring-1 ring-[#00F0FF]/30') 
                        : (isDaylight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/20')
                      }`}
                    >
                      <div className="min-w-0">
                        <div className={`text-[10px] font-black uppercase tracking-widest ${user.actualRole === r.id ? (isDaylight ? 'text-white' : 'text-[#00F0FF]') : (isDaylight ? 'text-slate-700' : 'text-white')}`}>
                          {r.label}
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-tight mt-1 truncate ${user.actualRole === r.id ? (isDaylight ? 'text-white/60' : 'text-slate-400') : 'text-slate-500'}`}>
                          {r.desc}
                        </div>
                      </div>
                      {user.actualRole === r.id ? (
                        <div className={`p-1 rounded-full ${isDaylight ? 'bg-white text-slate-900' : 'bg-[#00F0FF] text-black'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border transition-colors ${isDaylight ? 'border-slate-200 group-hover:border-slate-300' : 'border-white/10 group-hover:border-white/30'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mb-4 block">Select Pricing Tier</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {tiers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                        user.tier === t.id 
                        ? (isDaylight ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-[#FF5733]/10 border-[#FF5733]/40 ring-1 ring-[#FF5733]/30') 
                        : (isDaylight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/20')
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`p-2 rounded-xl transition-colors ${user.tier === t.id ? (isDaylight ? 'bg-white/10 text-[#FF5733]' : 'bg-[#FF5733]/20 text-[#FF5733]') : (isDaylight ? 'bg-white text-slate-400 border border-slate-100' : 'bg-white/5 text-slate-500')}`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-[10px] font-black uppercase tracking-widest ${user.tier === t.id ? (isDaylight ? 'text-white' : 'text-[#FF5733]') : (isDaylight ? 'text-slate-700' : 'text-white')}`}>
                            {t.label}
                          </div>
                          <div className={`text-[9px] font-bold uppercase tracking-tight mt-1 ${user.tier === t.id ? (isDaylight ? 'text-white/60' : 'text-slate-500') : 'text-slate-500'}`}>
                            {t.price} / month
                          </div>
                        </div>
                      </div>
                      {user.tier === t.id ? (
                        <div className={`p-1 rounded-full ${isDaylight ? 'bg-white text-slate-900' : 'bg-[#FF5733] text-white'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border transition-colors ${isDaylight ? 'border-slate-200 group-hover:border-slate-300' : 'border-white/10 group-hover:border-white/30'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-10 pt-6 border-t relative z-10 ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                <span className="text-slate-500">Active Permissions</span>
                <span className={`flex items-center gap-1.5 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`}>
                  <div className={`w-1 h-1 rounded-full animate-pulse ${isDaylight ? 'bg-slate-900' : 'bg-[#00F0FF]'}`} />
                  LIVE_SYNC
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.permissions.canCreateWorkspace && <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-[8px] font-black tracking-widest">CREATE_WORKSPACE</span>}
                {user.permissions.canPinAssets && <span className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 text-[8px] font-black tracking-widest">PIN_ASSETS</span>}
                {user.permissions.canAddNotes && <span className="px-3 py-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg border border-cyan-500/20 text-[8px] font-black tracking-widest">ADD_NOTES</span>}
                {user.permissions.canAccessDashboard && <span className="px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 text-[8px] font-black tracking-widest">GOV_ACCESS</span>}
                {user.permissions.canUseAiFeatures && (
                  <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg border border-purple-500/20 text-[8px] font-black tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI_FEATURES
                  </span>
                )}
                {user.permissions.canReadFileContent && (
                  <span className="px-3 py-1.5 bg-violet-500/10 text-violet-500 rounded-lg border border-violet-500/20 text-[8px] font-black tracking-widest flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    CONTENT_READER
                  </span>
                )}
                {!user.permissions.canCreateWorkspace && <span className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-[8px] font-black tracking-widest">LOCKED_MODE</span>}
              </div>
              
              {/* Tier-specific info banner */}
              {user.tier === 'TRIAL' && (
                <div className={`mt-4 p-3 rounded-xl border ${isDaylight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'}`}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-amber-600">
                    ⚠️ Trial Mode: Upgrade to unlock full features
                  </p>
                </div>
              )}
              
              {user.tier === 'BASE' && (
                <div className={`mt-4 p-3 rounded-xl border ${isDaylight ? 'bg-purple-50 border-purple-200' : 'bg-purple-500/10 border-purple-500/20'}`}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-purple-500">
                    💡 Add AI+ ($199/mo) for content reading & analysis
                  </p>
                </div>
              )}
              
              {user.tier === 'AI_PLUS' && (
                <div className={`mt-4 p-3 rounded-xl border ${isDaylight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500">
                    ✨ AI+ Active: Full intelligence layer unlocked
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};