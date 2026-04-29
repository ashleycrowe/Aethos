import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';

interface NexusSyncProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

export const NexusSync: React.FC<NexusSyncProps> = ({ status }) => {
  if (status === 'idle') return null;

  const config = {
    saving: { icon: <Loader2 className="w-3 h-3 animate-spin" />, text: 'Syncing Nexus...', color: 'text-slate-400' },
    saved: { icon: <Cloud className="w-3 h-3 text-[#00F0FF]" />, text: 'Nexus Pointers Secured', color: 'text-[#00F0FF]' },
    error: { icon: <CloudOff className="w-3 h-3" />, text: 'Sync Error', color: 'text-[#FF5733]' }
  };

  const current = config[status as keyof typeof config];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ${current.color}`}
      >
        {current.icon}
        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">
          {current.text}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};
