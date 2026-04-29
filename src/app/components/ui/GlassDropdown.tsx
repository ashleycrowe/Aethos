import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface GlassDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "Select option...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDaylight } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-3 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all group overflow-hidden relative ${
            isDaylight 
              ? 'bg-white border-slate-200 text-slate-900 shadow-sm focus:ring-2 ring-blue-100' 
              : 'bg-black/40 border-white/5 text-white focus:ring-2 ring-[#00F0FF]/20'
          } ${isOpen ? (isDaylight ? 'border-blue-500' : 'border-[#00F0FF]/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]') : ''}`}
        >
          {/* Inner Gloss for Dark Mode */}
          {!isDaylight && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          )}
          
          <span className={`text-sm font-bold truncate ${!value && 'text-slate-500 opacity-60'}`}>
            {value || placeholder}
          </span>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-[#00F0FF]' : 'text-slate-500'}`} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute z-[100] left-0 right-0 mt-3 rounded-2xl border overflow-hidden shadow-2xl backdrop-blur-3xl ${
                isDaylight 
                  ? 'bg-white/95 border-slate-200' 
                  : 'bg-[#0B0F19]/95 border-white/10'
              }`}
            >
              <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                {options.map((option) => {
                  const isSelected = value === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl flex items-center justify-between text-left text-sm font-bold transition-all mb-1 last:mb-0 group ${
                        isSelected 
                          ? (isDaylight ? 'bg-slate-100 text-blue-600' : 'bg-[#00F0FF]/10 text-[#00F0FF]')
                          : (isDaylight ? 'hover:bg-slate-50 text-slate-600' : 'hover:bg-white/5 text-slate-400')
                      }`}
                    >
                      <span className="truncate">{option}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
