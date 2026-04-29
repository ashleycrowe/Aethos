import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Image as ImageIcon, 
  Link2, 
  Slack, 
  MessageSquare, 
  Target, 
  Users, 
  Zap, 
  Sparkles,
  X,
  Globe,
  Plus
} from 'lucide-react';
import { Button } from './ui/Button';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface PulseCommunicatorProps {
  workspaceId: string;
}

export const PulseCommunicator: React.FC<PulseCommunicatorProps> = ({ workspaceId }) => {
  const { blastToWorkspace, state: { workspaces } } = useAethos();
  const { isDaylight } = useTheme();
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [linkedSources, setLinkedSources] = useState<string[]>([]);
  const [showSources, setShowSources] = useState(false);

  const handleBlast = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await blastToWorkspace(workspaceId, message);
      setMessage('');
      setIsExpanded(false);
      toast.success("Operational Blast Transmitted", {
        description: `Synchronizing across ${linkedSources.length + 1} architectural nodes.`
      });
    } catch (error) {
      toast.error("Transmission Failed", {
        description: "An error occurred while broadcasting the signal."
      });
    } finally {
      setIsSending(false);
    }
  };

  const toggleSource = (source: string) => {
    setLinkedSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  return (
    <div className={`relative rounded-[32px] border transition-all ${
      isExpanded 
        ? (isDaylight ? 'bg-white border-slate-900 shadow-2xl' : 'bg-white/[0.05] border-[#00F0FF]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)]')
        : (isDaylight ? 'bg-slate-50 border-slate-100 hover:border-slate-300' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]')
    }`}>
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black'}`}>
             <Send className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              placeholder="Transmit an operational blast to the workspace..."
              className={`w-full bg-transparent border-none outline-none resize-none text-sm md:text-base font-medium placeholder:text-slate-500/50 transition-all ${
                isExpanded ? 'h-32' : 'h-12 py-3'
              } ${isDaylight ? 'text-slate-900' : 'text-white'}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
            
            <AnimatePresence>
              {isExpanded && (
                <Motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5"
                >
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    <button 
                      onClick={() => setShowSources(!showSources)}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                        linkedSources.length > 0 
                          ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]' 
                          : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                      }`}
                    >
                       <Link2 className="w-3.5 h-3.5" /> 
                       {linkedSources.length > 0 ? `${linkedSources.length} Linked` : 'Link Sources'}
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all">
                       <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => setIsExpanded(false)}
                      className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <Button 
                      size="sm" 
                      onClick={handleBlast}
                      disabled={!message.trim() || isSending}
                      className="px-8"
                    >
                       {isSending ? 'Transmitting...' : 'Broadcast Signal'} <Zap className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Source Linking Panel */}
      <AnimatePresence>
        {showSources && isExpanded && (
          <Motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 bg-black/20"
          >
            <div className="p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Universal Adapters</h4>
                  <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Select nodes to broadcast simultaneously</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'slack-general', name: '#general', provider: 'slack', icon: Slack },
                    { id: 'viva-product', name: 'Product Evolution', provider: 'microsoft', icon: Target },
                    { id: 'teams-arch', name: 'Architectural Sync', provider: 'microsoft', icon: Globe },
                  ].map(source => (
                    <button 
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                        linkedSources.includes(source.id)
                          ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                      }`}
                    >
                      <source.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate">{source.name}</span>
                      {linkedSources.includes(source.id) && <Motion.div layoutId="check" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />}
                    </button>
                  ))}
                  <button className="p-4 rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-3 text-slate-600 hover:text-slate-400 transition-all">
                     <Plus className="w-4 h-4" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Add Adapter</span>
                  </button>
               </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
