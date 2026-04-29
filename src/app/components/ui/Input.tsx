import React, { forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  icon: Icon,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  const { isDaylight } = useTheme();

  return (
    <div className={`space-y-2 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors ${
            isDaylight ? 'text-slate-400 group-focus-within:text-slate-900' : 'text-slate-500 group-focus-within:text-[#00F0FF]'
          }`} />
        )}
        <input
          ref={ref}
          className={`
            w-full py-4.5 rounded-2xl border outline-none transition-all duration-300 font-bold text-[13px] tracking-tight
            ${Icon ? 'pl-14 pr-6' : 'px-6'}
            ${isDaylight 
              ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:shadow-sm' 
              : 'bg-black/40 border-white/5 text-white placeholder-slate-600 focus:bg-black/60 focus:border-[#00F0FF]/50 focus:ring-4 focus:ring-[#00F0FF]/5'
            }
            ${error ? 'border-[#FF5733]/50 focus:border-[#FF5733]' : ''}
          `}
          {...props}
        />
      </div>
      {(error || hint) && (
        <p className={`text-[9px] font-black uppercase tracking-widest pl-1 ${error ? 'text-[#FF5733]' : 'text-slate-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
