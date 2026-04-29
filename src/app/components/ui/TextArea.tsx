import React, { forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  hint,
  className = '',
  rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-6 py-4.5 rounded-2xl border outline-none transition-all duration-300 font-medium text-[13px] leading-relaxed resize-none
          ${isDaylight 
            ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:shadow-sm' 
            : 'bg-black/40 border-white/5 text-white placeholder-slate-600 focus:bg-black/60 focus:border-[#00F0FF]/50 focus:ring-4 focus:ring-[#00F0FF]/5'
          }
          ${error ? 'border-[#FF5733]/50 focus:border-[#FF5733]' : ''}
        `}
        {...props}
      />
      {(error || hint) && (
        <p className={`text-[9px] font-black uppercase tracking-widest pl-1 ${error ? 'text-[#FF5733]' : 'text-slate-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
