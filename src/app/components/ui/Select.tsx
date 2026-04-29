import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = false,
  className = ''
}, ref) => {
  const { isDaylight } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine external ref with internal ref if needed
  // But usually for Select we want the container for click-outside
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable 
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className={`space-y-2 relative w-full ${className}`} ref={(node) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-6 py-4.5 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-300 group
          ${isDaylight 
            ? 'bg-slate-50 border-slate-200 hover:border-slate-400' 
            : 'bg-black/40 border-white/5 hover:border-white/20'
          }
          ${isOpen ? (isDaylight ? 'border-slate-900 bg-white shadow-sm' : 'border-[#00F0FF]/50 bg-black/60 shadow-[0_0_20px_rgba(0,240,255,0.05)]') : ''}
        `}
      >
        <div className="flex items-center gap-3 truncate">
          {selectedOption?.icon}
          <span className={`text-[13px] font-bold tracking-tight truncate ${
            selectedOption ? (isDaylight ? 'text-slate-900' : 'text-white') : 'text-slate-500'
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
            className={`
              absolute left-0 right-0 top-full mt-3 rounded-3xl border shadow-2xl z-50 overflow-hidden
              ${isDaylight ? 'bg-white border-slate-200' : 'bg-[#151B28] border-white/10 shadow-black'}
            `}
          >
            {searchable && (
              <div className={`p-4 border-b ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search options..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none transition-all ${
                      isDaylight ? 'bg-slate-50 focus:bg-white border-slate-100' : 'bg-black/40 focus:bg-black/60 border-white/5'
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
              {filteredOptions.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No matches identified</span>
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group mb-1 last:mb-0
                      ${option.value === value 
                        ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]')
                        : (isDaylight ? 'hover:bg-slate-50 text-slate-900' : 'hover:bg-white/5 text-slate-300 hover:text-white')
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[12px] font-bold tracking-tight">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-[9px] opacity-60 truncate font-medium">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {option.value === value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Select.displayName = 'Select';
