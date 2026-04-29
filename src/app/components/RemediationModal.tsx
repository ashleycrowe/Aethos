import React from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Archive, 
  Trash2, 
  X, 
  ArrowRight, 
  CircleCheck,
  Lock,
  Eye,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ProviderType } from '../types/aethos.types';

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'archive' | 'delete';
  provider: ProviderType;
  itemName: string;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  provider, 
  itemName 
}) => {
  const getProtocol = () => {
    if (type === 'delete') {
      return {
        title: 'Initialize Deep Purge',
        warning: 'This action initiates a provider-side deletion instruction.',
        steps: [
          'Instruction sent to source adapter',
          'Soft-Gate: Moved to Trash for 30 days',
          'Audit trail logged for compliance'
        ],
        color: '#FF5733',
        icon: Trash2
      };
    }

    const protocols: Record<ProviderType, any> = {
      microsoft: {
        title: 'M365 Archival Protocol',
        steps: [
          'Set container to Read-Only',
          'Preserve all metadata and versions',
          'Keep original URL active for reference'
        ],
        icon: Lock,
        isTier1: true
      },
      google: {
        title: 'Google Archive Protocol',
        steps: [
          'Move artifact to [Aethos_Archive] Shared Drive',
          'Revoke all user and external permissions',
          'Flag as Inactive Shadow Capital'
        ],
        icon: Archive,
        isTier2: true
      },
      slack: {
        title: 'Slack Archival Protocol',
        steps: [
          'Initialize native channel archiving',
          'Maintain data searchability for legal hold',
          'Disable interactive posting and threads'
        ],
        icon: FileText,
        isTier1: true
      },
      box: {
        title: 'Box Governance Protocol',
        steps: [
          'Relocate artifact to Governance_Vault',
          'Apply global file lock',
          'Identify and notify original orphan owners'
        ],
        icon: Lock,
        isTier2: true
      },
      local: {
        title: 'Cold Storage Protocol',
        steps: [
          'Relocate to Cold_Tier blob storage',
          'Apply governance metadata tags',
          'Reduce storage cost by ~80% (Archive Tier)'
        ],
        icon: Archive,
        isTier1: false
      }
    };

    const p = protocols[provider];
    return {
      title: p.title,
      warning: 'Archiving preserves data while removing operational noise.',
      steps: p.steps,
      color: '#00F0FF',
      icon: p.icon
    };
  };

  const protocol = getProtocol();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg relative"
          >
            <GlassCard className="p-8 border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <protocol.icon className="w-6 h-6" style={{ color: protocol.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black font-['Space_Grotesk'] text-white uppercase tracking-tight">
                      {protocol.title}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Artifact: <span className="text-white">{itemName}</span>
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Warning Box */}
              <div className={`p-4 rounded-2xl mb-8 flex items-start gap-3 border ${protocol.isTier2 ? 'bg-[#FF5733]/5 border-[#FF5733]/10' : 'bg-[#00F0FF]/5 border-[#00F0FF]/10'}`}>
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${protocol.isTier2 ? 'text-[#FF5733]' : 'text-[#00F0FF]'}`} />
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-300 leading-relaxed uppercase tracking-widest">
                    {protocol.isTier2 ? "Shadow Asset Identified: Tier 2 Discovery Protocol" : protocol.warning}
                  </p>
                  {protocol.isTier2 && (
                    <p className="text-[8px] text-[#FF5733] font-black uppercase tracking-widest">
                      Action will notify owners of unauthorized storage usage.
                    </p>
                  )}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4 mb-10">
                <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Operational Steps</h3>
                {protocol.steps.map((step: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#00F0FF]">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-400 group-hover:text-white transition-colors">{step}</p>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onClose}
                  className="py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: `${protocol.color}20`, 
                    border: `1px solid ${protocol.color}40`,
                    color: protocol.color
                  }}
                >
                  Confirm Protocol
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
            
            {/* Background Glow */}
            <div 
              className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] opacity-20 pointer-events-none"
              style={{ backgroundColor: protocol.color }}
            />
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
