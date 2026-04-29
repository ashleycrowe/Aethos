import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { X, FileText, Folder, Pin, ChevronRight, Info, Search, Globe, Slack, Box as BoxIcon, HardDrive, Layout, ChevronDown } from 'lucide-react';
import { ProviderType, ContainerType } from '../types/aethos.types';
import { useAethos } from '../context/AethosContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface LensViewProps {
  isOpen: boolean;
  onClose: () => void;
  containerId: string;
}

export const LensView: React.FC<LensViewProps> = ({ isOpen, onClose, containerId }) => {
  const { user } = useUser();
  const { isDaylight } = useTheme();
  const { state: { workspaces }, pinToWorkspace } = useAethos();
  const [searchQuery, setSearchQuery] = useState('');
  const [pinningId, setPinningId] = useState<string | null>(null);

  // Mocking Multi-Provider "Children" response
  const mockFiles = [
    { id: 'f1', title: 'Q3_Budget_Final.xlsx', type: 'spreadsheet' as ContainerType, size: '2.4MB', modified: '2h ago', provider: 'microsoft' as ProviderType },
    { id: 'f2', title: 'Campaign_Vision.gdoc', type: 'document' as ContainerType, size: '0KB', modified: 'Yesterday', provider: 'google' as ProviderType },
    { id: 'f3', title: 'Slack_History_Export', type: 'folder' as ContainerType, size: '1.2GB', modified: '3 days ago', provider: 'slack' as ProviderType },
    { id: 'f4', title: 'Product_Assets', type: 'folder' as ContainerType, size: '4.5GB', modified: '1h ago', provider: 'box' as ProviderType },
    { id: 'f5', title: 'Local_Audit_Log.log', type: 'document' as ContainerType, size: '8.2MB', modified: '5h ago', provider: 'local' as ProviderType },
  ];

  const filteredFiles = mockFiles.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const isHighRisk = (filename: string) => {
    const highRiskExtensions = ['.xlsx', '.csv', '.gdoc', '.log'];
    return highRiskExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const handlePin = (wsId: string, file: typeof mockFiles[0]) => {
    pinToWorkspace(wsId, {
      id: file.id,
      type: file.type,
      title: file.title,
      provider: file.provider,
      url: '#',
      category: 'reference',
      pinnedAt: new Date().toISOString()
    });
    setPinningId(null);
    toast.success(`Pinned to ${workspaces.find(ws => ws.id === wsId)?.name}`);
  };

  const providerIcons: Record<ProviderType, any> = {
    microsoft: Globe,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: HardDrive
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full max-w-4xl h-[80vh] border rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col relative ${
              isDaylight ? 'bg-white border-slate-200' : 'bg-[#0B0F19]/80 border-white/10'
            }`}
          >
            {/* Header */}
            <div className={`p-8 border-b backdrop-blur-xl flex justify-between items-center ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
              <div>
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDaylight ? 'bg-blue-600' : 'bg-[#00F0FF]'}`} />
                  Universal Lens Overlay
                </div>
                <h2 className={`text-2xl font-bold font-['Space_Grotesk'] tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Exploring: <span className="text-slate-400">{containerId}</span>
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 group"
              >
                <X className={`w-5 h-5 ${isDaylight ? 'text-slate-900' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Risk Banner */}
            {filteredFiles.some(f => isHighRisk(f.title)) && (
              <div className="mx-8 mt-6 p-4 bg-[#FF5733]/10 border border-[#FF5733]/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF5733] animate-ping" />
                  <span className="text-[10px] font-black text-[#FF5733] uppercase tracking-[0.2em]">Universal Risk Vectors Detected</span>
                </div>
                <span className="text-[8px] text-[#FF5733]/60 font-bold uppercase tracking-widest">Cross-Cloud Exposure Identified</span>
              </div>
            )}

            {/* Search */}
            <div className="px-8 py-4 border-b border-white/5 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search across this metadata stream..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all font-['Inter'] border ${
                    isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid gap-4">
                {filteredFiles.map((file) => {
                  const ProviderIcon = providerIcons[file.provider];
                  const isPinning = pinningId === file.id;

                  return (
                    <Motion.div
                      key={file.id}
                      layout
                      className={`group flex items-center justify-between p-4 rounded-2xl transition-all border ${
                        isDaylight ? 'bg-slate-50 border-slate-100 hover:border-slate-300' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl relative ${
                          file.type === 'folder' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : isHighRisk(file.title)
                              ? 'bg-[#FF5733]/10 text-[#FF5733] shadow-[0_0_15px_rgba(255,87,51,0.2)]'
                              : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {file.type === 'folder' ? <Folder className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          {isHighRisk(file.title) && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF5733] animate-pulse" />
                          )}
                        </div>
                        <div>
                          <div className={`font-bold text-sm mb-0.5 flex items-center gap-2 ${isDaylight ? 'text-slate-900' : 'text-white'} ${isHighRisk(file.title) ? '!text-[#FF5733]' : ''}`}>
                            {file.title}
                            <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <ProviderIcon className="w-2 h-2" />
                              {file.provider}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {file.size} • Modified {file.modified}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setPinningId(isPinning ? null : file.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            isPinning 
                              ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-white text-black')
                              : (isDaylight ? 'bg-slate-200 text-slate-900' : 'bg-[#00F0FF]/10 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black')
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                          Pin Signal
                          <ChevronDown className={`w-3 h-3 transition-transform ${isPinning ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isPinning && (
                            <Motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className={`absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl border shadow-2xl z-[110] ${
                                isDaylight ? 'bg-white border-slate-200' : 'bg-[#161B28] border-white/10'
                              }`}
                            >
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest p-2 mb-1">Target Nexus</p>
                              {workspaces.map(ws => (
                                <button 
                                  key={ws.id}
                                  onClick={() => handlePin(ws.id, file)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left group ${
                                    isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <div className="w-6 h-6 rounded flex items-center justify-center font-black text-[10px] text-black" style={{ backgroundColor: ws.color }}>
                                    {ws.name.charAt(0)}
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{ws.name}</span>
                                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ))}
                              {workspaces.length === 0 && (
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest p-2 text-center">No active Nexuses</p>
                              )}
                            </Motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 flex justify-center items-center gap-2 ${isDaylight ? 'bg-slate-50 border-t border-slate-100' : 'bg-white/[0.02] border-t border-white/5'}`}>
              <Info className="w-3.5 h-3.5 text-slate-600" />
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">
                Direct Stream from Universal Metadata Engine • Operational Clarity Protocol Active
              </p>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
