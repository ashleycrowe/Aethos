import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Play, 
  Zap, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  BarChart3,
  Search,
  ArrowRight,
  Database,
  ShieldAlert,
  Ghost,
  Plus,
  X,
  Settings2,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos, GovernanceRule } from '../context/AethosContext';
import { toast } from 'sonner';
import { GlassCard } from './GlassCard';

export const OperationalPolicyArchitect = () => {
  const { isDaylight } = useTheme();
  const { state, addRule, updateRule, removeRule, commitRules } = useAethos();
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Form State for new/editing rules
  const [formState, setFormState] = useState<Partial<GovernanceRule>>({
    name: '',
    description: '',
    provider: 'universal',
    action: 'archive',
    threshold: 180
  });

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Artificially wait for the "Architectural Synthesis"
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsSimulating(false);
    setShowResults(true);
    toast.success("Simulation Complete", {
      description: "Policy impact analysis synthesized for Draft policies."
    });
  };

  const handleCommit = () => {
    commitRules();
    setShowResults(false);
    toast.success("Policies Committed", {
      description: "Governance rules synchronized across all active adapters."
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.description) {
      toast.error("Missing Intelligence", { description: "Please provide a name and description for the policy." });
      return;
    }
    
    if (editingRuleId) {
      updateRule(editingRuleId, formState);
      setEditingRuleId(null);
    } else {
      addRule(formState as any);
    }
    
    setIsAdding(false);
    setFormState({ name: '', description: '', provider: 'universal', action: 'archive', threshold: 180 });
    toast.success(editingRuleId ? "Policy Recalibrated" : "Policy Drafted", { 
      description: editingRuleId ? "Logic updated across selected streams." : "New policy ready for simulation." 
    });
  };

  const handleCalibrate = (rule: GovernanceRule) => {
    setFormState(rule);
    setEditingRuleId(rule.id);
    setIsAdding(true);
  };

  const totalReclaimable = state.rules
    .filter(r => r.status === 'draft')
    .reduce((acc, r) => acc + (r.impact?.costSaved || 0), 0);

  const totalStorage = state.rules
    .filter(r => r.status === 'draft')
    .reduce((acc, r) => acc + (r.impact?.storageReclaimed || 0), 0);

  return (
    <div className="space-y-8 md:space-y-10">
      <AnimatePresence>
        {isAdding && (
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <Motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingRuleId(null); }}
              className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-xl"
            />
            
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl p-8 md:p-12 rounded-[48px] border shadow-2xl overflow-hidden ${
                isDaylight ? 'bg-white border-slate-200' : 'bg-[#151B2B] border-white/10'
              }`}
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => { setIsAdding(false); setEditingRuleId(null); }}
                  className="text-slate-500 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-10">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00F0FF]">
                    {editingRuleId ? 'Recalibrate Logic' : 'Crystallize Intent'}
                  </h4>
                  <p className="text-sm text-slate-500">Define the operational parameters for this governance stream.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Policy Identifier</label>
                      <input 
                        type="text" 
                        value={formState.name} 
                        onChange={e => setFormState({...formState, name: e.target.value})}
                        className={`w-full p-4 rounded-xl border outline-none font-black text-xs transition-all focus:border-[#00F0FF]/50 ${isDaylight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-black/40 border-white/5 text-white'}`}
                        placeholder="e.g. Q4 Ghost Town Purge"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Operational Logic</label>
                      <textarea 
                        value={formState.description} 
                        onChange={e => setFormState({...formState, description: e.target.value})}
                        className={`w-full p-4 rounded-xl border outline-none font-black text-xs h-32 resize-none transition-all focus:border-[#00F0FF]/50 ${isDaylight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-black/40 border-white/5 text-white'}`}
                        placeholder="What is the architectural goal of this policy?"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Stream Scope</label>
                        <select 
                          value={formState.provider} 
                          onChange={e => setFormState({...formState, provider: e.target.value as any})}
                          className={`w-full p-4 rounded-xl border outline-none font-black text-xs transition-all focus:border-[#00F0FF]/50 ${isDaylight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-black/40 border-white/5 text-white'}`}
                        >
                          <option value="universal">Universal (All Streams)</option>
                          <option value="microsoft">Microsoft 365</option>
                          <option value="slack">Slack</option>
                          <option value="google">Google</option>
                          <option value="box">Box</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Action Protocol</label>
                        <select 
                          value={formState.action} 
                          onChange={e => setFormState({...formState, action: e.target.value as any})}
                          className={`w-full p-4 rounded-xl border outline-none font-black text-xs transition-all focus:border-[#00F0FF]/50 ${isDaylight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-black/40 border-white/5 text-white'}`}
                        >
                          <option value="archive">Archive (Read-Only)</option>
                          <option value="delete">Deep Purge (Destructive)</option>
                          <option value="notify">Alert & Redirect</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Inactivity Threshold</label>
                        <span className="text-xs font-black text-[#00F0FF]">{formState.threshold} Days</span>
                      </div>
                      <input 
                        type="range" min="30" max="730" step="30"
                        value={formState.threshold}
                        onChange={e => setFormState({...formState, threshold: parseInt(e.target.value)})}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00F0FF]"
                      />
                      <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        <span>30D</span>
                        <span>2Y</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingRuleId(null); }}
                    className="flex-1 py-5 rounded-2xl border border-white/10 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                  >
                    Abort Calibration
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-5 rounded-2xl bg-[#00F0FF] text-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-[#00F0FF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingRuleId ? 'Confirm Calibration' : 'Commit Draft to Lab'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-10">
        <div className="flex-1 space-y-6 md:space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl md:text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Governance Protocol</h3>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 leading-relaxed">Define and Simulate Operational Intent</p>
            </div>
            <button 
              onClick={() => {
                setFormState({ name: '', description: '', provider: 'universal', action: 'archive', threshold: 180 });
                setEditingRuleId(null);
                setIsAdding(true);
              }}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-3 transition-all ${
                isDaylight ? 'bg-slate-900 text-white shadow-xl' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20 hover:scale-105 active:scale-95'
              }`}
            >
              <Plus className="w-4 h-4" />
              Draft New Rule
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {state.rules.map((policy) => (
              <Motion.div 
                key={policy.id}
                layout
                className={`p-6 rounded-[24px] border transition-all group ${
                  isDaylight 
                    ? 'bg-white border-slate-100 hover:border-slate-300 shadow-sm' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      policy.action === 'archive' ? 'bg-blue-500/10 text-blue-500' :
                      policy.action === 'delete' ? 'bg-[#FF5733]/10 text-[#FF5733]' :
                      'bg-[#00F0FF]/10 text-[#00F0FF]'
                    }`}>
                      {policy.action === 'archive' ? <Archive className="w-5 h-5" /> :
                       policy.action === 'delete' ? <Trash2 className="w-5 h-5" /> :
                       <ShieldAlert className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{policy.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{policy.provider} • {policy.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                      policy.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {policy.status}
                    </div>
                    <button 
                      onClick={() => removeRule(policy.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-[#FF5733]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-500 leading-relaxed mb-6 italic">"{policy.description}"</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Threshold</p>
                      <p className={`text-xs font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{policy.threshold} Days</p>
                    </div>
                    {policy.impact && (
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Simulated ROI</p>
                        <p className="text-xs font-bold text-emerald-500">${policy.impact.costSaved}/mo</p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleCalibrate(policy)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    Calibrate
                  </button>
                </div>
              </Motion.div>
            ))}
            
            {state.rules.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No operational rules defined.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-[350px] xl:w-[400px] shrink-0 space-y-6 md:space-y-8">
          <div className={`p-8 rounded-[32px] border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'} space-y-4`}>
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
              <Info className="w-3 h-3 text-[#00F0FF]" />
              Architectural Guidance
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              "Policies are non-destructive by default. Aethos utilizes 'Soft-Gates' to ensure operational continuity during the Archival Spectrum."
            </p>
          </div>

          <div className={`p-8 rounded-[32px] border relative overflow-hidden sticky top-32 ${
            isDaylight ? 'bg-white border-slate-100 shadow-xl shadow-slate-200' : 'bg-[#0B0F19] border-white/10 shadow-2xl'
          }`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Zap className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-10">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
                  Simulation Lab
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-10">
                  Execute an architectural simulation to visualize the operational impact of your {state.rules.filter(r => r.status === 'draft').length} draft policies before deployment.
                </p>

                <button 
                  onClick={handleSimulate}
                  disabled={isSimulating || state.rules.filter(r => r.status === 'draft').length === 0}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                    isSimulating 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : (state.rules.filter(r => r.status === 'draft').length === 0 
                        ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-white/5' 
                        : (isDaylight ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-[#00F0FF] text-black shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:scale-105 active:scale-95'))
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Run Operational Simulation</span>
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showResults && (
                  <Motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 pt-8 border-t border-white/10"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reclaimable ROI</p>
                          <p className="text-3xl font-black font-['Space_Grotesk'] text-[#00F0FF] tracking-tighter">${totalReclaimable}<span className="text-sm font-medium text-slate-500">/mo</span></p>
                        </div>
                        <TrendingDown className="w-6 h-6 text-[#00F0FF]" />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Storage Optimization</span>
                          <span className="text-white">{totalStorage} GB</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <Motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-[#00F0FF]" />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 space-y-2">
                         <div className="flex items-center gap-2 text-[#FF5733]">
                           <AlertTriangle className="w-3 h-3" />
                           <span className="text-[9px] font-black uppercase tracking-widest">Operational Risk</span>
                         </div>
                         <p className="text-[10px] text-slate-400 italic leading-relaxed">
                           "Simulated execution identifies {Math.floor(totalStorage / 40)} artifacts entering Soft-Gate. Metadata preserved as per Universal Adapter Pattern."
                         </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleCommit}
                        className="w-full py-5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                      >
                        Commit & Execute Protocol
                      </button>
                      <button 
                        onClick={() => setShowResults(false)}
                        className="w-full py-4 rounded-xl border border-white/10 text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors"
                      >
                        Discard Simulation
                      </button>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
