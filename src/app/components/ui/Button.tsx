import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const { isDaylight } = useTheme();

  const baseStyles = "relative flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl border active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden group";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-[9px]",
    md: "px-6 py-3.5 text-[10px]",
    lg: "px-10 py-4.5 text-[11px]",
    xl: "px-12 py-5 text-[12px]"
  };

  const variantStyles = {
    primary: isDaylight 
      ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200" 
      : "bg-white border-white text-black hover:bg-slate-100 shadow-xl shadow-white/5",
    secondary: isDaylight
      ? "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    ghost: isDaylight
      ? "bg-transparent border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      : "bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5",
    alert: isDaylight
      ? "bg-[#FF5733] border-[#FF5733] text-white hover:bg-[#e64d2e] shadow-lg shadow-orange-100"
      : "bg-[#FF5733] border-[#FF5733] text-white hover:shadow-[0_0_20px_rgba(255,87,51,0.4)]",
    success: isDaylight
      ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
      : "bg-[#00F0FF] border-[#00F0FF] text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
  };

  return (
    <button 
      ref={ref}
      className={`
        ${baseStyles} 
        ${sizeStyles[size]} 
        ${variantStyles[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      )}
      <span className="relative z-10">{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      )}
      
      {/* Cinematic Hover Glow */}
      {!isDaylight && variant === 'success' && (
        <motion.div 
          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
          layoutId="button-glow"
        />
      )}
    </button>
  );
});

Button.displayName = 'Button';
