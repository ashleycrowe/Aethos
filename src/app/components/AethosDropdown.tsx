import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DropdownOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface AethosDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const AethosDropdown: React.FC<AethosDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  label, 
  placeholder = 'Select option...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDaylight } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all outline-none text-left group ${
            isOpen 
              ? (isDaylight ? 'border-[#00F0FF] ring-2 ring-[#00F0FF]/10 bg-white' : 'border-[#00F0FF] ring-2 ring-[#00F0FF]/20 bg-[#0B0F19]') 
              : (isDaylight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/10 hover:border-white/20')
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {selectedOption?.icon && (
              <div className="shrink-0 text-slate-400 group-hover:text-[#00F0FF] transition-colors">
                {selectedOption.icon}
              </div>
            )}
            <span className={`text-xs font-bold truncate ${
              selectedOption 
                ? (isDaylight ? 'text-slate-900' : 'text-white') 
                : 'text-slate-500'
            }`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00F0FF]' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`absolute left-0 right-0 mt-2 z-[100] rounded-[24px] border shadow-2xl overflow-hidden backdrop-blur-3xl ${
                isDaylight ? 'bg-white/95 border-slate-200' : 'bg-[#0B0F19]/90 border-white/10'
              }`}
            >
              <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group/opt ${
                      value === option.id 
                        ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]') 
                        : (isDaylight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/5 text-slate-300')
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {option.icon && (
                        <div className={`shrink-0 ${value === option.id ? 'text-current' : 'text-slate-500 group-hover/opt:text-current'}`}>
                          {option.icon}
                        </div>
                      )}
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[11px] font-bold truncate tracking-tight">{option.label}</span>
                        {option.description && (
                          <span className="text-[9px] opacity-60 truncate font-medium">{option.description}</span>
                        )}
                      </div>
                    </div>
                    {value === option.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
