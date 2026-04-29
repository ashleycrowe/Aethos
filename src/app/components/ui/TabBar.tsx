import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabBarProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  variant?: 'glass' | 'solid' | 'neon';
}

export const TabBar: React.FC<TabBarProps> = ({ 
  items, 
  activeTab, 
  onTabChange, 
  className = '',
  variant = 'glass'
}) => {
  const { isDaylight } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return isDaylight 
          ? 'bg-slate-100 border-slate-200 shadow-sm' 
          : 'bg-white/5 border-white/5 shadow-[0_0_20px_rgba(0,240,255,0.05)]';
      case 'solid':
        return isDaylight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-slate-900 border-white/10';
      case 'glass':
      default:
        return isDaylight 
          ? 'bg-slate-100/80 border-slate-200/50 backdrop-blur-md' 
          : 'bg-white/5 border-white/5 backdrop-blur-xl';
    }
  };

  const getButtonStyles = (isActive: boolean) => {
    if (isActive) {
      if (isDaylight) return 'bg-slate-900 text-white shadow-lg';
      return variant === 'neon' 
        ? 'bg-white text-black shadow-[0_0_30px_rgba(0,240,255,0.3)] border-[#00F0FF]/50' 
        : 'bg-white text-black shadow-xl';
    }
    return 'text-slate-500 hover:text-slate-900 dark:hover:text-white';
  };

  return (
    <div className={`flex items-center p-1.5 rounded-2xl border transition-all overflow-x-auto no-scrollbar max-w-full ${getVariantStyles()} ${className}`}>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-5 md:px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 relative group shrink-0 ${
              isActive 
                ? (isDaylight ? 'text-white' : 'text-black') 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4 relative z-10 transition-transform group-hover:scale-110" />
            <span className="relative z-10 whitespace-nowrap">{item.label}</span>
            
            {isActive && (
              <motion.div 
                layoutId="tab-highlight"
                className={`absolute inset-0 rounded-xl pointer-events-none ${
                  isDaylight ? 'bg-slate-900 shadow-lg' : (variant === 'neon' ? 'bg-white shadow-[0_0_30px_rgba(0,240,255,0.3)]' : 'bg-white shadow-xl')
                }`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
