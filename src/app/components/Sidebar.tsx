import React from 'react';
import { 
  Palette,
  Users, 
  BookOpen,
  User, 
  Settings,
  ShieldCheck,
  Eye,
  Camera,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Archive,
  Target,
  BarChart3,
  Fingerprint,
  Zap,
  Cpu,
  Sparkles,
  Layers,
  Brain,
  Tags,
  ChevronDown,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/app/context/ThemeContext';
import { useUser } from '@/app/context/UserContext';
import { useVersion } from '@/app/context/VersionContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openDemoLab?: () => void;
  openCalibration: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  autoCollapse?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed,
  setIsCollapsed,
  autoCollapse = true
}) => {
  const { isDaylight } = useTheme();
  const { user } = useUser();
  const { version } = useVersion();
  const [toolsExpanded, setToolsExpanded] = React.useState(true);

  const handleMouseEnter = () => {
    if (autoCollapse) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoCollapse) {
      setIsCollapsed(true);
    }
  };

  // V1 walkthrough menu: keep only the testable core modules visible.
  const allMenuItems = [
    {
      label: 'Core',
      items: [
        { id: 'oracle', icon: Cpu, label: 'Oracle Search', description: 'Cross-platform intelligent search', minVersion: 'V1' },
        { id: 'nexus', icon: LayoutGrid, label: 'Nexus', description: 'Virtual workspace bridge', minVersion: 'V1' },
        { id: 'insights', icon: Sparkles, label: 'Intelligence', description: 'Consolidated insights & metadata', minVersion: 'V1' },
      ]
    },
    {
      label: 'Tools',
      collapsible: true,
      items: [
        { id: 'archival', icon: Archive, label: 'Remediation', description: 'Archival & cleanup protocols', minVersion: 'V1' },
        { id: 'admin', icon: Settings, label: 'Admin', description: 'Tenant, auth, and deployment controls', minVersion: 'V1' },
      ]
    }
  ];

  // Filter menu based on version
  const versionOrder = ['V1', 'V1.5', 'V2', 'V3', 'V4'];
  const currentVersionIndex = versionOrder.indexOf(version);
  
  const menuGroups = allMenuItems.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const itemVersionIndex = versionOrder.indexOf(item.minVersion || 'V1');
      return itemVersionIndex <= currentVersionIndex;
    })
  })).filter(group => group.items.length > 0); // Remove empty groups
  const mobileNavItems = menuGroups.flatMap((group) => group.items).slice(0, 5);

  const NavButton = ({ item }: { item: any }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center transition-all duration-300 group relative h-12 rounded-xl mb-1 ${
          isCollapsed ? 'justify-center px-0' : 'px-4 gap-4'
        } ${
          isActive 
            ? (isDaylight ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]') 
            : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
        }`}
      >
        <item.icon className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isCollapsed ? 'w-5 h-5' : 'w-4.5 h-4.5'}`} />
        
        {!isCollapsed && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden">
            {item.label}
          </span>
        )}
        
        {isActive && !isDaylight && (
          <motion.div layoutId="nav-line" className={`absolute rounded-full bg-white ${isCollapsed ? 'right-0 w-1 h-5' : '-right-2 w-1 h-6'}`} />
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap z-[200] shadow-2xl border border-white/10">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  return (
    <>
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hidden md:flex h-[calc(100vh-40px)] m-5 rounded-[32px] flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative border border-white/5 shadow-2xl overflow-visible backdrop-blur-3xl group/sidebar ${
        isDaylight ? 'bg-white/80 border-slate-200 shadow-slate-200' : 'bg-[#0B0F19]/80 shadow-black/50'
      } ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Enhanced Toggle Button (Operational Lock) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
        className={`absolute -right-4 top-24 w-8 h-12 rounded-xl border border-white/10 bg-[#0B0F19] flex items-center justify-center text-slate-400 hover:text-[#00F0FF] transition-all shadow-2xl z-[200] group/toggle overflow-hidden cursor-pointer ${
          isCollapsed ? 'rotate-180' : ''
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#00F0FF]/0 via-[#00F0FF]/5 to-[#00F0FF]/0 opacity-0 group-hover/toggle:opacity-100 transition-opacity" />
        <ChevronLeft className="w-4 h-4 relative z-10 transition-transform group-hover/toggle:scale-125" />
        
        {/* Visual Indicator of Lock State */}
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all ${isCollapsed ? 'bg-[#FF5733] animate-pulse' : 'bg-[#00F0FF]'}`} />
      </button>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Brand Header */}
        <div className={`pt-8 mb-6 transition-all duration-500 relative ${isCollapsed ? 'px-0 flex flex-col items-center' : 'px-6'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'mb-4' : 'mb-6'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group cursor-pointer relative ${isDaylight ? 'bg-slate-900' : 'bg-white'}`}>
               <img 
                 src="figma:asset/859f06bc073a2b7fea02cba7e30b0f6f6794d27a.png" 
                 alt="Brand Logo" 
                 className={`w-5 h-5 object-contain ${isDaylight ? 'invert-0' : 'invert'}`}
               />
               {isCollapsed && <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-[#00F0FF] rounded-full border-2 border-[#0B0F19] animate-pulse" />}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="transition-all"
                >
                  <h2 className="font-black text-sm uppercase tracking-tighter leading-none text-slate-900 dark:text-white">AETHOS</h2>
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 leading-none text-[#00F0FF]">Operational Clarity</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10"
            >
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Layer</span>
            </motion.div>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-grow space-y-10 overflow-y-auto no-scrollbar px-4">
          {menuGroups.map((group) => (
            <section key={group.label} className="transition-all">
              {!isCollapsed && group.collapsible && (
                <button
                  onClick={() => setToolsExpanded(!toolsExpanded)}
                  className="w-full flex items-center justify-between text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] mb-4 px-4 hover:text-slate-400 dark:hover:text-slate-500 cursor-pointer transition-colors group/header"
                >
                  <div className="flex items-center gap-2">
                    <span>{group.label}</span>
                    {!toolsExpanded && (
                      <span className="text-[7px] px-1.5 py-0.5 rounded-md bg-slate-600/20 text-slate-500 font-black">
                        {group.items.length}
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: toolsExpanded ? 0 : -90 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="group-hover/header:text-[#00F0FF] transition-colors"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </button>
              )}
              {!isCollapsed && !group.collapsible && (
                <h3 className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] mb-4 px-4">
                  {group.label}
                </h3>
              )}
              <AnimatePresence initial={false}>
                {(!group.collapsible || toolsExpanded || isCollapsed) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex flex-col overflow-hidden"
                  >
                    {group.items.map((item) => <NavButton key={item.id} item={item} />)}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          ))}

          <section>
            {!isCollapsed && (
              <h3 className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] mb-4 px-4">
                Systems
              </h3>
            )}
            <div className="flex flex-col opacity-30 grayscale pointer-events-none">
              <div className={`flex items-center h-12 ${isCollapsed ? 'justify-center w-full' : 'px-4 gap-4'}`}>
                 <BookOpen className="w-4.5 h-4.5 shrink-0" />
                 {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Learning Lab</span>}
              </div>
            </div>
          </section>
        </div>

        {/* Profile/Tier Status */}
        <div className={`p-4 mt-auto border-t border-slate-100 dark:border-white/5 transition-all duration-500`}>
          <div className={`flex items-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all ${isCollapsed ? 'p-2 flex-col gap-4' : 'p-3 gap-3'}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-grow min-w-0">
                <p className="text-[10px] font-black uppercase tracking-tight truncate text-slate-900 dark:text-white">{user.role}</p>
                <p className="text-slate-400 text-[8px] truncate uppercase tracking-widest font-black leading-none mt-0.5">{user.tier} Tier</p>
              </div>
            )}

            <button 
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-lg transition-all ${activeTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <nav
      aria-label="Primary mobile navigation"
      className={`fixed inset-x-3 bottom-3 z-[180] grid grid-cols-5 gap-1 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-md md:hidden ${
        isDaylight
          ? 'border-slate-200 bg-white/90 shadow-slate-300/40'
          : 'border-white/10 bg-[#0B0F19]/90 shadow-black/60'
      }`}
    >
      {mobileNavItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-all ${
              isActive
                ? 'bg-[#00F0FF] text-black shadow-[0_0_18px_rgba(0,240,255,0.25)]'
                : isDaylight
                  ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="max-w-full truncate text-[8px] font-black uppercase tracking-[0.08em]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
    </>
  );
};
