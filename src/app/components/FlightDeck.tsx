import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Clock, 
  Star, 
  Layout, 
  Plus, 
  ScanLine, 
  Sun, 
  Moon,
  ChevronRight,
  Globe,
  Slack,
  Share2,
  Box as BoxIcon,
  FileText,
  User,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { OracleSearch } from './OracleSearch';
import { useTheme } from '../context/ThemeContext';

interface FlightDeckProps {
  onBackToAdmin?: () => void;
}

export const FlightDeck: React.FC<FlightDeckProps> = ({ onBackToAdmin }) => {
  const { isDaylight, toggleDaylight } = useTheme();
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stream' | 'dock' | 'scan'>('stream');
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOracleOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const recentFiles = [
    { id: '1', title: 'Q3 Strategy Brief', type: 'File', provider: 'microsoft', workspace: 'Project Alpha', edited: '4m ago' },
    { id: '2', title: 'Product Roadmap 2026', type: 'File', provider: 'google', workspace: 'Strategy', edited: '2h ago' },
    { id: '3', title: 'Marketing Sync', type: 'Channel', provider: 'slack', workspace: 'Growth Ops', edited: '1d ago' },
    { id: '4', title: 'Compliance Vault', type: 'Workspace', provider: 'box', workspace: 'Legal', edited: '3d ago' },
  ];

  const pinnedWorkspaces = [
    { id: 'ws1', name: 'Project Alpha', color: '#00F0FF', items: 12 },
    { id: 'ws2', name: 'Field Maintenance', color: '#FF5733', items: 4 },
    { id: 'ws3', name: 'Executive Sync', color: '#A855F7', items: 8 },
  ];

  const providerIcons: Record<string, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDaylight ? 'bg-[#F8FAFC]' : 'bg-[#0B0F19]'}`}>
      <OracleSearch 
        isOpen={isOracleOpen} 
        onClose={() => setIsOracleOpen(false)} 
        isMobile={isMobile}
      />

      {!isDaylight && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF5733]/5 blur-[120px] rounded-full" />
        </div>
      )}

      <nav className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors ${
        isDaylight ? 'bg-white/80 border-slate-200' : 'bg-black/20 border-white/5'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBackToAdmin}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${
                isDaylight 
                  ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Exit Voyager</span>
            </button>

            <div className={`flex flex-col ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              <span className="text-xl font-black font-['Space_Grotesk'] tracking-[0.2em] uppercase">Aethos</span>
              <span className={`text-[8px] font-bold tracking-[0.4em] uppercase ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`}>
                Voyager Experience
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleDaylight}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isDaylight 
                  ? 'bg-amber-50 border-amber-200 text-amber-700' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isDaylight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isDaylight ? 'Daylight Protocol' : 'Cosmic Mode'}
              </span>
            </button>

            <div className={`w-10 h-10 rounded-xl overflow-hidden border ${isDaylight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className={`w-full h-full flex items-center justify-center font-bold ${isDaylight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-white'}`}>
                V
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 pb-32">
        {!isMobile && (
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 text-center space-y-8"
          >
            <div className="space-y-2">
              <h1 className={`text-4xl font-black font-['Space_Grotesk'] tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                What do you need, Voyager?
              </h1>
              <p className={`text-sm font-bold uppercase tracking-widest ${isDaylight ? 'text-slate-500' : 'text-slate-500'}`}>
                Jump directly to any file, person, or workspace.
              </p>
            </div>

            <div 
              onClick={() => setIsOracleOpen(true)}
              className={`max-w-3xl mx-auto p-6 rounded-[32px] border cursor-pointer transition-all hover:scale-[1.01] group flex items-center justify-between ${
                isDaylight 
                  ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' 
                  : 'bg-white/[0.03] border-white/10 backdrop-blur-xl hover:border-[#00F0FF]/30'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-100 text-slate-500' : 'bg-[#00F0FF]/10 text-[#00F0FF]'}`}>
                  <Search className="w-8 h-8" />
                </div>
                <span className={`text-2xl font-bold font-['Space_Grotesk'] tracking-tight ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>
                  Search Workspace...
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest ${
                isDaylight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-600'
              }`}>
                CMD + K
              </div>
            </div>
          </Motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${isDaylight ? 'text-slate-400' : 'text-slate-500'}`}>
                Recent Activity
              </h2>
              <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'
              }`}>
                Full History <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {recentFiles.map((m, i) => {
                const ProviderIcon = providerIcons[m.provider];
                return (
                  <Motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group p-6 rounded-[28px] border transition-all cursor-pointer flex items-center justify-between ${
                      isDaylight 
                        ? 'bg-white border-slate-100 hover:border-blue-200 shadow-sm' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
                        isDaylight ? 'bg-slate-50 text-slate-400' : 'bg-white/5 text-slate-600'
                      }`}>
                        {m.type === 'File' ? <FileText className="w-7 h-7" /> : <Slack className="w-7 h-7" />}
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold font-['Space_Grotesk'] tracking-tight mb-1 transition-colors ${
                          isDaylight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-[#00F0FF]'
                        }`}>
                          {m.title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-700'}`}>
                            {m.workspace}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-300' : 'text-slate-800'}`}>•</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-500' : 'text-slate-600'}`}>
                            {m.edited}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <ProviderIcon className={`w-5 h-5 ${isDaylight ? 'text-slate-300' : 'text-slate-800'}`} />
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${isDaylight ? 'text-slate-400' : 'text-slate-500'}`}>
                Workspaces
              </h2>
              <button className={`p-2 rounded-full border transition-colors ${
                isDaylight ? 'bg-white border-slate-200 text-slate-400 hover:text-blue-600' : 'bg-white/5 border-white/5 text-slate-600 hover:text-white'
              }`}>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {pinnedWorkspaces.map((ws, i) => (
                <Motion.div
                  key={ws.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className={`p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${
                    isDaylight 
                      ? 'bg-white border-slate-100 hover:shadow-lg' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity rounded-full" style={{ backgroundColor: ws.color }} />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: ws.color }} />
                      <div>
                        <h4 className={`text-lg font-black font-['Space_Grotesk'] tracking-widest uppercase ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                          {ws.name}
                        </h4>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-400' : 'text-slate-600'}`}>
                          {ws.items} Assets Pinned
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isDaylight ? 'text-slate-300' : 'text-slate-800'}`} />
                  </div>
                </Motion.div>
              ))}
            </div>

            {isMobile && (
              <GlassCard className={`p-8 border-t-4 border-t-[#00F0FF] ${isDaylight ? 'bg-blue-50/30' : ''}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      Physical Assets?
                    </h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDaylight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Scan a QR code on equipment to launch manuals instantly.
                    </p>
                  </div>
                </div>
                <button className="w-full py-4 rounded-[20px] bg-[#00F0FF] text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  Launch QR Scanner
                </button>
              </GlassCard>
            )}
          </div>
        </div>
      </main>

      {isMobile && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 transition-colors ${
          isDaylight ? 'bg-gradient-to-t from-white via-white/90 to-transparent' : 'bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/90 to-transparent'
        }`}>
          <div className={`max-w-md mx-auto p-2 rounded-full border shadow-2xl flex items-center justify-between transition-colors ${
            isDaylight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.05] border-white/10 backdrop-blur-2xl'
          }`}>
            <button 
              onClick={() => setActiveTab('stream')}
              className={`p-4 rounded-full transition-all ${activeTab === 'stream' ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black') : 'text-slate-500'}`}
            >
              <Layout className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveTab('dock')}
              className={`p-4 rounded-full transition-all ${activeTab === 'dock' ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black') : 'text-slate-500'}`}
            >
              <Star className="w-6 h-6" />
            </button>
            
            <button 
              onClick={() => setIsOracleOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] relative -top-4 border-4 border-[#0B0F19]"
            >
              <Mic className="w-7 h-7" />
            </button>

            <button 
              onClick={() => setActiveTab('scan')}
              className={`p-4 rounded-full transition-all ${activeTab === 'scan' ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black') : 'text-slate-500'}`}
            >
              <ScanLine className="w-6 h-6" />
            </button>
            <button className="p-4 rounded-full text-slate-500">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
