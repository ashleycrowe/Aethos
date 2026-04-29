import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  GitMerge, 
  ArrowRight, 
  Share2, 
  Slack, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu,
  Info,
  CheckCircle2,
  X,
  Plus,
  Zap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { ProviderType } from '../types/aethos.types';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

interface SuggestedLink {
  id: string;
  confidence: number;
  reason: string;
  identities: {
    primary: {
      name: string;
      email: string;
      provider: ProviderType;
    };
    suggested: {
      name: string;
      email: string;
      provider: ProviderType;
    };
  };
}

const initialSuggestions: SuggestedLink[] = [
  {
    id: 'suggest-1',
    confidence: 98,
    reason: 'Exact email match across providers.',
    identities: {
      primary: { name: 'Sarah Jenkins', email: 'sarah.j@aethos.ai', provider: 'microsoft' },
      suggested: { name: 'Sarah Jenkins', email: 'sarah.j@aethos.ai', provider: 'slack' }
    }
  },
  {
    id: 'suggest-2',
    confidence: 85,
    reason: 'High name similarity and identical department metadata.',
    identities: {
      primary: { name: 'Michael Chen', email: 'm.chen@aethos.ai', provider: 'microsoft' },
      suggested: { name: 'Mike Chen', email: 'mike.chen@gmail.com', provider: 'google' }
    }
  },
  {
    id: 'suggest-3',
    confidence: 92,
    reason: 'Previously linked in Box governance layer.',
    identities: {
      primary: { name: 'Alex Rivera', email: 'arivera@aethos.ai', provider: 'microsoft' },
      suggested: { name: 'Alex Rivera', email: 'arivera@aethos.ai', provider: 'box' }
    }
  }
];

export const IdentityReconciliation = () => {
  const { isDaylight } = useTheme();
  const [suggestions, setSuggestions] = useState<SuggestedLink[]>(initialSuggestions);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleMerge = async (id: string) => {
    setIsProcessing(id);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSuggestions(prev => prev.filter(s => s.id !== id));
    setIsProcessing(null);
    toast.success("Identity Synthesized", {
      description: "Cloud accounts have been merged into a single Universal ID."
    });
  };

  const providerIcons: Record<ProviderType, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: ShieldCheck
  };

  function BoxIcon(props: any) { return <div className={props.className}><Globe {...props} /></div> }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className={`text-xl font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Suggested Linkage</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">AI-Driven Identity Reconciliation</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/20">
          <Cpu className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-[10px] font-black text-[#00F0FF] uppercase tracking-widest">{suggestions.length} Merges Identified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {suggestions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-20 text-center rounded-[40px] border border-dashed ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h4 className={`text-xl font-black uppercase tracking-tight mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>All Clear</h4>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Graph is fully synthesized</p>
            </motion.div>
          ) : (
            suggestions.map((suggestion) => {
              const PrimaryIcon = providerIcons[suggestion.identities.primary.provider] || Fingerprint;
              const SuggestedIcon = providerIcons[suggestion.identities.suggested.provider] || Fingerprint;

              return (
                <motion.div
                  key={suggestion.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  className={`p-8 rounded-[40px] border relative overflow-hidden group transition-all duration-500 ${
                    isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0B0F19] border-white/5 hover:border-white/20 shadow-2xl'
                  }`}
                >
                  <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-10 w-full">
                      {/* Primary Identity */}
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl relative ${isDaylight ? 'bg-slate-100 text-slate-900 shadow-sm' : 'bg-black/40 text-white border border-white/10'}`}>
                          {suggestion.identities.primary.name[0]}
                          <div className="absolute -top-2 -right-2 p-2 bg-white dark:bg-black rounded-lg border border-white/10">
                            <PrimaryIcon className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] font-black uppercase tracking-tight truncate ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{suggestion.identities.primary.name}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{suggestion.identities.primary.email}</p>
                        </div>
                      </div>

                      {/* Bridge */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                          suggestion.confidence > 90 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {suggestion.confidence}% MATCH
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-[1px] w-8 bg-slate-200 dark:bg-white/10" />
                          <GitMerge className="w-5 h-5 text-[#00F0FF] animate-pulse" />
                          <div className="h-[1px] w-8 bg-slate-200 dark:bg-white/10" />
                        </div>
                      </div>

                      {/* Suggested Identity */}
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl relative ${isDaylight ? 'bg-slate-100 text-slate-900 shadow-sm' : 'bg-black/40 text-white border border-white/10'}`}>
                          {suggestion.identities.suggested.name[0]}
                          <div className="absolute -top-2 -right-2 p-2 bg-white dark:bg-black rounded-lg border border-white/10">
                            <SuggestedIcon className="w-3.5 h-3.5 text-pink-500" />
                          </div>
                        </div>
                        <div className="min-w-0 text-left">
                          <p className={`text-[13px] font-black uppercase tracking-tight truncate ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{suggestion.identities.suggested.name}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{suggestion.identities.suggested.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto shrink-0">
                       <div className={`flex-1 xl:w-64 p-4 rounded-[28px] border text-left flex items-start gap-4 ${isDaylight ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-black/40 border-white/5'}`}>
                          <Info className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-500 leading-relaxed font-black uppercase tracking-widest italic">
                            {suggestion.reason}
                          </p>
                       </div>
                       <div className="flex items-center gap-3 w-full md:w-auto">
                         <IconButton icon={X} variant="ghost" title="Ignore Suggestion" />
                         <Button 
                            variant="success" 
                            isLoading={isProcessing === suggestion.id}
                            onClick={() => handleMerge(suggestion.id)}
                            icon={CheckCircle2}
                         >
                            Confirm Merge
                         </Button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <div className={`p-8 rounded-[40px] border overflow-hidden relative ${isDaylight ? 'bg-indigo-50 border-indigo-100' : 'bg-[#00F0FF]/5 border-[#00F0FF]/10'}`}>
         {/* Decorative Icon */}
         <Zap className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 -rotate-12" />
         
         <div className="flex items-start gap-6 relative z-10">
            <div className={`p-4 rounded-2xl ${isDaylight ? 'bg-white shadow-sm' : 'bg-white/10'}`}>
              <ShieldAlert className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div>
              <h5 className={`text-[13px] font-black uppercase tracking-[0.2em] mb-3 ${isDaylight ? 'text-indigo-900' : 'text-white'}`}>Intelligence Recommendation</h5>
              <p className={`text-[11px] leading-relaxed italic font-medium max-w-2xl ${isDaylight ? 'text-indigo-700/80' : 'text-white/60'}`}>
                "Aethos has identified multiple 'Ghost' identities that lack primary owners. Linking these identities to their historical counterparts will unlock **$1,200/mo** in potential storage reclamation."
              </p>
            </div>
            <div className="ml-auto shrink-0 pt-2">
               <Button variant="secondary" size="sm">Automate Linkage</Button>
            </div>
         </div>
      </div>
    </div>
  );
};
