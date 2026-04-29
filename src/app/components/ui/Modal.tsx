import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-4xl'
}) => {
  const { isDaylight } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-xl ${
              isDaylight ? 'bg-slate-900/40' : 'bg-black/80'
            }`}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col rounded-[40px] border transition-all duration-500 shadow-2xl ${
              isDaylight 
                ? 'bg-white border-slate-200 shadow-slate-900/20' 
                : 'bg-[#0B0F19] border-white/10 shadow-black'
            }`}
          >
            {/* Cinematic Header */}
            <div className={`p-10 pb-6 flex items-start justify-between gap-8 shrink-0 ${
              isDaylight ? 'bg-slate-50/50' : 'bg-white/[0.01]'
            }`}>
              <div className="space-y-3">
                {title && (
                  <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${
                    isDaylight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className={`p-3 rounded-2xl transition-all ${
                  isDaylight 
                    ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' 
                    : 'text-slate-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 pt-4">
              {children}
            </div>

            {/* Footer Logic (Optional) */}
            <div className={`p-10 border-t shrink-0 flex items-center justify-between gap-6 ${
              isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'
            }`}>
              <p className={`text-[9px] font-black uppercase tracking-widest italic leading-none ${
                isDaylight ? 'text-slate-400' : 'text-slate-600'
              }`}>
                "Intelligence snapshot locked for architectural review."
              </p>
              <button
                onClick={onClose}
                className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  isDaylight 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-[#00F0FF] text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                }`}
              >
                Dismiss Intelligence
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
