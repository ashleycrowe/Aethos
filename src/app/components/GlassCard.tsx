import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = false, onClick }) => {
  const { settings, governance } = useSettings();
  const { isDaylight } = useTheme();

  const bunkerClasses = cn(
    "bg-linear-to-br from-white/[0.05] to-white/[0.01] border border-white/10 text-white",
    settings.cinematicBlur && !governance.disableHighFidelity && "backdrop-blur-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    (!settings.cinematicBlur || governance.disableHighFidelity) && "bg-black/80 shadow-lg"
  );

  const daylightClasses = cn(
    "bg-white border-slate-200 shadow-sm text-slate-900",
    "backdrop-blur-none" // Remove blur in Daylight Mode per guidelines
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[24px] transition-all duration-500 relative flex flex-col min-w-0 p-[var(--space-fluid-sm)]", // Fluid base padding
        isDaylight ? daylightClasses : bunkerClasses,
        hover && !isDaylight && "hover:border-[#00F0FF]/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] hover:bg-white/[0.07]",
        hover && isDaylight && "hover:border-slate-300 hover:shadow-md hover:bg-slate-50",
        className
      )}
    >
      {!isDaylight && (
        <div className="absolute inset-0 bg-radial-gradient(circle_at_50%_0%,white/5,transparent) pointer-events-none" />
      )}
      {children}
    </div>
  );
};
