import React, { forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'ghost' | 'glass' | 'solid' | 'alert';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const { isDaylight } = useTheme();

  const sizeStyles = {
    sm: "p-2 rounded-lg",
    md: "p-3 rounded-xl",
    lg: "p-4 rounded-2xl"
  };

  const variantStyles = {
    ghost: isDaylight
      ? "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
      : "text-slate-500 hover:text-white hover:bg-white/10",
    glass: isDaylight
      ? "bg-white/80 border border-slate-200 text-slate-900 shadow-sm backdrop-blur-md"
      : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 backdrop-blur-xl",
    solid: isDaylight
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-white text-black hover:bg-slate-100",
    alert: isDaylight
      ? "text-[#FF5733] hover:bg-[#FF5733]/10"
      : "text-[#FF5733] hover:bg-[#FF5733]/10"
  };

  return (
    <button
      ref={ref}
      className={`
        transition-all duration-300 active:scale-90 flex items-center justify-center shrink-0
        ${sizeStyles[size]} 
        ${variantStyles[variant]} 
        ${className}
      `}
      {...props}
    >
      <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} />
    </button>
  );
});

IconButton.displayName = 'IconButton';
