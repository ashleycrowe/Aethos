import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrandSettings {
  color: string;
  name: string;
  logoUrl?: string;
}

interface ThemeContextType {
  isDaylight: boolean;
  setDaylight: (val: boolean) => void;
  toggleDaylight: () => void;
  brand: BrandSettings;
  updateBrand: (newBrand: Partial<BrandSettings>) => void;
  getBrandColor: (type: 'neon' | 'ink') => string;
  getContrastText: (hex: string) => 'black' | 'white';
  getLuminance: (hex: string) => number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to calculate luminance
const calculateLuminance = (hex: string) => {
  const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
  const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Helper to darken color for better contrast on light backgrounds
const darkenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDaylight, setIsDaylight] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aethos-theme');
      if (saved) return saved === 'daylight';
      return !window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [brand, setBrand] = useState<BrandSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aethos-brand');
      return saved ? JSON.parse(saved) : {
        color: '#00F0FF', 
        name: 'STAR SPIRIT',
        logoUrl: 'figma:asset/859f06bc073a2b7fea02cba7e30b0f6f6794d27a.png'
      };
    }
    return {
      color: '#00F0FF', 
      name: 'STAR SPIRIT',
      logoUrl: 'figma:asset/859f06bc073a2b7fea02cba7e30b0f6f6794d27a.png'
    };
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('aethos-theme')) {
        setIsDaylight(!e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('aethos-theme', isDaylight ? 'daylight' : 'cosmic');
    // Tailwind v4 looks for .dark class on a parent (or html)
    if (isDaylight) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isDaylight]);

  useEffect(() => {
    localStorage.setItem('aethos-brand', JSON.stringify(brand));
  }, [brand]);

  const toggleDaylight = () => setIsDaylight(prev => !prev);
  const setDaylight = (val: boolean) => setIsDaylight(val);

  const getLuminance = (hex: string) => calculateLuminance(hex);

  const getContrastText = (hex: string): 'black' | 'white' => {
    return getLuminance(hex) > 0.5 ? 'black' : 'white';
  };

  const updateBrand = (newBrand: Partial<BrandSettings>) => {
    setBrand(prev => ({ ...prev, ...newBrand }));
  };

  const getBrandColor = (type: 'neon' | 'ink'): string => {
    if (type === 'neon') return brand.color;
    const luminance = getLuminance(brand.color);
    if (luminance > 0.6) {
      return darkenColor(brand.color, 30);
    }
    return brand.color; 
  };

  return (
    <ThemeContext.Provider value={{ isDaylight, setDaylight, toggleDaylight, brand, updateBrand, getBrandColor, getContrastText, getLuminance }}>
      {/* 
        This wrapper ensures the root container reacts to the theme change.
        We use 'dark' as a CSS class to trigger Tailwind's dark mode.
      */}
      <div className={`min-h-screen transition-colors duration-500 ${isDaylight ? 'light bg-slate-50 text-slate-900' : 'dark bg-[#0B0F19] text-white'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
