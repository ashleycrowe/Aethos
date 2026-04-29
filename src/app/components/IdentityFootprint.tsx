import React from 'react';
import { motion as Motion } from 'motion/react';
import { 
  Fingerprint, 
  ShieldCheck, 
  Link2, 
  ExternalLink, 
  AlertCircle,
  CircleCheck,
  Database,
  Globe,
  Slack,
  Box as BoxIcon,
  Share2,
  GitMerge,
  ChevronRight,
  Info
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ProviderType, AethosIdentity } from '../types/aethos.types';

interface IdentityFootprintProps {
  identity: AethosIdentity;
}

export const IdentityFootprint: React.FC<IdentityFootprintProps> = ({ identity }) => {
  const providerIcons: Record<ProviderType, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: Database
  };

  // Simulated logic to generate footprint based on identity metadata
  const generateFootprint = (idnt: AethosIdentity) => {
    const primaryNode = {
      provider: idnt.provider,
      id: idnt.metadata.externalId,
      email: idnt.email,
      status: idnt.status === 'active' ? 'Active' : 'Alert',
      confidence: 100,
      source: idnt.metadata.source === 'Graph' ? 'Azure AD / Entra ID' : idnt.metadata.source,
      isSourceOfTruth: idnt.provider === 'microsoft'
    };

    const secondaryNodes = (idnt.metadata.crossCloudLink || '').split(', ').filter(Boolean).map((link, i) => {
      const [provider, ...rest] = link.split('-');
      const p = provider as ProviderType;
      
      // Variations based on the specific person for "realism"
      let confidence = 98 - (i * 2);
      let email = idnt.email;
      let status = 'Active';

      if (idnt.name.includes('Jordan')) {
        confidence = 82; // Trigger fuzzy match alert
        email = 'j.smith.contractor@gmail.com';
      }
      
      if (idnt.status === 'orphaned') {
        status = 'Legacy Trace';
        confidence = 65;
      }

      return {
        provider: p,
        id: rest.join('-').toUpperCase(),
        email: email,
        status: status,
        confidence: confidence,
        source: `${p.charAt(0).toUpperCase() + p.slice(1)} Workspace`,
        isSourceOfTruth: false
      };
    });

    return [primaryNode, ...secondaryNodes];
  };

  const footprintData = generateFootprint(identity);
  const hasConflict = identity.name.includes('Jordan');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Universal Footprint Analysis</h4>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Reconciled via Universal Identity Engine</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F0FF]/5 border border-[#00F0FF]/20">
          <Fingerprint className="w-3 h-3 text-[#00F0FF]" />
          <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">Unified Identity</span>
        </div>
      </div>

      <div className="space-y-4">
        {footprintData.map((node, i) => {
          const Icon = providerIcons[node.provider];
          return (
            <div key={i} className="group relative">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
                <div className={`p-3 rounded-xl ${node.isSourceOfTruth ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">{node.provider} node</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                      <span className={`text-[10px] font-black ${node.confidence > 90 ? 'text-[#00F0FF]' : 'text-amber-500'}`}>{node.confidence}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-['JetBrains_Mono']">{node.email}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${node.status === 'Active' ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {node.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {node.isSourceOfTruth && (
                    <div className="px-2 py-1 rounded-md bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[7px] font-black text-[#00F0FF] uppercase tracking-widest">
                      Truth
                    </div>
                  )}
                  <button className="p-2 rounded-lg bg-white/5 text-slate-600 hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              {i < footprintData.length - 1 && (
                <div className="absolute left-[26px] bottom-[-20px] w-[1px] h-5 bg-white/5" />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Reconciliation Logic</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">Primary UID</span>
            <span className="text-white">Primary SMTP Address</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">Secondary Bridge</span>
            <span className="text-white">Fuzzy Name (85%+ Match)</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">Conflict Resolver</span>
            <span className="text-white">Architect Override</span>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all flex items-center justify-center gap-2">
          Modify Reconciliation Bridge
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {hasConflict ? (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FF5733]/10 border border-[#FF5733]/20 animate-pulse">
          <AlertCircle className="w-4 h-4 text-[#FF5733] shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest">
            Aethos detected a profile mismatch for <span className="text-white">{identity.name}</span>. The Google identity uses a personal alias. <span className="text-[#FF5733] underline cursor-pointer font-black">Force Reconcile?</span>
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/10">
          <Info className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-widest">
            Identity reconciled with <span className="text-white">100% precision</span>. All connected nodes share verified enterprise credentials.
          </p>
        </div>
      )}
    </div>
  );
};
