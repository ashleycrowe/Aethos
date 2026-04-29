import React from 'react';
import { motion } from 'motion/react';
import { Search, ShieldCheck, AlertCircle, Inbox } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface EmptyStateProps {
  type: 'no-results' | 'no-waste' | 'no-workspaces' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description, action }) => {
  const configs = {
    'no-results': {
      icon: <Search className="w-12 h-12" />,
      title: title || 'No Pointers Found',
      description: description || 'Try adjusting your search or filters to locate metadata in the tenant.',
      color: 'text-[#00F0FF]'
    },
    'no-waste': {
      icon: <ShieldCheck className="w-12 h-12" />,
      title: title || 'Tenant Perimeter Clean',
      description: description || 'Excellent. All scanned sites show activity within the 180-day threshold.',
      color: 'text-emerald-400'
    },
    'no-workspaces': {
      icon: <Inbox className="w-12 h-12" />,
      title: title || 'No Nexus Workspaces',
      description: description || 'Start grouping SharePoint sites and Teams into virtual containers.',
      color: 'text-[#00F0FF]'
    },
    'error': {
      icon: <AlertCircle className="w-12 h-12" />,
      title: title || 'Intelligence Link Severed',
      description: description || 'We lost communication with Azure Functions. Please verify your API permissions.',
      color: 'text-[#FF5733]'
    }
  };

  const current = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex justify-center py-20 px-6"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className={`mx-auto w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${current.color} shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
          {current.icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-['Space_Grotesk'] uppercase tracking-tight text-white">{current.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{current.description}</p>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#00F0FF]/50 text-white rounded-xl transition-all font-bold uppercase text-xs tracking-widest"
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};
