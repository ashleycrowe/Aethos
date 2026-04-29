import React from 'react';
import { motion as Motion } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Slack, 
  Box as BoxIcon, 
  Share2,
  MoreVertical,
  Search,
  Filter,
  Fingerprint,
  ExternalLink,
  Ghost
} from 'lucide-react';
import { useAethos } from '../context/AethosContext';
import { AethosIdentity, ProviderType } from '../types/aethos.types';
import { useTheme } from '../context/ThemeContext';

interface IdentitySynthesisProps {
  onSelectIdentity: (identity: AethosIdentity) => void;
}

export const IdentitySynthesis: React.FC<IdentitySynthesisProps> = ({ onSelectIdentity }) => {
  const { state } = useAethos();
  const { isDaylight } = useTheme();

  const providerIcons: Record<ProviderType, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: ShieldCheck
  };

  return (
    <div className={`p-8 rounded-[40px] border shadow-2xl overflow-hidden ${isDaylight ? 'bg-white border-slate-100' : 'bg-[#0B0F19] border-white/5'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-4">
            <Fingerprint className="w-6 h-6 text-[#00F0FF]" />
            Identity Mapping
          </h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Cross-Cloud Universal Synthesis</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter identities..."
              className={`rounded-2xl pl-12 pr-6 py-3 text-xs font-bold transition-all w-64 outline-none border focus:ring-2 ring-[#00F0FF]/20 ${
                isDaylight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'
              }`}
            />
          </div>
          <button className={`p-3 rounded-2xl border transition-colors ${isDaylight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              <th className="pb-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-4">Universal Identity</th>
              <th className="pb-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
              <th className="pb-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Adapters</th>
              <th className="pb-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Exposure</th>
              <th className="pb-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-4">Last Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
            {state.identities.map((identity) => {
              const PrimaryIcon = providerIcons[identity.provider] || Fingerprint;
              const hasLinks = !!identity.metadata.crossCloudLink;
              
              return (
                <tr 
                  key={identity.id} 
                  className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => onSelectIdentity(identity)}
                >
                  <td className="py-6 pl-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden transition-all border ${
                        isDaylight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5 group-hover:bg-[#00F0FF]/10 group-hover:border-[#00F0FF]/20'
                      }`}>
                        <PrimaryIcon className={`w-5 h-5 transition-colors ${isDaylight ? 'text-slate-900' : 'text-slate-400 group-hover:text-[#00F0FF]'}`} />
                        {hasLinks && (
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00F0FF] rounded-full border-2 border-white dark:border-[#0B0F19]" />
                        )}
                      </div>
                      <div>
                        <div className={`text-[13px] font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{identity.name}</div>
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-70">{identity.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      identity.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      identity.status === 'orphaned' ? 'bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20' :
                      'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${identity.status === 'active' ? 'bg-emerald-500 animate-pulse' : identity.status === 'orphaned' ? 'bg-[#FF5733]' : 'bg-slate-500'}`} />
                      {identity.status}
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`p-2 rounded-lg border ${isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'}`} title={identity.provider}>
                        <PrimaryIcon className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      {identity.metadata.crossCloudLink?.split(', ').map((link, i) => {
                        const provider = link.split('-')[0] as ProviderType;
                        const LinkIcon = providerIcons[provider] || Fingerprint;
                        return (
                          <div key={i} className={`p-2 rounded-lg border ${isDaylight ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'}`} title={link}>
                            <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-24 h-1 rounded-full overflow-hidden ${isDaylight ? 'bg-slate-100' : 'bg-white/10'}`}>
                        <div 
                          className={`h-full ${identity.riskFactor > 80 ? 'bg-[#FF5733]' : identity.riskFactor > 50 ? 'bg-amber-500' : 'bg-[#00F0FF]'}`}
                          style={{ width: `${identity.riskFactor}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-black font-['JetBrains_Mono'] ${identity.riskFactor > 50 ? 'text-[#FF5733]' : 'text-[#00F0FF]'}`}>{identity.riskFactor}%</span>
                    </div>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                        {new Date(identity.lastActive).toLocaleDateString()}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className={`mt-10 pt-8 border-t flex items-center justify-between ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic opacity-60">
          "Identities synthesized via Universal Metadata Engine logic."
        </p>
        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#00F0FF] hover:translate-x-1 transition-transform">
          View Full Directory <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
