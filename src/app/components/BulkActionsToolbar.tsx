import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Archive, Bell, X, Trash2, Pin } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClear: () => void;
  onArchive: () => void;
  onNotify: () => void;
  onPinToWorkspace?: () => void;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({ 
  selectedCount, 
  onClear, 
  onArchive, 
  onNotify,
  onPinToWorkspace
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div 
            role="toolbar" 
            aria-label="Bulk actions for selected sites"
            className="bg-[#0B0F19]/80 backdrop-blur-xl border border-[#00F0FF]/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(0,240,255,0.1)] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#00F0FF] text-black px-3 py-1 rounded-full text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider">
                {selectedCount} Selected
              </div>
              <button 
                onClick={onClear}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Clear Selection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onPinToWorkspace}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Pin className="w-4 h-4" />
                Pin to Workspace
              </button>
              <button 
                onClick={onNotify}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Bell className="w-4 h-4 text-[#00F0FF]" />
                Notify Owners
              </button>
              <button 
                onClick={onArchive}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 text-[#FF5733] hover:bg-[#FF5733]/20 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Archive className="w-4 h-4" />
                Bulk Archive
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
